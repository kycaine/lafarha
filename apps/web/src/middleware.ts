import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { getSessionOptions, SessionData } from "@/lib/session";
import { UserRole } from "@/lib/user-store";

const ROUTE_RULES: { pattern: RegExp; allowedRoles: UserRole[] }[] = [
  {
    // /admin/users — master saja
    pattern: /^\/admin\/users(\/.*)?$/,
    allowedRoles: ["master"],
  },

  {
    // /admin/* — admin dan master saja
    pattern: /^\/admin(\/.*)?$/,
    allowedRoles: ["admin", "master"],
  },
  {
    // /counter/* — counter dan master
    pattern: /^\/counter(\/.*)?$/,
    allowedRoles: ["counter", "master"],
  },
  // /products/*, /quote/* — public, tidak perlu login
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const rule = ROUTE_RULES.find((r) => r.pattern.test(pathname));
  if (!rule) return NextResponse.next(); // route tidak diproteksi

  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, getSessionOptions());

  const role = session.role;
  const token = session.uid; // we just check if it exists
  console.log("[Middleware] Path:", pathname, "Session isLoggedIn:", session.isLoggedIn, "Role:", role);

  // Belum login sama sekali
  if (!session.isLoggedIn || !role) {
    console.log("[Middleware] Redirecting to login. No valid session.");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login tapi role tidak cukup → halaman unauthorized, bukan login
  if (!rule.allowedRoles.includes(role)) {
    console.log("[Middleware] Redirecting to unauthorized. Role not allowed:", role);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/counter/:path*"],
};
