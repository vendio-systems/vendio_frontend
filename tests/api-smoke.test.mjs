import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.VENDIO_TEST_URL ?? "http://localhost:3000";
const json = (body) => ({ "Content-Type": "application/json", body: JSON.stringify(body) });

test("fluxo seguro de autenticação e produto", async () => {
  const invalidRegistration = await fetch(`${baseUrl}/api/auth/register`, { method: "POST", ...json({ name: "A", storeName: "X", email: "invalido", password: "123" }) });
  assert.equal(invalidRegistration.status, 400);
  assert.match((await invalidRegistration.json()).message, /nome|loja|e-mail|senha/i);

  const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const registration = await fetch(`${baseUrl}/api/auth/register`, { method: "POST", ...json({ name: "Teste Automatizado", storeName: `Loja Teste ${unique}`, email: `teste-${unique}@vendio.local`, password: "SenhaSegura123" }) });
  assert.equal(registration.status, 201);
  assert.equal((await registration.json()).next, "/dashboard");
  const setCookies = registration.headers.getSetCookie();
  const sessionCookie = setCookies.find((cookie) => cookie.startsWith("vendio_session="))?.split(";")[0];
  const csrfCookie = setCookies.find((cookie) => cookie.startsWith("vendio_csrf="))?.split(";")[0];
  assert.ok(sessionCookie && csrfCookie, "A autenticação deve emitir cookies de sessão e CSRF.");
  const cookie = `${sessionCookie}; ${csrfCookie}`;
  const csrfToken = csrfCookie.slice("vendio_csrf=".length);

  const session = await fetch(`${baseUrl}/api/auth/session`, { headers: { cookie } });
  assert.equal(session.status, 200);
  assert.equal((await session.json()).authenticated, true);

  const missingCsrf = await fetch(`${baseUrl}/api/erp/products`, { method: "POST", headers: { cookie, "Content-Type": "application/json" }, body: "{}" });
  assert.equal(missingCsrf.status, 403);
  assert.match((await missingCsrf.json()).message, /CSRF/i);

  const invalidProduct = await fetch(`${baseUrl}/api/erp/products`, { method: "POST", headers: { cookie, "Content-Type": "application/json", "x-csrf-token": csrfToken }, body: JSON.stringify({ sku: "?", name: "x" }) });
  assert.equal(invalidProduct.status, 400);
  assert.match((await invalidProduct.json()).message, /SKU|produto/i);

  const product = await fetch(`${baseUrl}/api/erp/products`, { method: "POST", headers: { cookie, "Content-Type": "application/json", "x-csrf-token": csrfToken }, body: JSON.stringify({ sku: `TST-${Date.now()}`, name: "Produto automatizado", price: "49.90", cost: "20.00", minimum: "2", location: "QA-01" }) });
  assert.equal(product.status, 201);
  assert.equal((await product.json()).data.name, "Produto automatizado");

  const logoutWithoutCsrf = await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", headers: { cookie } });
  assert.equal(logoutWithoutCsrf.status, 403);
  const logout = await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", headers: { cookie, "x-csrf-token": csrfToken } });
  assert.equal(logout.status, 200);
  const revoked = await fetch(`${baseUrl}/api/auth/session`, { headers: { cookie } });
  assert.equal(revoked.status, 401);
});
