import { NextResponse } from "next/server";
import { revokeSession } from "@/lib/auth";
import { getCookie, verifyCsrf } from "@/lib/request-security";
export const runtime = "nodejs";
export async function POST(request: Request) { if (!verifyCsrf(request)) return NextResponse.json({ message: "Token CSRF inválido." }, { status: 403 }); revokeSession(getCookie(request, "vendio_session")); const response = NextResponse.json({ message: "Sessão encerrada.", next: "/" }); response.cookies.set("vendio_session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 }); response.cookies.set("vendio_csrf", "", { secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 }); return response; }
