import { randomUUID } from "node:crypto";
import { db, nowIso, transaction } from "@/lib/database";
import { requireRole, verifyCsrf } from "@/lib/request-security";

export const runtime = "nodejs";
const transitions: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PICKING", "CANCELLED"],
  PICKING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["COMPLETED"],
  COMPLETED: [], CANCELLED: [],
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const access = requireRole(request, ["CLIENT", "ADMIN", "DEVELOPER", "OWNER"]);
  if ("error" in access || !access.session.storeId) return Response.json({ message: "error" in access ? access.error : "Loja não encontrada." }, { status: "error" in access ? access.status : 404 });
  if (!verifyCsrf(request)) return Response.json({ message: "Token CSRF inválido." }, { status: 403 });
  try {
    const { id } = await context.params;
    const body = await request.json();
    const nextStatus = typeof body.status === "string" ? body.status.toUpperCase() : "";
    const result = transaction(() => {
      const order = db.prepare("SELECT id, status, total_cents FROM orders WHERE id = ? AND store_id = ?").get(id, access.session.storeId) as unknown as { id: string; status: string; total_cents: number } | undefined;
      if (!order) throw new Error("Pedido não encontrado.");
      if (!transitions[order.status]?.includes(nextStatus)) throw new Error("Transição de status não permitida.");
      db.prepare("UPDATE orders SET status = ? WHERE id = ? AND store_id = ?").run(nextStatus, id, access.session.storeId);
      if (nextStatus === "CANCELLED") {
        const items = db.prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ? AND product_id IS NOT NULL").all(id) as unknown as { product_id: string; quantity: number }[];
        const restore = db.prepare("UPDATE products SET on_hand = on_hand + ? WHERE id = ? AND store_id = ?");
        for (const item of items) restore.run(item.quantity, item.product_id, access.session.storeId);
      }
      if (nextStatus === "PAID") db.prepare("INSERT INTO financial_entries (id, store_id, description, type, amount_cents, due_at, status) VALUES (?, ?, ?, 'RECEIVABLE', ?, ?, 'PAID')").run(randomUUID(), access.session.storeId, `Recebimento do pedido ${id}`, order.total_cents, nowIso());
      const createdAt = nowIso();
      db.prepare("INSERT INTO audit_events (id, store_id, user_id, action, entity, entity_id, metadata, created_at) VALUES (?, ?, ?, 'STATUS_CHANGE', 'ORDER', ?, ?, ?)").run(randomUUID(), access.session.storeId, access.session.sub, id, JSON.stringify({ from: order.status, to: nextStatus }), createdAt);
      db.prepare("INSERT INTO notifications (id, store_id, title, message, kind, created_at) VALUES (?, ?, 'Pedido atualizado', ?, 'ORDER', ?)").run(randomUUID(), access.session.storeId, `${id}: ${order.status} → ${nextStatus}.`, createdAt);
      return { id, status: nextStatus };
    });
    return Response.json({ message: "Status atualizado com sucesso.", data: result });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Não foi possível atualizar o pedido." }, { status: 400 });
  }
}
