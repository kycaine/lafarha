"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/AuthContext";
import { getAllUsers, setUserRole, addUserManual, deleteUserManual, UserProfile, UserRole } from "@/lib/user-store";
import { useRouter } from "next/navigation";
import { UserPlus, X, Trash2 } from "lucide-react";

const ROLE_LABELS: Record<UserRole, string> = {
  master: "Master",
  admin: "Admin",
  counter: "Counter",
  user: "User",
  muthawif: "Muthawif",
};

const ROLE_COLORS: Record<UserRole, string> = {
  master: "bg-purple-100 text-purple-700 border-purple-200",
  admin: "bg-emerald-100 text-emerald-700 border-emerald-200",
  counter: "bg-blue-100 text-blue-700 border-blue-200",
  user: "bg-slate-100 text-slate-600 border-slate-200",
  muthawif: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function UsersPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Manual Add User State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("counter");
  const [addingUser, setAddingUser] = useState(false);

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

  const handleDeleteUser = async (uid: string, email: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus user ${email} secara permanen?`)) return;
    
    setSaving(uid);
    try {
      await deleteUserManual(uid);
      setUsers((prev) => prev.filter((u) => u.id !== uid));
    } catch (err: any) {
      alert("Gagal menghapus user: " + err.message);
    } finally {
      setSaving(null);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAddingUser(true);
    try {
      const newUser = await addUserManual(newEmail.trim(), newRole);
      setUsers(prev => [newUser, ...prev]);
      setShowAddModal(false);
      setNewEmail("");
      setNewRole("counter");
      alert("Berhasil mendaftarkan email!");
    } catch (err: any) {
      alert("Gagal: " + err.message);
    } finally {
      setAddingUser(false);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen User</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola akses pengguna. Hanya email terdaftar yang bisa login sebagai Admin/Counter.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Tambah User
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Daftarkan Email Akses</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email Akun Google</label>
                <input
                  type="email"
                  required
                  placeholder="nama@gmail.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Role Akses</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="user">User</option>
                  <option value="counter">Counter</option>
                  <option value="admin">Admin</option>
                  <option value="master">Master</option>
                  <option value="muthawif">Muthawif</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={addingUser}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  {addingUser ? "Mendaftarkan..." : "Daftarkan Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
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
                  <div className="flex items-center gap-2">
                    {/* Master email tidak bisa diubah rolenya */}
                    {u.email === process.env.NEXT_PUBLIC_MASTER_EMAIL ? (
                      <span className="text-xs text-slate-400 italic">Tidak bisa diubah/dihapus</span>
                    ) : (
                      <>
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
                          <option value="muthawif">Muthawif</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          disabled={saving === u.id}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {saving === u.id && (
                      <span className="inline-block w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin align-middle" />
                    )}
                  </div>
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
