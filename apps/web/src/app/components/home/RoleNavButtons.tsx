"use client";

import Link from "next/link";
import { useAuth } from "@/shared/AuthContext";

export default function RoleNavButtons() {
  const { userProfile, loading } = useAuth();

  if (loading) return null;

  const role = userProfile?.role;
  const isMaster = role === "master";
  const isAdmin = role === "admin" || isMaster;
  const isCounter = role === "counter" || isMaster;

  // Don't show the bar if the user doesn't have access to at least one of these
  if (!isAdmin && !isCounter) {
    return null;
  }

  return (
    <div className="bg-slate-950 py-6 px-6 flex justify-center gap-4 flex-wrap border-t border-slate-800">
      {isAdmin && (
        <Link 
          href="/admin/dashboard" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-6 py-2.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 text-sm font-medium transition-colors"
        >
          Admin Dashboard
        </Link>
      )}
      {isCounter && (
        <Link 
          href="/counter" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-6 py-2.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 text-sm font-medium transition-colors"
        >
          Halaman Counter
        </Link>
      )}
    </div>
  );
}
