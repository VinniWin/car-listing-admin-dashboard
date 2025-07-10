import { ResData } from "@/types/response";
import { is_User_auth } from "@/lib/auth";
import { listingSchema } from "@/schema/table.schema";
import { NextApiRequest, NextApiResponse } from "next";
import { auditLogs, Listing, listings } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData<Listing>>
) {
  if (req.method !== "PUT") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const token = req.cookies.auth_token ?? "";

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id format." });
  }
  if (!token) {
    return res.status(401).json({ error: "Unauthorized request." });
  }

  const is_auth = await is_User_auth(token);

  if (!is_auth) {
    return res.status(401).json({ error: "User is not authenticated." });
  }

  try {
    const body = req.body;
    const result = listingSchema.safeParse(body);
    const adminId = is_auth.admin.id;

    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const updateData = result.data;

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
        title: updateData.title,
        description: updateData.description,
        pricePerDay: updateData.pricePerDay,
        status: updateData.status,
        updatedAt: new Date().toISOString(),
        submittedBy: adminId,
      })
      .where(eq(listings.id, id));

    const [updatedListing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id));

    await db.insert(auditLogs).values({
      id: ulid(),
      action: "edit",
      listingId: id,
      adminId: adminId,
      timestamp: new Date().toISOString(),
      details: JSON.stringify({
        title: updateData.title,
        description: updateData.description,
        status: updateData.status,
        pricePerDay: updateData.pricePerDay,
        updatedBy: is_auth.admin.email,
      }),
    });

    return res.status(200).json({ data: updatedListing });
  } catch (error) {
    console.error("PUT listing error:", error);
    return res.status(500).json({ error: "Failed to update listing." });
  }
}
