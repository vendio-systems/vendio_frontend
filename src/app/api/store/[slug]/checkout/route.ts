import { randomUUID } from "node:crypto";
import { db, nowIso, transaction } from "@/lib/database";
import { rateLimit } from "@/lib/request-security";

export const runtime = "nodejs";
type Item = { productId: string; quantity: number };
type Product = { id: string; sku: string; name: string; price_cents: number; on_hand: number };

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const retryAfter = rateLimit(request, "checkout", 10, 60_000);
  if (retryAfter) return Response.json({ message: "Muitas tentativas. Aguarde um momento." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const name = String(body.name ?? "").trim().replace(/[<>\u0000-\u001f]/g, "").slice(0, 100);
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);
    const phone = String(body.phone ?? "").replace(/[^0-9+() -]/g, "").slice(0, 30);
    const items = body.items as Item[];
    if (name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 8) throw new Error("Preencha corretamente seus dados.");
    if (!Array.isArray(items) || !items.length || items.length > 50) throw new Error("A sacola está vazia ou inválida.");
    const store = db.prepare("SELECT id FROM stores WHERE slug = ? AND status = 'ACTIVE'").get(slug) as unknown as { id: string } | undefined;
    if (!store) throw new Error("Loja não encontrada.");

    const order = transaction(() => {
      const quantities = new Map<string, number>();
      for (const item of items) {
        if (typeof item?.productId !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) throw new Error("Quantidade inválida.");
        quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
      }
      const selected: { product: Product; quantity: number }[] = [];
      let total = 0;
      for (const [productId, quantity] of quantities) {
        const product = db.prepare("SELECT id, sku, name, price_cents, on_hand FROM products WHERE id = ? AND store_id = ? AND status = 'ACTIVE'").get(productId, store.id) as unknown as Product | undefined;
        if (!product || product.on_hand < quantity) throw new Error("Um produto não possui estoque suficiente.");
        total += product.price_cents * quantity;
        if (!Number.isSafeInteger(total)) throw new Error("O valor do pedido é inválido.");
        selected.push({ product, quantity });
      }

      const createdAt = nowIso();
      const orderId = `WEB-${Date.now().toString().slice(-8)}-${randomUUID().slice(0, 4)}`;
      const existingCustomer = db.prepare("SELECT id FROM customers WHERE store_id = ? AND email = ? ORDER BY created_at LIMIT 1").get(store.id, email) as unknown as { id: string } | undefined;
      const customerId = existingCustomer?.id ?? randomUUID();
      if (existingCustomer) db.prepare("UPDATE customers SET name = ?, orders_count = orders_count + 1, total_spent_cents = total_spent_cents + ? WHERE id = ? AND store_id = ?").run(name, total, customerId, store.id);
      else db.prepare("INSERT INTO customers (id, store_id, name, email, orders_count, total_spent_cents, created_at) VALUES (?, ?, ?, ?, 1, ?, ?)").run(customerId, store.id, name, email, total, createdAt);
      db.prepare("INSERT INTO orders (id, store_id, customer_id, customer_name, total_cents, status, created_at) VALUES (?, ?, ?, ?, ?, 'PENDING', ?)").run(orderId, store.id, customerId, name, total, createdAt);

      const addItem = db.prepare("INSERT INTO order_items (id, order_id, product_id, sku, product_name, unit_price_cents, quantity, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      const removeStock = db.prepare("UPDATE products SET on_hand = on_hand - ? WHERE id = ? AND store_id = ? AND on_hand >= ?");
      for (const { product, quantity } of selected) {
        const changed = removeStock.run(quantity, product.id, store.id, quantity);
        if (changed.changes !== 1) throw new Error("O estoque foi alterado. Revise sua sacola.");
        addItem.run(randomUUID(), orderId, product.id, product.sku, product.name, product.price_cents, quantity, createdAt);
      }
      db.prepare("INSERT INTO notifications (id, store_id, title, message, kind, created_at) VALUES (?, ?, 'Pedido da loja', ?, 'ORDER', ?)").run(randomUUID(), store.id, `${orderId} recebido de ${name}.`, createdAt);
      db.prepare("INSERT INTO audit_events (id, store_id, action, entity, entity_id, metadata, created_at) VALUES (?, ?, 'PUBLIC_CHECKOUT', 'ORDER', ?, ?, ?)").run(randomUUID(), store.id, orderId, JSON.stringify({ itemCount: selected.length, totalCents: total }), createdAt);
      return { id: orderId, totalCents: total };
    });
    return Response.json({ message: "Pedido criado com sucesso.", order }, { status: 201 });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Não foi possível concluir o pedido." }, { status: 400 });
  }
}
