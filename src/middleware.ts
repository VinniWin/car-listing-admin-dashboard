import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/verify-token";

const publicRoutes = ["/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = (await cookies()).get("auth_token")?.value;

  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = !isPublicRoute;

  const user = token ? await verifyToken(token) : null;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (user == "expired" || user == "failToVerify") {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl));
    res.cookies.delete("auth_token");
    return res;
  }
  if (user && (path == "/" || isPublicRoute)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next({ request: req, headers: req.headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
