import { ResData } from "@/types/response";
import { verifyToken } from "@/lib/verify-token";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const token = req.cookies.auth_token;
  const user = await verifyToken(token);
  if (!user || user === "expired" || user == "failToVerify") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ data: { email: user.email, name: user.name } });
}
