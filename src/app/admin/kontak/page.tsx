"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/shared/AuthContext";
import { Phone, Mail, MapPin, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// ── Social Media SVG Icons ─────────────────────────────────────────────────────
const IcoInstagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const IcoFacebook = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const IcoTwitterX = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IcoYoutube = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);
const IcoLinkedin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const IcoTelegram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IcoTikTok = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.22 8.22 0 004.8 1.54V6.84a4.85 4.85 0 01-1.03-.15z"/>
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────────
interface ContactSettings {
  whatsapp_number: string;
  whatsapp_label: string;
  whatsapp_counter: string;
  email: string;
  office_address: string;
  office_city: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  telegram: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
  whatsapp_number: "",
  whatsapp_label: "",
  whatsapp_counter: "",
  email: "",
  office_address: "",
  office_city: "",
  instagram: "",
  facebook: "",
  twitter: "",
  youtube: "",
  tiktok: "",
  linkedin: "",
  telegram: "",
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          {icon}
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{title}</h2>
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  prefix,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide"
      >
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-400 dark:focus-within:border-emerald-500 transition-all">
        {prefix && (
          <span className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap select-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-[#111] outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}



// ── Main Component ─────────────────────────────────────────────────────────────
export default function KontakManagement() {
  const { userProfile } = useAuth();
  const isMaster = userProfile?.role === "master";

  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/settings/contact");
      if (data && !data.error) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    } catch {
      // First time — use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetchApi("/settings/contact", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      if (res && res.error) {
        setStatus("error");
        setErrorMsg(res.error);
      } else {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof ContactSettings) => (val: string) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-slate-500">Memuat data kontak...</p>
        </div>
      </div>
    );
  }

  const SOSMED_FIELDS = [
    { key: "instagram" as const, label: "Instagram", prefix: "@", placeholder: "farha.umrah", icon: <IcoInstagram size={12} />, color: "bg-pink-500" },
    { key: "facebook" as const, label: "Facebook", prefix: "@", placeholder: "farha.umrah", icon: <IcoFacebook size={12} />, color: "bg-blue-600" },
    { key: "twitter" as const, label: "Twitter / X", prefix: "@", placeholder: "farha_umrah", icon: <IcoTwitterX size={12} />, color: "bg-slate-800" },
    { key: "youtube" as const, label: "YouTube", prefix: "@", placeholder: "FarhaUmrah", icon: <IcoYoutube size={12} />, color: "bg-red-600" },
    { key: "tiktok" as const, label: "TikTok", prefix: "@", placeholder: "farha.umrah", icon: <IcoTikTok size={12} />, color: "bg-slate-900" },
    { key: "linkedin" as const, label: "LinkedIn", prefix: "in/", placeholder: "farha-umrah", icon: <IcoLinkedin size={12} />, color: "bg-blue-700" },
    { key: "telegram" as const, label: "Telegram", prefix: "@", placeholder: "farha_umrah", icon: <IcoTelegram size={12} />, color: "bg-sky-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Kontak &amp; Sosial Media
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola informasi kontak dan akun sosial media yang tampil di website
          </p>
        </div>
        <button
          id="btn-save-kontak"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {/* Status Toast */}
      {status === "success" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Pengaturan kontak berhasil disimpan!
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg || "Gagal menyimpan. Coba lagi."}
        </div>
      )}

      {/* ── Section 1: Kontak Utama ── */}
      <SectionCard
        title="Kontak Utama"
        description="WhatsApp, email, dan alamat kantor"
        icon={<Phone className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="whatsapp_number"
            label="Nomor WhatsApp (Info Umum)"
            value={settings.whatsapp_number}
            onChange={set("whatsapp_number")}
            placeholder="628123456789"
            prefix="+62"
            type="tel"
          />
          <Field
            id="whatsapp_label"
            label="Label WhatsApp"
            value={settings.whatsapp_label}
            onChange={set("whatsapp_label")}
            placeholder="Customer Service FARHA"
          />
        </div>
        {isMaster && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 mb-2 p-4 border border-emerald-100 bg-emerald-50/50 rounded-xl">
            <Field
              id="whatsapp_counter"
              label="Nomor WA Counter (Penerima Order)"
              value={settings.whatsapp_counter}
              onChange={set("whatsapp_counter")}
              placeholder="6281398824346"
              prefix="+62"
              type="tel"
            />
          </div>
        )}
        <Field
          id="email"
          label="Email"
          value={settings.email}
          onChange={set("email")}
          placeholder="info@farha.id"
          type="email"
        />
        <Field
          id="office_address"
          label="Alamat Kantor"
          value={settings.office_address}
          onChange={set("office_address")}
          placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
        />
        <Field
          id="office_city"
          label="Kota / Wilayah"
          value={settings.office_city}
          onChange={set("office_city")}
          placeholder="Jakarta Selatan, Indonesia"
        />
      </SectionCard>

      {/* ── Section 2: Sosial Media ── */}
      <SectionCard
        title="Sosial Media"
        description="Username atau path untuk setiap platform"
        icon={<IcoInstagram size={16} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOSMED_FIELDS.map((f) => (
            <Field
              key={f.key}
              id={f.key}
              label={f.label}
              value={settings[f.key]}
              onChange={set(f.key)}
              placeholder={f.placeholder}
              prefix={f.prefix}
            />
          ))}
        </div>
      </SectionCard>

      {/* ── Preview Card ── */}
      <SectionCard
        title="Preview"
        description="Tampilan yang akan muncul di website"
        icon={<MapPin className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {isMaster && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-green-700 dark:text-green-400">WhatsApp</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {settings.whatsapp_number || "—"}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Email</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {settings.email || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Kantor</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {settings.office_city || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {SOSMED_FIELDS.map(({ key, label, icon, color }) => {
            const val = settings[key];
            if (!val) return null;
            return (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium ${color}`}
              >
                {icon}
                {label}
              </span>
            );
          })}
          {!SOSMED_FIELDS.some(({ key }) => settings[key]) && (
            <p className="text-xs text-slate-400 italic">Belum ada sosial media yang diisi</p>
          )}
        </div>
      </SectionCard>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button
          id="btn-save-kontak-bottom"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>
    </div>
  );
}
