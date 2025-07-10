import { SignJWT } from "jose";
import { verifyToken } from "./verify-token";
import { Admin, admins } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

const SECRET_KEY = "nothing";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function signToken(payload: Omit<Admin, "password" | "id">) {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60 * 24;
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .sign(encodedKey);
}

export const is_User_auth = async (token: string) => {
  try {
    const verify = await verifyToken(token);

    if (verify == "expired" || verify == "failToVerify") {
      return false;
    }
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, verify.email));

    if (!admin) {
      return false;
    }
    return { success: true, admin };
  } catch (error) {
    console.error(error);
    return false;
  }
};
