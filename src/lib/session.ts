import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { UserRole } from "./user-store";

export interface SessionData {
  uid?: string;
  role?: UserRole;
  isLoggedIn: boolean;
}

export function getSessionOptions(): SessionOptions {
  return {
    password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long_for_iron_session",
    cookieName: "kanza_auth_session",
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
