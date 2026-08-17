import { randomUUID } from "node:crypto";
import { db, nowIso, transaction } from "@/lib/database";
import { requireRole, verifyCsrf } from "@/lib/request-security";

export const runtime = "nodejs";
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const access = requireRole(request, ["CLIENT", "ADMIN", "DEVELOPER", "OWNER"]);
  if ("error" in access || !access.session.storeId) return Response.json({ message: "error" in access ? access.error : "Loja não encontrada." }, { status: "error" in access ? access.status : 404 });
  if (!verifyCsrf(request)) return Response.json({ message: "Token CSRF inválido." }, { status: 403 });
  try {
    const { id } = await context.params;
    transaction(() => {
      const result = db.prepare("UPDATE products SET status = 'ARCHIVED' WHERE id = ? AND store_id = ? AND status = 'ACTIVE'").run(id, access.session.storeId);
      if (result.changes !== 1) throw new Error("Produto não encontrado ou já arquivado.");
      db.prepare("INSERT INTO audit_events (id, store_id, user_id, action, entity, entity_id, created_at) VALUES (?, ?, ?, 'ARCHIVE', 'PRODUCT', ?, ?)").run(randomUUID(), access.session.storeId, access.session.sub, id, nowIso());
    });
    return Response.json({ message: "Produto arquivado com sucesso." });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Não foi possível arquivar o produto." }, { status: 400 });
  }
}
