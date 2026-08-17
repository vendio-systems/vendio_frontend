import { db } from "@/lib/database";
import { requireRole, verifyCsrf } from "@/lib/request-security";

export const runtime = "nodejs";
const csvValue = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export async function POST(request: Request) {
  const access = requireRole(request, ["CLIENT", "ADMIN", "DEVELOPER", "OWNER"]);
  if ("error" in access || !access.session.storeId) return Response.json({ message: "error" in access ? access.error : "Loja não encontrada." }, { status: "error" in access ? access.status : 404 });
  if (!verifyCsrf(request)) return Response.json({ message: "Token CSRF inválido." }, { status: 403 });
  const products = db.prepare("SELECT sku, name, on_hand, minimum, location, price_cents, cost_cents, status FROM products WHERE store_id = ? ORDER BY name").all(access.session.storeId) as unknown as Record<string, string | number>[];
  const headers = ["sku", "produto", "saldo", "minimo", "localizacao", "preco", "custo", "status"];
  const fields = ["sku", "name", "on_hand", "minimum", "location", "price_cents", "cost_cents", "status"];
  const rows = products.map((product) => fields.map((field) => field.endsWith("_cents") ? (Number(product[field]) / 100).toFixed(2) : product[field]).map(csvValue).join(","));
  return new Response(`\uFEFF${[headers.map(csvValue).join(","), ...rows].join("\r\n")}\r\n`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=vendio-estoque.csv", "Cache-Control": "no-store, private" } });
}
