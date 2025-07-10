import { db } from "@/db";
import { admins, auditLogs, listings } from "@/db/schema";
import { ADMIN_DATA, LISTIING_DATA } from "./mockData";

async function seed() {
  console.log("Seed start");
  await db.insert(admins).values(ADMIN_DATA).onConflictDoNothing();
  await db.insert(listings).values(LISTIING_DATA).onConflictDoNothing();
  await db.insert(auditLogs).values([]).onConflictDoNothing();
  console.log("Seed complete.");
}

seed().catch((e) => {
  console.error("Seed failed", e);
});
