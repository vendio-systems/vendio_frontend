import "server-only";

import { randomBytes, timingSafeEqual } from "node:crypto";
import { type Role, verifyToken } from "./auth";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
export function getCookie(request: Request, name: string) { return request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1); }
export function sessionFrom(request: Request) { return verifyToken(getCookie(request, "vendio_session")); }
export function requireRole(request: Request, roles: Role[]) { const session = sessionFrom(request); if (!session) return { error: "Sessão inválida ou expirada.", status: 401 } as const; if (!roles.includes(session.role)) return { error: "Você não possui permissão para esta ação.", status: 403 } as const; return { session } as const; }
export function verifyCsrf(request: Request) { const cookieValue = getCookie(request, "vendio_csrf"), headerValue = request.headers.get("x-csrf-token"); if (!cookieValue || !headerValue) return false; const cookieBuffer = Buffer.from(cookieValue), headerBuffer = Buffer.from(headerValue); return cookieBuffer.length === headerBuffer.length && timingSafeEqual(cookieBuffer, headerBuffer); }
export function issueCsrfToken() { return randomBytes(32).toString("base64url"); }
export function rateLimit(request: Request, scope: string, maximum = 5, windowMs = 15 * 60_000) { const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(); const key = `${scope}:${forwarded || "local"}`; const now = Date.now(); for (const [bucketKey, bucket] of buckets) if (now >= bucket.resetAt) buckets.delete(bucketKey); const bucket = buckets.get(key); if (!bucket) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return null; } bucket.count += 1; return bucket.count > maximum ? Math.ceil((bucket.resetAt - now) / 1000) : null; }
