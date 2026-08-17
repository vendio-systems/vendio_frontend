import "server-only";

import { createHash, createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { db, nowIso, transaction } from "./database";

export const ROLES = ["VISITOR", "CLIENT", "ADMIN", "DEVELOPER", "OWNER"] as const;
export type Role = (typeof ROLES)[number];
export type AuthUser = { id: string; storeId: string | null; storeName: string | null; name: string; email: string; role: Role; status: string };
export type Session = { sub: string; storeId: string | null; email: string; role: Role; jti: string; iat: number; exp: number };

type UserRow = { id: string; store_id: string | null; store_name?: string | null; name: string; email: string; password_hash: string; role: Role; status: string };
function jwtSecret() { const configured = process.env.JWT_SECRET; if (configured && configured.length >= 32) return configured; if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET deve conter ao menos 32 caracteres em produção."); return "vendio-development-secret-change-in-production-2026"; }
const dummyPasswordHash = "00000000000000000000000000000000:aa8367e964282b7d7a89d858660530365a69851dc047d3ea8609aab32bdd5f147582d78716a83d829fc24695d8faac82ac39bd3b54a39a249f71f2eb94a9a91";

function base64url(value: string | Buffer) { return Buffer.from(value).toString("base64url"); }
function signature(input: string) { return createHmac("sha256", jwtSecret()).update(input).digest("base64url"); }
function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
function normalizeEmail(value: unknown) { return typeof value === "string" ? value.trim().toLowerCase().slice(0, 254) : ""; }
export function sanitizeText(value: unknown, max: number) { return typeof value === "string" ? value.trim().replace(/[<>\u0000-\u001f]/g, "").slice(0, max) : ""; }
export function validPassword(password: unknown) { if (typeof password !== "string" || password.length < 10 || password.length > 128) return "A senha deve ter entre 10 e 128 caracteres."; if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) return "A senha deve incluir letra maiúscula, minúscula e número."; return null; }
function hashPassword(password: string, salt = randomBytes(16).toString("hex")) { return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }
function passwordMatches(password: string, stored: string) { try { const [salt, digest] = stored.split(":"); const actual = scryptSync(password, salt, 64); const expected = Buffer.from(digest, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); } catch { return false; } }
function toUser(row: UserRow): AuthUser { return { id: row.id, storeId: row.store_id, storeName: row.store_name ?? null, name: row.name, email: row.email, role: row.role, status: row.status }; }

function seedStore(storeId: string, userId: string) {
  const createdAt = nowIso();
  const products = [
    ["CAM-ESS-001", "Camiseta Essential", 7990, 2940, 42, 12, "CD SP · A-01-03"],
    ["TEN-URB-002", "Tênis Urban", 18990, 8200, 8, 10, "CD SP · B-04-02"],
    ["BON-VEN-001", "Boné Vendio", 5990, 1800, 19, 8, "CD SP · A-02-01"],
  ] as const;
  const productStatement = db.prepare("INSERT INTO products (id, store_id, sku, name, price_cents, cost_cents, on_hand, minimum, location, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (const product of products) productStatement.run(randomUUID(), storeId, ...product, createdAt);
  const customers = [["Ana Souza", "ana@exemplo.com", 7, 189940], ["Carlos Lima", "carlos@exemplo.com", 3, 72970], ["Beatriz Rocha", "beatriz@exemplo.com", 1, 7990]] as const;
  const customerStatement = db.prepare("INSERT INTO customers (id, store_id, name, email, orders_count, total_spent_cents, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
  const customerIds = customers.map((customer) => { const id = randomUUID(); customerStatement.run(id, storeId, ...customer, createdAt); return id; });
  const orderStatement = db.prepare("INSERT INTO orders (id, store_id, customer_id, customer_name, total_cents, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
  orderStatement.run("PED-1024-" + storeId.slice(0, 5), storeId, customerIds[0], "Ana Souza", 24990, "PAID", createdAt);
  orderStatement.run("PED-1023-" + storeId.slice(0, 5), storeId, customerIds[1], "Carlos Lima", 18900, "PICKING", new Date(Date.now() - 18 * 60_000).toISOString());
  orderStatement.run("PED-1022-" + storeId.slice(0, 5), storeId, customerIds[2], "Beatriz Rocha", 7990, "SHIPPED", new Date(Date.now() - 32 * 60_000).toISOString());
  const supplierStatement = db.prepare("INSERT INTO suppliers (id, store_id, name, contact, lead_time_days) VALUES (?, ?, ?, ?, ?)");
  supplierStatement.run(randomUUID(), storeId, "Textil Brasil", "compras@textilbrasil.com", 7);
  supplierStatement.run(randomUUID(), storeId, "Urban Distribuidora", "vendas@urban.com", 12);
  const financialStatement = db.prepare("INSERT INTO financial_entries (id, store_id, description, type, amount_cents, due_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
  financialStatement.run(randomUUID(), storeId, "Recebimentos da loja", "RECEIVABLE", 284000, createdAt, "PAID");
  financialStatement.run(randomUUID(), storeId, "Reposição de estoque", "PAYABLE", 82000, new Date(Date.now() + 4 * 86400000).toISOString(), "OPEN");
  const notificationStatement = db.prepare("INSERT INTO notifications (id, store_id, title, message, kind, created_at) VALUES (?, ?, ?, ?, ?, ?)");
  notificationStatement.run(randomUUID(), storeId, "Estoque baixo", "Tênis Urban atingiu o estoque mínimo.", "STOCK", createdAt);
  notificationStatement.run(randomUUID(), storeId, "Novo pedido", "O pedido mais recente foi confirmado.", "ORDER", createdAt);
  notificationStatement.run(randomUUID(), storeId, "Conta criada", "Sua loja está pronta para ser configurada.", "SYSTEM", createdAt);
  const couponStatement = db.prepare("INSERT INTO coupons (id, store_id, code, discount_percent, uses_count) VALUES (?, ?, ?, ?, ?)");
  couponStatement.run(randomUUID(), storeId, "BEMVINDO10", 10, 14);
  const integrationStatement = db.prepare("INSERT INTO integrations (id, store_id, name, category, status) VALUES (?, ?, ?, ?, ?)");
  integrationStatement.run(randomUUID(), storeId, "Mercado Pago", "PAYMENT", "CONNECTED");
  integrationStatement.run(randomUUID(), storeId, "Correios", "SHIPPING", "CONNECTED");
  db.prepare("INSERT INTO audit_events (id, store_id, user_id, action, entity, entity_id, created_at) VALUES (?, ?, ?, 'CREATE', 'STORE', ?, ?)").run(randomUUID(), storeId, userId, storeId, createdAt);
}

export function register(input: Record<string, unknown>) {
  const name = sanitizeText(input.name, 80), storeName = sanitizeText(input.storeName, 60), email = normalizeEmail(input.email), password = input.password;
  if (name.length < 3) throw new Error("Informe seu nome completo (mínimo de 3 caracteres).");
  if (storeName.length < 3) throw new Error("O nome da loja deve ter ao menos 3 caracteres.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Informe um e-mail válido.");
  const passwordError = validPassword(password); if (passwordError) throw new Error(passwordError);
  if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) throw new Error("Já existe uma conta com este e-mail.");
  return transaction(() => {
    const storeId = randomUUID(), userId = randomUUID(), createdAt = nowIso();
    const baseSlug = storeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "loja";
    db.prepare("INSERT INTO stores (id, name, slug, created_at) VALUES (?, ?, ?, ?)").run(storeId, storeName, `${baseSlug}-${storeId.slice(0, 6)}`, createdAt);
    db.prepare("INSERT INTO users (id, store_id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, 'CLIENT', ?)").run(userId, storeId, name, email, hashPassword(password as string), createdAt);
    seedStore(storeId, userId);
    return { id: userId, storeId, storeName, name, email, role: "CLIENT" as Role, status: "ACTIVE" };
  });
}

export function login(input: Record<string, unknown>) {
  const email = normalizeEmail(input.email), password = typeof input.password === "string" ? input.password : "";
  const row = db.prepare("SELECT u.*, s.name AS store_name FROM users u LEFT JOIN stores s ON s.id = u.store_id WHERE u.email = ? LIMIT 1").get(email) as unknown as UserRow | undefined;
  const matches = passwordMatches(password, row?.password_hash ?? dummyPasswordHash);
  if (!row || !matches || row.status !== "ACTIVE") throw new Error("E-mail ou senha inválidos.");
  return toUser(row);
}

export function createSession(user: AuthUser) {
  const issuedAt = Math.floor(Date.now() / 1000), expiresAt = issuedAt + 8 * 60 * 60, sessionId = randomUUID();
  const payload: Session = { sub: user.id, storeId: user.storeId, email: user.email, role: user.role, jti: sessionId, iat: issuedAt, exp: expiresAt };
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" })), body = base64url(JSON.stringify(payload));
  const token = `${header}.${body}.${signature(`${header}.${body}`)}`;
  db.prepare("INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)").run(sessionId, user.id, tokenHash(token), new Date(expiresAt * 1000).toISOString(), nowIso());
  return token;
}

function decodeAndVerify(token?: string) {
  if (!token) return null;
  const [header, body, providedSignature] = token.split(".");
  if (!header || !body || !providedSignature) return null;
  const expectedSignature = signature(`${header}.${body}`), provided = Buffer.from(providedSignature), expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  try { const headerData = JSON.parse(Buffer.from(header, "base64url").toString()) as { alg?: string }; const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Session; if (headerData.alg !== "HS256" || payload.exp <= Math.floor(Date.now() / 1000)) return null; return payload; } catch { return null; }
}

export function verifyToken(token?: string) {
  const payload = decodeAndVerify(token); if (!payload) return null;
  const session = db.prepare("SELECT s.id FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ? AND u.status = 'ACTIVE'").get(payload.jti, tokenHash(token as string), nowIso());
  return session ? payload : null;
}

export function currentUser(token?: string) {
  const session = verifyToken(token); if (!session) return null;
  const row = db.prepare("SELECT u.*, s.name AS store_name FROM users u LEFT JOIN stores s ON s.id = u.store_id WHERE u.id = ?").get(session.sub) as unknown as UserRow | undefined;
  return row ? toUser(row) : null;
}

export function revokeSession(token?: string) { const payload = decodeAndVerify(token); if (payload && token) db.prepare("UPDATE sessions SET revoked_at = ? WHERE id = ? AND token_hash = ?").run(nowIso(), payload.jti, tokenHash(token)); }
export function can(role: Role, action: "manage-users" | "manage-stores" | "delete-any") { const levels: Record<Role, number> = { VISITOR: 0, CLIENT: 1, ADMIN: 2, DEVELOPER: 3, OWNER: 4 }; return levels[role] >= (action === "delete-any" ? 3 : 2); }

export function createTeamUser(actor: Session, input: Record<string, unknown>) {
  if (!actor.storeId) throw new Error("Loja não encontrada.");
  const assignable: Partial<Record<Role, Role[]>> = {
    ADMIN: ["VISITOR", "CLIENT"],
    DEVELOPER: ["VISITOR", "CLIENT", "ADMIN", "DEVELOPER"],
    OWNER: [...ROLES],
  };
  const role = typeof input.role === "string" && ROLES.includes(input.role as Role) ? input.role as Role : null;
  if (!role || !assignable[actor.role]?.includes(role)) throw new Error("Você não pode atribuir este cargo.");
  const name = sanitizeText(input.name, 80), email = normalizeEmail(input.email), password = input.password;
  if (name.length < 3) throw new Error("Informe o nome completo.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Informe um e-mail válido.");
  const passwordError = validPassword(password); if (passwordError) throw new Error(passwordError);
  if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) throw new Error("Já existe uma conta com este e-mail.");
  return transaction(() => {
    const id = randomUUID(), createdAt = nowIso();
    db.prepare("INSERT INTO users (id, store_id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(id, actor.storeId, name, email, hashPassword(password as string), role, createdAt);
    db.prepare("INSERT INTO audit_events (id, store_id, user_id, action, entity, entity_id, metadata, created_at) VALUES (?, ?, ?, 'CREATE', 'USER', ?, ?, ?)").run(randomUUID(), actor.storeId, actor.sub, id, JSON.stringify({ role }), createdAt);
    return { id, name, email, role };
  });
}
