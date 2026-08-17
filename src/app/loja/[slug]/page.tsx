import { notFound } from "next/navigation";
import { db } from "@/lib/database";
import Storefront from "./storefront";
import styles from "./page.module.css";
type Store = { id: string; name: string; slug: string };
type Product = { id: string; sku: string; name: string; price_cents: number; on_hand: number };
export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const store = db.prepare("SELECT id, name, slug FROM stores WHERE slug = ? AND status = 'ACTIVE'").get(slug) as unknown as Store | undefined; if (!store) notFound(); const products = db.prepare("SELECT id, sku, name, price_cents, on_hand FROM products WHERE store_id = ? AND status = 'ACTIVE' AND on_hand > 0 ORDER BY name").all(store.id) as unknown as Product[]; return <main className={styles.page}><Storefront store={{ name: store.name, slug: store.slug }} products={products.map((product) => ({ id: product.id, sku: product.sku, name: product.name, priceCents: product.price_cents, stock: product.on_hand }))}/></main>; }
