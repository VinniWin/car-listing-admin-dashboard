import { db } from "@/db";
import { auditLogs, Listing, listings, ListingStatus } from "@/db/schema";
import { is_User_auth } from "@/lib/auth";
import { ResData } from "@/types/response";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { ulid } from "ulid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData<Listing>>
) {
  if (req.method !== "PUT") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id format." });
  }

  const token = req.cookies.auth_token ?? "";

  if (!token) {
    return res.status(401).json({ error: "Unauthorized request." });
  }

  const is_auth = await is_User_auth(token);

  if (!is_auth) {
    return res.status(401).json({ error: "User is not authenticated." });
  }
  const { status } = req.body;
  const validStatuses = ["APPROVED", "REJECTED"];

  if (
    !status ||
    typeof status !== "string" ||
    !validStatuses.includes(status)
  ) {
    return res.status(400).json({ error: "Invalid or missing status." });
  }
  try {
    const [existing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id));

    if (!existing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    await db
      .update(listings)
      .set({
        status: status as ListingStatus,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(listings.id, id));

    const [updated] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id));

    await db.insert(auditLogs).values({
      id: ulid(),
      action: status === "APPROVED" ? "approve" : "reject",
      listingId: id,
      adminId: is_auth.admin.id,
      timestamp: new Date().toISOString(),
      details: `${
        status === "APPROVED" ? "Approved" : "Rejected"
      } the listing by: ${is_auth.admin.name}`,
    });

    return res
      .status(200)
      .json({ success: "Successfully updated.", data: updated });
  } catch (error) {
    console.error("[LISTING UPDATE ERROR]", error);
    return res.status(500).json({ error: "Failed to update listing." });
  }
}
