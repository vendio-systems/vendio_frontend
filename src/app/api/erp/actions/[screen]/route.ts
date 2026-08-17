import { randomUUID } from "node:crypto";
import { db, nowIso, transaction } from "@/lib/database";
import { requireRole, verifyCsrf } from "@/lib/request-security";
export const runtime = "nodejs";
const text = (value: unknown, name: string, max = 100) => { if (typeof value !== "string" || value.trim().length < 2) throw new Error(`${name} inválido.`); return value.trim().replace(/[<>\u0000-\u001f]/g, "").slice(0, max); };
const integer = (value: unknown, name: string, minimum = 0) => { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`${name} inválido.`); return parsed; };
const money = (value: unknown, name: string) => { const parsed = Number(value); if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${name} inválido.`); return Math.round(parsed * 100); };

export async function POST(request: Request, context: { params: Promise<{ screen: string }> }) {
  const access = requireRole(request, ["CLIENT", "ADMIN", "DEVELOPER", "OWNER"]); if ("error" in access || !access.session.storeId) return Response.json({ message: "error" in access ? access.error : "Loja não encontrada." }, { status: "error" in access ? access.status : 404 });
  if (!verifyCsrf(request)) return Response.json({ message: "Token CSRF inválido." }, { status: 403 });
  const { screen } = await context.params, body = await request.json(), storeId = access.session.storeId, userId = access.session.sub, createdAt = nowIso();
  try {
    const entity = transaction(() => {
      let entityId: string = randomUUID(), entityName = screen.toUpperCase();
      if (screen === "pedidos") { const customer = text(body.customer, "Cliente", 100), total = money(body.total, "Total"); const orderId = `PED-${Date.now().toString().slice(-7)}`; db.prepare("INSERT INTO orders (id, store_id, customer_name, total_cents, status, created_at) VALUES (?, ?, ?, ?, 'PENDING', ?)").run(orderId, storeId, customer, total, createdAt); db.prepare("INSERT INTO notifications (id, store_id, title, message, kind, created_at) VALUES (?, ?, 'Novo pedido', ?, 'ORDER', ?)").run(randomUUID(), storeId, `${orderId} foi registrado.`, createdAt); entityId = orderId; entityName = "ORDER"; }
      else if (screen === "clientes") { const name = text(body.name, "Nome", 100), email = text(body.email, "E-mail", 254).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido."); db.prepare("INSERT INTO customers (id, store_id, name, email, created_at) VALUES (?, ?, ?, ?, ?)").run(entityId, storeId, name, email, createdAt); entityName = "CUSTOMER"; }
      else if (screen === "financeiro") { const description = text(body.description, "Descrição", 160), type = body.type === "PAYABLE" ? "PAYABLE" : "RECEIVABLE", amount = money(body.amount, "Valor"), dueAt = new Date(String(body.dueAt)); if (Number.isNaN(dueAt.getTime())) throw new Error("Vencimento inválido."); db.prepare("INSERT INTO financial_entries (id, store_id, description, type, amount_cents, due_at, status) VALUES (?, ?, ?, ?, ?, ?, 'OPEN')").run(entityId, storeId, description, type, amount, dueAt.toISOString()); entityName = "FINANCIAL_ENTRY"; }
      else if (screen === "fornecedores" || screen === "compras") { const name = text(body.name, "Fornecedor", 120), contact = text(body.contact, "Contato", 160), leadTime = integer(body.leadTime, "Prazo", 0); db.prepare("INSERT INTO suppliers (id, store_id, name, contact, lead_time_days) VALUES (?, ?, ?, ?, ?)").run(entityId, storeId, name, contact, leadTime); entityName = "SUPPLIER"; }
      else if (screen === "cupons") { const code = text(body.code, "Código", 30).toUpperCase().replace(/[^A-Z0-9_-]/g, ""); const discount = integer(body.discount, "Desconto", 1); if (discount > 100) throw new Error("O desconto não pode ultrapassar 100%."); db.prepare("INSERT INTO coupons (id, store_id, code, discount_percent) VALUES (?, ?, ?, ?)").run(entityId, storeId, code, discount); entityName = "COUPON"; }
      else if (screen === "entregas") { const orderId = text(body.orderId, "Pedido", 80), carrier = text(body.carrier, "Transportadora", 100), tracking = text(body.tracking, "Rastreio", 100); if (!db.prepare("SELECT 1 FROM orders WHERE id = ? AND store_id = ?").get(orderId, storeId)) throw new Error("Pedido não encontrado."); db.prepare("INSERT INTO shipments (id, store_id, order_id, carrier, tracking_code, status) VALUES (?, ?, ?, ?, ?, 'PREPARING')").run(entityId, storeId, orderId, carrier, tracking); entityName = "SHIPMENT"; }
      else if (screen === "integracoes") { const name = text(body.name, "Integração", 100), category = text(body.category, "Categoria", 50).toUpperCase(); db.prepare("INSERT INTO integrations (id, store_id, name, category, status) VALUES (?, ?, ?, ?, 'PENDING')").run(entityId, storeId, name, category); entityName = "INTEGRATION"; }
      else if (screen === "loja") { const name = text(body.name, "Nome da loja", 60); db.prepare("UPDATE stores SET name = ? WHERE id = ?").run(name, storeId); entityId = storeId; entityName = "STORE"; }
      else throw new Error("Esta operação ainda não está disponível para o módulo.");
      db.prepare("INSERT INTO audit_events (id, store_id, user_id, action, entity, entity_id, created_at) VALUES (?, ?, ?, 'CREATE_OR_UPDATE', ?, ?, ?)").run(randomUUID(), storeId, userId, entityName, entityId, createdAt);
      return { id: entityId };
    });
    return Response.json({ message: "Operação concluída com sucesso.", data: entity }, { status: 201 });
  } catch (error) { const raw = error instanceof Error ? error.message : "Dados inválidos."; const message = raw.includes("UNIQUE") ? "Já existe um registro com estes dados." : raw; return Response.json({ message }, { status: 400 }); }
}
