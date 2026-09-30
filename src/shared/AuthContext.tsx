"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange, handleRedirectResult } from "@/lib/auth";
import { upsertUserProfile, UserProfile } from "@/lib/user-store";

import { AlertTriangle } from "lucide-react";

import { useAlert } from "@/shared/AlertContext";

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
  const { showAlert } = useAlert();

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
        } catch (err: any) {
          console.error("[AuthContext] Gagal sync profil user ke D1:", err);

          // Sign out dari firebase agar session bersih
          const { signOut } = await import("@/lib/auth");
          await signOut();
          
          setUserProfile(null);
          setUser(null);
          
          // Tampilkan modal peringatan global
          showAlert({
            title: "Akses Ditolak",
            message: "Email Anda belum terdaftar di sistem kami. Silakan hubungi Master Admin untuk mendapatkan akses.",
            type: "error",
            confirmText: "Kembali ke Beranda",
            onConfirm: () => { window.location.href = "/" }
          });
          return;
        }
      } else {
        setUserProfile(null);
        // Hapus session cookie saat logout
        await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [showAlert]);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
