import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) { return request.nextUrl.pathname.startsWith("/dashboard") && !request.cookies.get("vendio_session") ? NextResponse.redirect(new URL("/?auth=required", request.url)) : NextResponse.next(); }
export const config = { matcher: ["/dashboard/:path*"] };
