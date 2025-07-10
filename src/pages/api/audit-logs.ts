import { ResData } from "@/types/response";
import { is_User_auth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { admins, AuditActions, auditLogs } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    ResData<
      {
        adminName: string;
        id: string;
        action: AuditActions;
        timestamp: string;
        listingId: string;
        adminId: string;
        details?: string;
      }[]
    >
  >
) {
  if (req.method !== "GET") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const token = req.cookies.auth_token ?? "";

  if (!token) {
    return res.status(401).json({ error: "Unauthorized request." });
  }
  const is_auth = await is_User_auth(token);

  if (!is_auth) {
    return res.status(401).json({ error: "User is not authenticated." });
  }

  try {
    const auditLogEntries = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.adminId, is_auth.admin.id));
    const allAdmins = await db.select().from(admins);

    const result = auditLogEntries
      .toSorted((a, b) => b.timestamp.localeCompare(a.timestamp))
      .map((log) => {
        const admin = allAdmins.find((a) => a.id === log.adminId);
        return {
          ...log,
          adminName: admin?.name || "Unknown",
        };
      });

    return res
      .status(200)
      .json({ success: "Fetched successfully", data: result });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return res.status(500).json({ error: "Failed to fetch audit logs." });
  }
}
