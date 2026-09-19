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
          // Upsert ke D1 menggunakan Firebase UID sebagai primary key
          const profile = await upsertUserProfile(
            firebaseUser.uid,          // Firebase UID = D1 users.id
            firebaseUser.email ?? "",
            firebaseUser.displayName ?? "",
            firebaseUser.photoURL ?? ""
          );
          setUserProfile(profile);

          // Set session cookie untuk middleware
          const token = await firebaseUser.getIdToken();
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, role: profile.role, uid: profile.id }),
          });
        } catch (err) {
          console.error("Failed to sync user profile:", err);
        }
      } else {
        setUserProfile(null);
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
