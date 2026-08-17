import { listOrders } from "@/lib/erp";
import { requireRole } from "@/lib/request-security";
export const runtime = "nodejs";
export async function GET(request: Request) { const access = requireRole(request, ["CLIENT", "ADMIN", "DEVELOPER", "OWNER"]); return "error" in access || !access.session.storeId ? Response.json({ message: "error" in access ? access.error : "Loja não encontrada." }, { status: "error" in access ? access.status : 404 }) : Response.json({ data: listOrders(access.session.storeId) }); }
