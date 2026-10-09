// User data disimpan di Cloudflare D1 via API Worker
// Firebase UID digunakan sebagai primary key di tabel users

import { fetchApi } from "./api";

export type UserRole = "master" | "admin" | "counter" | "user" | "muthawif";

export interface UserProfile {
  id: string;          // Firebase UID
  email: string;
  display_name: string;
  photo_url: string;
  role: UserRole;
  created_at: number;
  updated_at: number;
}

const MASTER_EMAIL = process.env.NEXT_PUBLIC_MASTER_EMAIL ?? "talkto.rezki@gmail.com";

/**
 * Ambil profil user dari D1 berdasarkan Firebase UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const res = await fetchApi(`/users/${uid}`);
  if (!res.success) return null;
  return res.data as UserProfile;
}

/**
 * Upsert profil user ke D1. Firebase UID digunakan sebagai id.
 * Memastikan email master selalu punya role 'master'.
 */
export async function upsertUserProfile(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string
): Promise<UserProfile> {
  const isMaster = email === MASTER_EMAIL;

  console.log("[user-store] upsertUserProfile dipanggil:", { uid, email, isMaster });

  const res = await fetchApi(`/users/upsert`, {
    method: "POST",
    body: JSON.stringify({
      id: uid,
      email,
      display_name: displayName,
      photo_url: photoURL,
      is_master: isMaster,
    }),
  });

  console.log("[user-store] upsert response:", res);

  if (!res.success) {
    throw new Error(res.error ?? "Failed to upsert user");
  }
  return res.data as UserProfile;
}

export async function addUserManual(email: string, role: UserRole) {
  const res = await fetchApi("/users", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
  if (!res.success) throw new Error(res.error);
  return res.data;
}

/**
 * Set role user. Hanya bisa dipanggil oleh master (enforced di UI layer).
 */
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await fetchApi(`/users/${uid}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

/**
 * Hard delete user. Hanya bisa dipanggil oleh master.
 */
export async function deleteUserManual(uid: string): Promise<void> {
  const res = await fetchApi(`/users/${uid}`, {
    method: "DELETE",
  });
  if (!res.success) throw new Error(res.error);
}

/**
 * Ambil semua user (untuk halaman manajemen user oleh master).
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const res = await fetchApi("/users");
  return res.success ? (res.data as UserProfile[]) : [];
}
