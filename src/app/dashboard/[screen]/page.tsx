import { notFound } from "next/navigation";
import { screenData } from "@/lib/dashboard-data";
import { MODULES, type Screen } from "@/lib/erp-modules";
import { requirePageUser } from "@/lib/page-auth";
import ModuleAction from "./module-action";
import DataTable from "./data-table";
import styles from "./page.module.css";
export function generateStaticParams() { return Object.keys(MODULES).map((screen) => ({ screen })); }
export default async function ModulePage(props: PageProps<"/dashboard/[screen]">) { const { screen: rawScreen } = await props.params; if (!(rawScreen in MODULES)) notFound(); const screen = rawScreen as Screen, user = await requirePageUser(), [title, description, icon] = MODULES[screen], data = screenData(screen, user.storeId), products = screen === "estoque" ? data.rows.map((row) => ({ id: String(row.id), name: String(row.name) })) : []; return <section className={styles.page}><header><div><small>MÓDULO VENDIO</small><h1><span>{icon}</span>{title}</h1><p>{description}</p></div><ModuleAction screen={screen} products={products} role={user.role}/></header><div className={styles.summary}><article><small>REGISTROS</small><strong>{data.rows.length}</strong><span>Disponíveis nesta visão</span></article><article><small>ATUALIZAÇÃO</small><strong>Agora</strong><span>Dados lidos do banco</span></article><article><small>ESCOPO</small><strong>{user.storeName}</strong><span>Dados isolados por loja</span></article></div><article id="module-data" className={styles.data}><DataTable screen={screen} columns={data.columns} rows={data.rows} empty={data.empty}/></article></section>; }
