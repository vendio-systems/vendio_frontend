"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Screen } from "@/lib/erp-modules";
import styles from "./page.module.css";

const nextStatuses: Record<string, [string, string][]> = {
  PENDING: [["PAID", "Marcar pago"], ["CANCELLED", "Cancelar"]],
  PAID: [["PICKING", "Iniciar separação"], ["CANCELLED", "Cancelar"]],
  PICKING: [["SHIPPED", "Marcar enviado"], ["CANCELLED", "Cancelar"]],
  SHIPPED: [["COMPLETED", "Concluir"]],
};
function csrf() { return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("vendio_csrf="))?.slice("vendio_csrf=".length) ?? ""; }

function OrderAction({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const options = nextStatuses[status] ?? [];
  const [selected, setSelected] = useState(options[0]?.[0] ?? "");
  const [busy, setBusy] = useState(false);
  if (!options.length) return <span>Fluxo encerrado</span>;
  async function update() {
    setBusy(true);
    const response = await fetch(`/api/erp/orders/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-csrf-token": csrf() }, body: JSON.stringify({ status: selected }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) { window.alert(result.message ?? "Não foi possível atualizar o pedido."); return; }
    router.refresh();
  }
  return <div style={{ display: "flex", gap: 5 }}><select aria-label={`Próximo status de ${id}`} value={selected} onChange={(event) => setSelected(event.target.value)}>{options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><button className={styles.primaryAction} style={{ padding: "6px 9px", fontSize: 10 }} disabled={busy} onClick={update}>{busy ? "..." : "Aplicar"}</button></div>;
}

function ProductAction({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function archive() {
    if (!window.confirm(`Arquivar ${name}? O produto deixará de aparecer na loja.`)) return;
    setBusy(true);
    const response = await fetch(`/api/erp/products/${encodeURIComponent(id)}`, { method: "DELETE", headers: { "x-csrf-token": csrf() } });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { window.alert(result.message ?? "Não foi possível arquivar o produto."); return; }
    router.refresh();
  }
  return <button onClick={archive} disabled={busy} style={{ border: 0, borderRadius: 6, background: "#fff0f2", color: "#bc3850", padding: "7px 9px", font: "600 10px inherit", cursor: "pointer" }}>{busy ? "Arquivando..." : "Arquivar"}</button>;
}

export default function DataTable({ screen, columns, rows, empty }: { screen: Screen; columns: { key: string; label: string }[]; rows: Record<string, string | number>[]; empty: string }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => { const normalized = query.trim().toLocaleLowerCase("pt-BR"); return normalized ? rows.filter((row) => Object.values(row).some((value) => String(value).toLocaleLowerCase("pt-BR").includes(normalized))) : rows; }, [query, rows]);
  const hasActions = screen === "pedidos" || screen === "produtos";
  return <><div className={styles.dataHeader}><div><h2>Registros operacionais</h2><p>{filtered.length} de {rows.length} registro(s)</p></div><label>⌕ <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar registros..."/></label></div><div className={styles.tableWrap}><table><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}{hasActions ? <th>Ações</th> : null}</tr></thead><tbody>{filtered.length ? filtered.map((row, index) => <tr key={String(row.id ?? row.code ?? row.name ?? index)}>{columns.map((column) => <td key={column.key}>{column.key === "url" ? <Link href={String(row[column.key])} target="_blank">Abrir loja ↗</Link> : <span className={column.key === "state" ? styles.status : ""}>{row[column.key]}</span>}</td>)}{screen === "pedidos" ? <td><OrderAction id={String(row.id)} status={String(row.rawStatus)}/></td> : screen === "produtos" ? <td><ProductAction id={String(row.id)} name={String(row.name)}/></td> : null}</tr>) : <tr><td className={styles.empty} colSpan={columns.length + (hasActions ? 1 : 0)}>{query ? "Nenhum resultado para este filtro." : empty}</td></tr>}</tbody></table></div></>;
}
