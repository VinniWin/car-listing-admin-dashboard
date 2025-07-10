import { ResData } from "@/types/response";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  res.setHeader(
    "Set-Cookie",
    serialize("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1,
      path: "/",
    })
  );

  return res.status(200).json({ success: "Logged out successfully" });
}
