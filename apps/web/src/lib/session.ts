import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { UserRole } from "./user-store";

export interface SessionData {
  uid?: string;
  role?: UserRole;
  isLoggedIn: boolean;
}

export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET belum di-set atau kurang dari 32 karakter. Lihat DEPLOYMENTS.md."
    );
  }
  return {
    password,
    cookieName: "farha_auth_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, getSessionOptions());
  
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  
  return session;
}
