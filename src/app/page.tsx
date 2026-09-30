import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateDefaultEvent } from "@/lib/seed";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const event = await getOrCreateDefaultEvent();
  const list = await db
    .select()
    .from(invitations)
    .where(eq(invitations.eventId, event.id))
    .orderBy(desc(invitations.createdAt));

  const total = list.length;
  const accepted = list.filter((i) => i.status === "accepted").length;
  const declined = list.filter((i) => i.status === "declined").length;
  const pending = list.filter((i) => i.status === "pending").length;

  const stats = {
    total,
    accepted,
    declined,
    pending,
    responseRate: total > 0 ? Math.round(((accepted + declined) / total) * 100) : 0,
  };

  return (
    <DashboardClient
      initialEvent={event}
      initialInvitations={list}
      initialStats={stats}
    />
  );
}
