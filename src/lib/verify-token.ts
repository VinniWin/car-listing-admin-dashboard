import { errors, jwtVerify } from "jose";

const SECRET_KEY = "nothing";
const encodedKey = new TextEncoder().encode(SECRET_KEY);
export async function verifyToken(session: string | undefined = "") {
  if (!session) {
    return "failToVerify";
  }
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as {
      email: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return "expired";
    }
    console.error("Failed to verify session", error);
    return "failToVerify";
  }
}
