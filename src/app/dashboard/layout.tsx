import { db } from "@/lib/database";
import { requirePageUser } from "@/lib/page-auth";
import DashboardShell from "./dashboard-shell";
import styles from "./layout.module.css";
export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) { const user = await requirePageUser(); const count = db.prepare("SELECT COUNT(*) AS count FROM notifications WHERE store_id = ? AND read_at IS NULL").get(user.storeId) as unknown as { count: number }; return <div className={styles.root}><DashboardShell user={user} unread={count.count}>{children}</DashboardShell></div>; }
