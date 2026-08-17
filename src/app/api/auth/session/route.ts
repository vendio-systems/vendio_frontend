import { currentUser } from "@/lib/auth";
import { getCookie } from "@/lib/request-security";
export const runtime = "nodejs";
export async function GET(request: Request) { const user = currentUser(getCookie(request, "vendio_session")); return user ? Response.json({ authenticated: true, user }) : Response.json({ authenticated: false, message: "Sessão inválida ou expirada." }, { status: 401 }); }
