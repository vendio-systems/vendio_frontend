import { createTeamUser } from "@/lib/auth";
import { requireRole, verifyCsrf } from "@/lib/request-security";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const access = requireRole(request, ["ADMIN", "DEVELOPER", "OWNER"]);
  if ("error" in access) return Response.json({ message: access.error }, { status: access.status });
  if (!verifyCsrf(request)) return Response.json({ message: "Token CSRF inválido." }, { status: 403 });
  try {
    const user = createTeamUser(access.session, await request.json());
    return Response.json({ message: "Usuário criado com sucesso.", data: user }, { status: 201 });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Não foi possível criar o usuário." }, { status: 400 });
  }
}
