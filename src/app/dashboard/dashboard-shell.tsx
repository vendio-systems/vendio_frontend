/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { AuthUser } from "@/lib/auth";
import { MODULES } from "@/lib/erp-modules";
import styles from "./layout.module.css";

const operations = ["produtos", "estoque", "pedidos", "clientes", "financeiro", "metricas", "compras"] as const;
const management = ["relatorios", "notificacoes", "fornecedores", "cupons", "entregas", "loja", "equipe", "integracoes", "seguranca"] as const;
function csrf() { return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("vendio_csrf="))?.slice("vendio_csrf=".length) ?? ""; }

export default function DashboardShell({ user, unread, children }: { user: AuthUser; unread: number; children: React.ReactNode }) {
  const pathname = usePathname(), router = useRouter(), searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false), [searchOpen, setSearchOpen] = useState(false), [query, setQuery] = useState("");
  const initials = user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const searchResults = Object.entries(MODULES).filter(([, [label, description]]) => `${label} ${description}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))).slice(0, 7);
  useEffect(() => { function shortcut(event: KeyboardEvent) { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); setTimeout(() => searchRef.current?.focus()); } if (event.key === "Escape") setSearchOpen(false); } window.addEventListener("keydown", shortcut); return () => window.removeEventListener("keydown", shortcut); }, []);
  async function logout() { const response = await fetch("/api/auth/logout", { method: "POST", headers: { "x-csrf-token": csrf() } }); if (response.ok) { router.replace("/"); router.refresh(); } }
  const nav = (ids: readonly (keyof typeof MODULES)[]) => ids.map((id) => { const [label,, icon] = MODULES[id]; const href = `/dashboard/${id}`; return <Link onClick={() => setOpen(false)} className={pathname === href ? styles.selected : ""} href={href} key={id}><span>{icon}</span>{label}{id === "notificacoes" && unread > 0 ? <b>{unread}</b> : null}</Link>; });

  return <div className={styles.shell}><aside className={open ? styles.open : ""}><div className={styles.brand}><Link href="/dashboard"><img src="/vendio.svg" alt="Vendio"/></Link><button onClick={() => setOpen(false)} aria-label="Fechar menu">×</button></div><small>OPERAÇÃO</small><Link className={pathname === "/dashboard" ? styles.selected : ""} href="/dashboard"><span>◈</span>Visão geral</Link>{nav(operations)}<small>GESTÃO</small>{nav(management)}<div className={styles.account}><i>{initials}</i><div><strong>{user.name}</strong><span>{user.storeName}</span></div><button onClick={logout} title="Sair">↪</button></div></aside>{open ? <button className={styles.backdrop} aria-label="Fechar menu" onClick={() => setOpen(false)}/> : null}<main><header className={styles.topbar}><button className={styles.menu} onClick={() => setOpen(true)}>☰</button><div className={styles.search} style={{ position: "relative", padding: 0 }}><span style={{ position: "absolute", left: 10, top: 8 }}>⌕</span><input ref={searchRef} aria-label="Buscar no sistema" value={query} onFocus={() => setSearchOpen(true)} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} placeholder="Buscar no sistema..." style={{ width: "100%", border: 0, outline: 0, background: "transparent", padding: "8px 55px 8px 30px", font: "11px inherit" }}/><kbd style={{ position: "absolute", right: 8, top: 7 }}>Ctrl K</kbd>{searchOpen ? <div style={{ position: "absolute", zIndex: 60, top: 40, left: 0, right: 0, background: "#fff", border: "1px solid #e7e2ec", borderRadius: 9, boxShadow: "0 18px 45px #2b174b22", padding: 6 }}>{searchResults.length ? searchResults.map(([id, [label, description, icon]]) => <Link onClick={() => { setSearchOpen(false); setQuery(""); }} href={`/dashboard/${id}`} key={id} style={{ display: "flex", gap: 9, padding: 9, borderRadius: 6, color: "#292234" }}><b style={{ color: "#7040ed" }}>{icon}</b><span><strong style={{ display: "block", fontSize: 11 }}>{label}</strong><small style={{ color: "#8b8494", fontSize: 9 }}>{description}</small></span></Link>) : <span style={{ display: "block", padding: 12 }}>Nenhum módulo encontrado.</span>}</div> : null}</div><Link href="/dashboard/notificacoes" className={styles.notification}>◇{unread > 0 ? <b>{unread}</b> : null}</Link><span className={styles.avatar}>{initials}</span></header>{children}</main></div>;
}
