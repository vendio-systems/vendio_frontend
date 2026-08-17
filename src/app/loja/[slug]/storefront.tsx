/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */
"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

type Product = { id: string; sku: string; name: string; priceCents: number; stock: number };
const money = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export default function Storefront({ store, products }: { store: { name: string; slug: string }; products: Product[] }) {
  const [catalog, setCatalog] = useState(products);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  const items = useMemo(() => catalog.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] })), [cart, catalog]);
  const total = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0), count = items.reduce((sum, item) => sum + item.quantity, 0);

  function add(product: Product) { setMessage(""); setCart((current) => ({ ...current, [product.id]: Math.min((current[product.id] ?? 0) + 1, product.stock) })); }
  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const purchasedItems = items.map((item) => ({ productId: item.id, quantity: item.quantity }));
    const customer = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/store/${store.slug}/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...customer, items: purchasedItems }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { setMessage(result.message ?? "Não foi possível concluir o pedido."); return; }
    setCatalog((current) => current.map((product) => ({ ...product, stock: product.stock - (purchasedItems.find((item) => item.productId === product.id)?.quantity ?? 0) })).filter((product) => product.stock > 0));
    setCart({}); setMessage(`Pedido ${result.order.id} criado com sucesso.`);
  }

  return <><header><a href="/"><img src="/vendio.svg" alt="Vendio"/></a><strong>{store.name}</strong><button onClick={() => setOpen(true)}>Sacola · {count}</button></header><section className={styles.hero}><small>LOJA OFICIAL</small><h1>{store.name}</h1><p>Produtos selecionados, compra simples e gestão integrada pela Vendio.</p></section><section className={styles.catalog}><div><h2>Produtos</h2><span>{catalog.length} item(ns) disponível(is)</span></div><div className={styles.grid}>{catalog.map((product) => <article key={product.id}><div className={styles.photo}>V</div><small>{product.sku}</small><h3>{product.name}</h3><p>{product.stock} em estoque</p><footer><strong>{money(product.priceCents)}</strong><button disabled={(cart[product.id] ?? 0) >= product.stock} onClick={() => add(product)}>Adicionar</button></footer></article>)}</div></section>{open ? <div className={styles.overlay}><aside className={styles.cart}><button className={styles.close} onClick={() => setOpen(false)}>×</button><h2>Sua sacola</h2>{items.length ? items.map((item) => <div className={styles.cartItem} key={item.id}><div><strong>{item.name}</strong><small>{item.quantity} × {money(item.priceCents)}</small></div><button onClick={() => setCart((current) => ({ ...current, [item.id]: 0 }))}>Remover</button></div>) : <p className={styles.empty}>Sua sacola está vazia.</p>}<div className={styles.total}><span>Total</span><strong>{money(total)}</strong></div>{items.length ? <form onSubmit={checkout}><label>Nome<input name="name" required minLength={3}/></label><label>E-mail<input name="email" type="email" required/></label><label>Telefone<input name="phone" required minLength={8}/></label>{message ? <output>{message}</output> : null}<button disabled={busy}>{busy ? "Processando..." : "Finalizar pedido"}</button></form> : message ? <output>{message}</output> : null}</aside></div> : null}</>;
}
