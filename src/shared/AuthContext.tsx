"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange, handleRedirectResult } from "@/lib/auth";
import { upsertUserProfile, UserProfile } from "@/lib/user-store";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Process any pending redirect results (crucial for mobile signInWithRedirect)
  useEffect(() => {
    handleRedirectResult().catch(err => {
      console.error("Redirect login failed:", err);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // STEP 1: Upsert user ke D1 via proxy.
          // Ini tidak butuh session cookie karena body-nya sudah mengandung uid.
          const profile = await upsertUserProfile(
            firebaseUser.uid,          // Firebase UID = D1 users.id
            firebaseUser.email ?? "",
            firebaseUser.displayName ?? "",
            firebaseUser.photoURL ?? ""
          );
          setUserProfile(profile);

          // STEP 2: Setelah dapat role dari D1, baru set session cookie.
          // Ini penting agar middleware punya role yang benar.
          const token = await firebaseUser.getIdToken();
          const sessionRes = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, role: profile.role, uid: profile.id }),
          });

          if (!sessionRes.ok) {
            console.error("[AuthContext] Gagal menyimpan session cookie:", await sessionRes.text());
          }
        } catch (err) {
          console.error("[AuthContext] Gagal sync profil user ke D1:", err);

          // Fallback: set session dengan role 'user' agar user tidak stuck di loading.
          // Data D1 akan di-retry saat refresh berikutnya.
          try {
            const token = await firebaseUser.getIdToken();
            await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, role: "user", uid: firebaseUser.uid }),
            });
          } catch (sessionErr) {
            console.error("[AuthContext] Bahkan fallback session gagal:", sessionErr);
          }
        }
      } else {
        setUserProfile(null);
        // Hapus session cookie saat logout
        await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
