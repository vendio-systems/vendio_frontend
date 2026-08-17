import { db } from "@/lib/database";
import { requireRole, verifyCsrf } from "@/lib/request-security";

export const runtime = "nodejs";
const csvValue = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export async function POST(request: Request) {
  const access = requireRole(request, ["CLIENT", "ADMIN", "DEVELOPER", "OWNER"]);
  if ("error" in access || !access.session.storeId) return Response.json({ message: "error" in access ? access.error : "Loja não encontrada." }, { status: "error" in access ? access.status : 404 });
  if (!verifyCsrf(request)) return Response.json({ message: "Token CSRF inválido." }, { status: 403 });
  const entries = db.prepare("SELECT description, type, amount_cents, due_at, status FROM financial_entries WHERE store_id = ? ORDER BY due_at").all(access.session.storeId) as unknown as { description: string; type: string; amount_cents: number; due_at: string; status: string }[];
  const rows = entries.map((entry) => [entry.description, entry.type, (entry.amount_cents / 100).toFixed(2), entry.due_at, entry.status].map(csvValue).join(","));
  const header = ["descricao", "tipo", "valor", "vencimento", "status"].map(csvValue).join(",");
  return new Response(`\uFEFF${[header, ...rows].join("\r\n")}\r\n`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=vendio-financeiro.csv", "Cache-Control": "no-store, private" } });
}
