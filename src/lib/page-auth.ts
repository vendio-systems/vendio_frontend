import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "./auth";
export async function requirePageUser() { const token = (await cookies()).get("vendio_session")?.value; const user = currentUser(token); if (!user || !user.storeId) redirect("/?auth=required"); if (user.role === "VISITOR") redirect("/?auth=forbidden"); return user as typeof user & { storeId: string }; }
