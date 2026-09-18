"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/AuthContext";
import { getAllUsers, setUserRole, UserProfile, UserRole } from "@/lib/user-store";
import { useRouter } from "next/navigation";

const ROLE_LABELS: Record<UserRole, string> = {
  master: "Master",
  admin: "Admin",
  counter: "Counter",
  user: "User",
};

const ROLE_COLORS: Record<UserRole, string> = {
  master: "bg-purple-100 text-purple-700 border-purple-200",
  admin: "bg-emerald-100 text-emerald-700 border-emerald-200",
  counter: "bg-blue-100 text-blue-700 border-blue-200",
  user: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function UsersPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && userProfile?.role !== "master") {
      router.replace("/admin/dashboard");
    }
  }, [userProfile, loading, router]);

  useEffect(() => {
    if (userProfile?.role === "master") {
      getAllUsers().then((data) => {
        setUsers(data);
        setFetching(false);
      });
    }
  }, [userProfile]);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    setSaving(uid);
    try {
      await setUserRole(uid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setSaving(null);
    }
  };

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen User</h1>
        <p className="text-slate-500 text-sm mt-1">
          Kelola akses dan role seluruh pengguna platform. Hanya <span className="font-semibold text-purple-600">Master</span> yang dapat mengubah role.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ubah Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {u.photo_url ? (
                      <img src={u.photo_url} alt={u.display_name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                        {u.display_name?.charAt(0) ?? "?"}
                      </div>
                    )}
                    <span className="font-medium text-slate-800 text-sm">{u.display_name || "—"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${ROLE_COLORS[u.role]}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {/* Master email tidak bisa diubah rolenya */}
                  {u.email === process.env.NEXT_PUBLIC_MASTER_EMAIL ? (
                    <span className="text-xs text-slate-400 italic">Tidak bisa diubah</span>
                  ) : (
                    <select
                      value={u.role}
                      disabled={saving === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 disabled:opacity-50 transition-all"
                    >
                      <option value="user">User</option>
                      <option value="counter">Counter</option>
                      <option value="admin">Admin</option>
                      <option value="master">Master</option>
                    </select>
                  )}
                  {saving === u.id && (
                    <span className="ml-2 inline-block w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin align-middle" />
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                  Belum ada user terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
