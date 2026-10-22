"use client";

import { useEffect, useState, useMemo, Suspense, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getTransactionById,
  updateTransactionContact,
  updateTransactionQuote,
  updateTransactionStatus,
} from "@/modules/ordering/actions";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/shared/AuthContext";
import {
  openWhatsApp,
  getWhatsAppFallbackUrl,
  handleWhatsAppClick,
} from "@/lib/whatsapp";
import {
  CheckCircle2,
  Clock,
  XCircle,
  MessageCircle,
  ArrowLeft,
  Phone,
  Edit,
  Save,
  Copy,
  Package,
  Send,
  X,
  ClipboardPaste,
  Eye,
  Settings2,
  Lock,
  ChevronRight,
  ShieldCheck,
  Plane,
  Building2,
  Luggage,
  FileText,
  Bus,
  Users,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800/50",
    label: "Menunggu Kalkulasi",
    desc: "Tim kami sedang menghitung harga terbaik untuk pesanan Anda. Anda akan dihubungi via WhatsApp setelah penawaran siap.",
  },
  QUOTED: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-800/50",
    label: "Penawaran Siap",
    desc: "Harga sudah dikalkulasikan. Silakan konfirmasi via WhatsApp untuk melanjutkan pemesanan.",
  },
  CLOSED: {
    icon: CheckCircle2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800/50",
    label: "Pesanan Selesai",
    desc: "Pesanan Anda sudah dikonfirmasi dan diproses. Terima kasih telah mempercayai kami.",
  },
  CANCELLED: {
    icon: XCircle,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800/50",
    label: "Dibatalkan",
    desc: "Penawaran ini telah dibatalkan. Hubungi kami jika ada pertanyaan.",
  },
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  QUOTED: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  CLOSED: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  CANCELLED: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
};

const SPEC_LABEL_MAP: Record<string, string> = {
  pax: "Jumlah Pax",
  // Hotel
  rating: "Kelas / Bintang Hotel",
  hotelRating: "Kelas / Bintang Hotel",
  city: "Kota",
  hotelName: "Nama Hotel",
  checkIn: "Tanggal Check-In",
  checkOut: "Tanggal Check-Out",
  duration: "Durasi Menginap",
  roomType: "Tipe Kamar",
  needsMekah: "Menginap di Mekah",
  mekahHotelName: "Hotel Mekah",
  mekahCheckIn: "Check-In Mekah",
  mekahCheckOut: "Check-Out Mekah",
  mekahRooms: "Rincian Kamar Mekah",
  needsMadinah: "Menginap di Madinah",
  madinahHotelName: "Hotel Madinah",
  madinahCheckIn: "Check-In Madinah",
  madinahCheckOut: "Check-Out Madinah",
  madinahRooms: "Rincian Kamar Madinah",
  roomListFileName: "File Room List",
  // Flight
  origin: "Bandara Asal (Origin)",
  destination: "Bandara Tujuan (Destination)",
  route: "Rute Perjalanan",
  departureDate: "Tanggal Keberangkatan",
  returnDate: "Tanggal Kepulangan",
  returnDepartureDate: "Tanggal Kepulangan",
  returnOrigin: "Bandara Asal Kepulangan",
  returnDestination: "Bandara Tujuan Kepulangan",
  airline: "Maskapai Penerbangan",
  flightType: "Tipe Penerbangan",
  isRoundTrip: "Jenis Perjalanan",
  isCheapest: "Opsi Tiket",
  transitAirport: "Bandara Transit",
  // Transport
  tripType: "Tipe Perjalanan",
  vehicle: "Armada / Kendaraan",
  vehicleType: "Armada / Kendaraan",
  pickupDate: "Tanggal Penjemputan",
  date: "Tanggal Layanan",
  pickupLocation: "Lokasi Penjemputan",
  destinationLocation: "Lokasi Tujuan",
  // Visa
  visaType: "Tipe Visa",
  visaCategory: "Kategori Visa",
  passportFileName: "File Paspor",
  country: "Negara Tujuan",
  // Baggage
  weight: "Berat / Kapasitas Bagasi",
  // General
  notes: "Catatan Layanan",
};

function formatSpecLabel(key: string): string {
  if (SPEC_LABEL_MAP[key]) return SPEC_LABEL_MAP[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatSpecValue(key: string, val: any): string {
  if (val === null || val === undefined || val === "") return "-";
  if (typeof val === "boolean") {
    if (key === "isRoundTrip") return val ? "Pulang-Pergi (Round Trip)" : "Sekali Jalan (One Way)";
    if (key === "isCheapest") return val ? "Tiket Termurah / Fleksibel" : "Pilihan Maskapai Tertentu";
    if (key === "needsMekah" || key === "needsMadinah") return val ? "Ya" : "Tidak";
    return val ? "Ya" : "Tidak";
  }
  if (key === "rating" || key === "hotelRating") {
    const num = Number(val);
    if (!isNaN(num) && num > 0) return `⭐ ${num} Bintang`;
  }
  if (key === "pax") {
    return `${val} Orang / Pax`;
  }
  if (key === "flightType") {
    if (val === "direct") return "Direct (Penerbangan Langsung)";
    if (val === "transit") return "Transit";
  }
  if (key === "tripType") {
    if (val === "single") return "Single Trip";
    if (val === "full") return "Full Trip";
    if (val === "full_plus") return "Full Trip + Ziarah Tambahan";
  }
  if (typeof val === "object") {
    if (Array.isArray(val)) {
      return val.join(", ");
    }
    const nonZeroEntries = Object.entries(val).filter(([_, count]) => Number(count) > 0);
    if (nonZeroEntries.length > 0) {
      return nonZeroEntries.map(([k, count]) => `${k}: ${count}`).join(" · ");
    }
    return "-";
  }
  return String(val);
}

function getCategoryIcon(category?: string, title?: string) {
  const cat = (category || "").toUpperCase();
  const tit = (title || "").toLowerCase();

  if (cat.includes("FLIGHT") || tit.includes("pesawat") || tit.includes("tiket")) {
    return Plane;
  }
  if (cat.includes("HOTEL") || tit.includes("hotel") || tit.includes("penginapan")) {
    return Building2;
  }
  if (cat.includes("VISA") || tit.includes("visa")) {
    return FileText;
  }
  if (cat.includes("BAGGAGE") || tit.includes("bagasi")) {
    return Luggage;
  }
  if (cat.includes("TRANS") || tit.includes("transport") || tit.includes("bus") || tit.includes("armada")) {
    return Bus;
  }
  return Package;
}

function UnifiedTransactionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;

  const { user, userProfile, loading: authLoading } = useAuth();
  const isCounter = userProfile?.role === "counter" || userProfile?.role === "master" || userProfile?.role === "admin";

  const [tx, setTx] = useState<any>(null);
  const [counterWa, setCounterWa] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const autoWaTriggeredRef = useRef(false);

  // View mode: 'counter' (untuk kelola & edit harga) atau 'customer' (invoice tampilan publik)
  const [viewMode, setViewMode] = useState<"counter" | "customer">("customer");

  // Counter State
  const [waInput, setWaInput] = useState("");
  const [waEditing, setWaEditing] = useState(false);
  const [waSaving, setWaSaving] = useState(false);
  const [itemPrices, setItemPrices] = useState<Record<number, string>>({});
  const [validityHours, setValidityHours] = useState(24);
  const [publishing, setPublishing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Sinkronkan viewMode jika user terdeteksi sebagai petugas counter
  useEffect(() => {
    if (!authLoading && isCounter) {
      setViewMode("counter");
    }
  }, [authLoading, isCounter]);

  useEffect(() => {
    Promise.all([
      getTransactionById(id),
      fetchApi("/settings/contact").catch(() => ({})),
    ]).then(([txData, contactData]) => {
      if (txData) {
        setTx(txData);
        setWaInput(txData.client_whatsapp || "");
        if (!txData.client_whatsapp && isCounter) {
          setShowVerifyModal(true);
        }
        const initialPrices: Record<number, string> = {};
        (txData.items || []).forEach((item: any) => {
          initialPrices[item.id] = item.subtotal ? String(item.subtotal) : "";
        });
        setItemPrices(initialPrices);
      } else {
        setError(true);
      }

      const apiWa = contactData?.whatsapp_counter || contactData?.whatsapp_number;
      if (apiWa) {
        setCounterWa(apiWa);
      }
      setLoading(false);

      // Jika checkout mengarahkan ke sini dengan autoWa=1, picu WhatsApp
      if (searchParams.get("autoWa") === "1" && !autoWaTriggeredRef.current && apiWa) {
        autoWaTriggeredRef.current = true;
        const msg = buildCustomerPendingWaMessage(txData);
        openWhatsApp(apiWa, msg);
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", `/products/${id}`);
        }
      }
    });
  }, [id, searchParams, isCounter]);

  // Pre-parse specs
  const parsedItems = useMemo(
    () =>
      (tx?.items || []).map((item: any) => ({
        ...item,
        specs: item.specs ? (typeof item.specs === "string" ? JSON.parse(item.specs) : item.specs) : {},
      })),
    [tx?.items]
  );

  // Parse transaction notes JSON if available
  const parsedTxNotes = useMemo(() => {
    if (!tx?.notes) return null;
    try {
      return typeof tx.notes === "string" ? JSON.parse(tx.notes) : tx.notes;
    } catch {
      return { rawNotes: tx.notes };
    }
  }, [tx?.notes]);

  const userNotes =
    (typeof parsedTxNotes?.notes === "string" && parsedTxNotes.notes.trim()) ||
    (typeof parsedTxNotes?.rawNotes === "string" && parsedTxNotes.rawNotes.trim()) ||
    null;
  const userManifest =
    (typeof parsedTxNotes?.manifest === "string" && parsedTxNotes.manifest.trim()) || null;

  // Grand total kalkulasi counter
  const grandTotal = useMemo(
    () =>
      parsedItems.reduce((sum: number, item: any) => {
        const pax = Number(item.specs.pax) || 1;
        return sum + Number(itemPrices[item.id] || 0) * pax;
      }, 0),
    [parsedItems, itemPrices]
  );

  // Message Builders
  const buildCustomerPendingWaMessage = (txData?: any) => {
    const currentTx = txData || tx;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const txLink = `${origin}/products/${currentTx?.id || id}`;
    const itemsList = currentTx?.items?.length
      ? currentTx.items.map((i: any) => `• Layanan    : ${i.title}`).join("\n")
      : "";

    return [
      `*LAPORAN PESANAN BARU MASUK*`,
      ``,
      `• ID Pesanan : ${currentTx?.id || id}`,
      `• Nama       : ${currentTx?.client_name || "-"}`,
      itemsList,
      ``,
      `lihat transaksi berikut`,
      txLink,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const buildCustomerQuotedWaMessage = () => {
    return [
      `Halo Min,`,
      ``,
      `Saya ingin konfirmasi pesanan berikut:`,
      `• ID : ${tx?.id}`,
      `• Nama : ${tx?.client_name}`,
      `• Total : Rp ${tx?.total_amount_idr?.toLocaleString("id-ID")}`,
      ``,
      `Mohon info selanjutnya untuk proses pembayaran. Terima kasih 🙏`,
    ].join("\n");
  };

  const buildAdminShareWaMessage = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const lines = [
      `Halo ${tx?.client_name || "Pelanggan"},`,
      ``,
      `Berikut penawaran untuk pesanan *${tx?.id}*:`,
      ``,
      ...parsedItems.map((item: any) => {
        const pax = Number(item.specs.pax) || 1;
        const price = Number(itemPrices[item.id] || 0);
        return `• *${item.title}* (${pax} Pax) — Rp ${(price * pax).toLocaleString("id-ID")}`;
      }),
      ``,
      `💰 *Total: Rp ${grandTotal.toLocaleString("id-ID")}*`,
      `⏳ Penawaran berlaku ${validityHours} jam`,
      ``,
      `Cek rincian pesanan Anda di:`,
      `${origin}/products/${tx?.id}`,
      ``,
      `Balas pesan ini untuk konfirmasi pesanan. Terima kasih! 🙏`,
    ];
    return lines.join("\n");
  };

  // Handlers Counter
  const normalizePhone = (text: string) => {
    let digits = text.replace(/\D/g, "");
    if (digits.startsWith("62")) {
      digits = "0" + digits.substring(2);
    }
    return digits;
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWaInput(normalizePhone(text));
    } catch {
      alert("Gagal membaca clipboard. Izinkan akses clipboard di browser Anda.");
    }
  };

  const handleSaveWa = async () => {
    if (!waInput.trim()) return;
    setWaSaving(true);
    const res = await updateTransactionContact(id, waInput.trim());
    setWaSaving(false);
    if (res.success) {
      setWaEditing(false);
      setShowVerifyModal(false);
      setTx((prev: any) => ({ ...prev, client_whatsapp: waInput.trim() }));
    } else {
      alert("Gagal menyimpan: " + res.error);
    }
  };

  const handlePublishQuote = async () => {
    if (grandTotal === 0) {
      alert("Isi harga terlebih dahulu.");
      return;
    }
    setPublishing(true);
    const res = await updateTransactionQuote(id, {
      totalAmount: grandTotal,
      validityHours,
      items: itemPrices,
    });
    setPublishing(false);
    if (res.success) {
      setTx((prev: any) => ({
        ...prev,
        status: "QUOTED",
        total_amount_idr: grandTotal,
        quote_expiry: Date.now() + validityHours * 3600 * 1000,
      }));
      alert("Penawaran berhasil diterbitkan!");
    } else {
      alert("Gagal: " + res.error);
    }
  };

  const handleUpdateStatus = async (newStatus: "CLOSED" | "CANCELLED") => {
    const label = newStatus === "CLOSED" ? "Selesai (Closed)" : "Dibatalkan (Cancelled)";
    if (!confirm(`Tandai transaksi ini sebagai ${label}?`)) return;
    setActionLoading(true);
    const res = await updateTransactionStatus(id, newStatus);
    setActionLoading(false);
    if (res.success) {
      setTx((prev: any) => ({ ...prev, status: newStatus }));
    } else {
      alert("Gagal: " + res.error);
    }
  };

  const handleShareWaToCustomer = () => {
    const phone = waInput || tx?.client_whatsapp || "";
    if (!phone) {
      alert("Isi nomor WA customer terlebih dahulu.");
      return;
    }
    openWhatsApp(phone, buildAdminShareWaMessage());
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(buildAdminShareWaMessage());
    alert("Pesan penawaran tersalin ke clipboard!");
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    alert("ID Pesanan tersalin ke clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-slate-100 p-6">
        <div className="text-center space-y-4 max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Transaksi Tidak Ditemukan</h1>
          <p className="text-slate-500 dark:text-slate-400">ID: {id}</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 mt-4 bg-black text-white hover:bg-gray-900 px-6 py-3 rounded-xl transition-all text-sm font-bold shadow-md uppercase tracking-wide"
          >
            ← Kembali ke Penawaran
          </Link>
        </div>
      </div>
    );
  }

  const status = (tx.status as keyof typeof STATUS_CONFIG) || "PENDING";
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = cfg.icon;
  const isQuoted = tx.status === "QUOTED";
  const isClosed = tx.status === "CLOSED";
  const isCancelled = tx.status === "CANCELLED";
  const isEditable = !isClosed && !isCancelled;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100">
      {/* ── Top Bar / Navbar ── */}
      <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/farha-logo-only.svg" alt="FARHA Logo" className="w-8 h-8" />
            <div className="leading-tight">
              <span
                className="font-bold tracking-wide block text-[15px] text-slate-900 dark:text-white"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
              >
                FARHA
              </span>
              <span className="font-medium tracking-[0.2em] uppercase block text-[9px] text-[#C9A84C]">
                Umrah Services
              </span>
            </div>
          </Link>

          {/* Right Action & Mode Switcher */}
          <div className="flex items-center gap-3">
            {isCounter ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode((prev) => (prev === "counter" ? "customer" : "counter"))}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-[#C9A84C]"
                >
                  {viewMode === "counter" ? (
                    <>
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="hidden sm:inline">Preview</span> Tampilan Jamaah
                    </>
                  ) : (
                    <>
                      <Settings2 className="w-4 h-4 text-emerald-500" />
                      <span>Mode Edit Counter</span>
                    </>
                  )}
                </button>
                <Link
                  href="/counter"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Meja Kalkulator <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <Link
                href={`/login?next=/products/${id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Petugas Counter?</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mode Counter Active Indicator ── */}
      {isCounter && viewMode === "customer" && (
        <div className="bg-blue-600 text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
          <Eye className="w-4 h-4" />
          <span>Anda sedang melihat <strong>Pratinjau Tampilan Jamaah</strong>.</span>
          <button
            onClick={() => setViewMode("counter")}
            className="underline font-bold ml-1 hover:text-blue-100"
          >
            Buka Mode Edit Counter
          </button>
        </div>
      )}

      {/* ── Modal Input WA Customer (Khusus Petugas Counter Jika WA Kosong) ── */}
      {isCounter && showVerifyModal && !tx.client_whatsapp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 border border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Verifikasi Nomor WA Pelanggan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Nomor WA diperlukan agar penawaran dapat dikirimkan langsung ke pelanggan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={waInput}
                  onChange={(e) => setWaInput(normalizePhone(e.target.value))}
                  className="w-full h-14 pl-4 pr-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold text-lg text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 border rounded-lg text-xs font-semibold flex items-center gap-1 text-slate-600 dark:text-slate-300"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" /> Paste
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveWa}
                  disabled={waSaving || waInput.replace(/\D/g, "").length < 9}
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-md"
                >
                  <Save className="w-4 h-4" />
                  {waSaving ? "Menyimpan..." : "Simpan Nomor WA"}
                </button>
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* KONDISI 1: TAMPILAN COUNTER (Edit & Kalkulasi Harga)                        */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {isCounter && viewMode === "counter" ? (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl space-y-6">
          {/* Header Info Pesanan */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Order ID:</span>
                <span className="font-mono text-xl font-black text-slate-800 dark:text-white">{tx.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_BADGE[tx.status] ?? STATUS_BADGE.PENDING}`}>
                  {tx.status}
                </span>
                <button
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  title="Salin ID Transaksi"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Pemesan: <strong className="text-slate-700 dark:text-slate-300">{tx.client_name}</strong> · Dibuat: {new Date(tx.created_at).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Mode Petugas Aktif
              </span>
            </div>
          </div>

          {/* Catatan / Manifest dari Pemesan untuk Petugas */}
          {(userNotes || userManifest) && (
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Catatan dari Pelanggan
              </h4>
              {userNotes && (
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-100 dark:border-amber-900/40">
                  {userNotes}
                </p>
              )}
              {userManifest && (
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>File Manifest terlampir: <strong>{userManifest}</strong></span>
                </div>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── LEFT: Kalkulasi Item ── */}
            <div className="lg:col-span-2 space-y-4">
              {parsedItems.map((item: any, idx: number) => {
                const pax = Number(item.specs.pax) || 1;
                const rawPrice = itemPrices[item.id] || "";
                const price = Number(rawPrice) || 0;
                const CategoryIcon = getCategoryIcon(item.category, item.title);

                const specEntries = Object.entries(item.specs || {}).filter(([k, v]) => {
                  if (k === "pax" || k === "customFields" || k === "services") return false;
                  if (v === null || v === undefined || v === "") return false;
                  if (typeof v === "object" && !Array.isArray(v)) {
                    return Object.values(v).some((val) => Number(val) > 0 || (typeof val === "string" && val.trim() !== ""));
                  }
                  return true;
                });

                const customFieldEntries = item.specs?.customFields && typeof item.specs.customFields === "object"
                  ? Object.entries(item.specs.customFields).filter(([_, v]) => v !== null && v !== undefined && v !== "")
                  : [];

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <CategoryIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <p className="font-bold text-slate-800 dark:text-slate-100">{item.title}</p>
                      <Package className="w-4 h-4 text-slate-400 ml-auto" />
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Specs Rincian Layanan Terstruktur */}
                      <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400 mb-0.5 font-medium">Pax</p>
                          <p className="font-bold text-slate-700 dark:text-slate-200">{pax} Orang</p>
                        </div>
                        {specEntries.map(([k, v]) => (
                          <div key={k}>
                            <p className="text-slate-400 mb-0.5 font-medium">{formatSpecLabel(k)}</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200 break-words">{formatSpecValue(k, v)}</p>
                          </div>
                        ))}
                        {customFieldEntries.map(([k, v]) => (
                          <div key={k}>
                            <p className="text-slate-400 mb-0.5 font-medium">{formatSpecLabel(k)}</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200 break-words">{formatSpecValue(k, v)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Input Harga Jual */}
                      <div className="grid sm:grid-cols-2 gap-4 items-end pt-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Harga Jual / Pax (IDR)
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-slate-400 font-medium text-sm pointer-events-none">Rp</span>
                            <input
                              type="text"
                              disabled={!isEditable}
                              placeholder="0"
                              className="w-full pl-9 pr-4 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-60"
                              value={rawPrice ? parseInt(rawPrice, 10).toLocaleString("id-ID") : ""}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "");
                                setItemPrices((prev) => ({ ...prev, [item.id]: digits }));
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-right pb-1">
                          <p className="text-xs text-slate-400">Subtotal Item</p>
                          <p className="text-lg font-black text-slate-800 dark:text-slate-100">
                            Rp {(price * pax).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Masa Berlaku Penawaran */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  <Clock className="w-4 h-4 text-sky-500" /> Masa Berlaku Penawaran
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[3, 12, 24, 48].map((h) => (
                    <button
                      key={h}
                      disabled={!isEditable}
                      onClick={() => setValidityHours(h)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors disabled:opacity-50 ${
                        validityHours === h
                          ? "bg-sky-500 text-white border-sky-500"
                          : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-sky-400"
                      }`}
                    >
                      {h} Jam
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sidebar Aksi Counter ── */}
            <div className="space-y-4">
              {/* Grand Total */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/50 p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-3">
                  Ringkasan Penawaran
                </p>
                <div className="space-y-2 text-xs mb-4">
                  {parsedItems.map((item: any) => {
                    const pax = Number(item.specs.pax) || 1;
                    const price = Number(itemPrices[item.id] || 0);
                    return (
                      <div key={item.id} className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span className="truncate pr-2">
                          {item.title} (×{pax})
                        </span>
                        <span className="font-semibold whitespace-nowrap">
                          Rp {(price * pax).toLocaleString("id-ID")}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex justify-between items-center">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Total Penawaran</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    Rp {grandTotal.toLocaleString("id-ID")}
                  </span>
                </div>

                {isEditable && (
                  <button
                    onClick={handlePublishQuote}
                    disabled={publishing || grandTotal === 0}
                    className="mt-5 w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    {publishing ? "Menyimpan..." : isQuoted ? "Perbarui Penawaran" : "Terbitkan Penawaran"}
                  </button>
                )}
              </div>

              {/* Komunikasi Pelanggan */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Kontak Pelanggan</p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Nomor WA Customer
                  </label>
                  {waEditing ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="tel"
                        placeholder="08123456789"
                        value={waInput}
                        onChange={(e) => setWaInput(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={handleSaveWa}
                        disabled={waSaving || !waInput.trim()}
                        className="h-9 w-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setWaEditing(false);
                          setWaInput(tx.client_whatsapp || "");
                        }}
                        className="h-9 w-9 rounded-lg border text-slate-500 hover:bg-slate-50 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="flex-1 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                        {waInput || <span className="text-slate-400 italic">Belum diisi</span>}
                      </span>
                      <button
                        onClick={() => setWaEditing(true)}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleShareWaToCustomer}
                    className="w-full h-11 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Kirim Penawaran via WA
                  </button>
                  <button
                    onClick={handleCopyMessage}
                    className="w-full h-11 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Salin Pesan Penawaran
                  </button>
                </div>
              </div>

              {/* Status Selesai / Batal */}
              {isEditable && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2">Aksi Transaksi</p>
                  {isQuoted && (
                    <button
                      onClick={() => handleUpdateStatus("CLOSED")}
                      disabled={actionLoading}
                      className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Tandai Selesai (Closed)
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdateStatus("CANCELLED")}
                    disabled={actionLoading}
                    className="w-full h-11 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Batalkan Pesanan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────────────────────── */
        /* KONDISI 2: TAMPILAN CUSTOMER / JAMAAH (Invoice & Rincian Lengkap)           */
        /* ────────────────────────────────────────────────────────────────────────── */
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl space-y-8">
          {/* Header Info Transaksi Jamaah */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">ID Pesanan:</span>
                <span className="font-mono text-xl md:text-2xl font-black text-slate-800 dark:text-white">
                  {tx.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  title="Salin ID Pesanan"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_BADGE[tx.status] ?? STATUS_BADGE.PENDING}`}>
                  {STATUS_CONFIG[status]?.label || tx.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pemesan: <strong className="text-slate-800 dark:text-slate-200">{tx.client_name || "-"}</strong>
                {tx.created_at && (
                  <span>
                    {" "}· Tanggal:{" "}
                    {new Date(tx.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </p>
            </div>

            {/* Total Penawaran Jika QUOTED atau CLOSED */}
            {(status === "QUOTED" || status === "CLOSED") && tx.total_amount_idr && (
              <div className="text-left md:text-right pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Penawaran</p>
                <p className="text-2xl md:text-3xl font-black text-[#C9A84C]">
                  Rp {tx.total_amount_idr.toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>

          {/* Status Card Utama / Banner */}
          <div className={`rounded-3xl border p-6 md:p-8 text-center space-y-6 ${cfg.bg} ${cfg.border} shadow-sm`}>
            <div
              className={`mx-auto w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm border ${cfg.border}`}
            >
              <StatusIcon className={`w-8 h-8 md:w-10 md:h-10 ${cfg.color}`} />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Status Pesanan</p>
              <h1 className={`text-2xl md:text-3xl font-extrabold ${cfg.color}`}>{cfg.label}</h1>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-lg mx-auto">
              {cfg.desc}
            </p>

            {/* Total Penawaran & Expiry Jika QUOTED atau CLOSED */}
            {(status === "QUOTED" || status === "CLOSED") && tx.total_amount_idr && (
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Penawaran</p>
                <p className="text-3xl md:text-4xl font-black text-[#C9A84C]">
                  Rp {tx.total_amount_idr.toLocaleString("id-ID")}
                </p>
                {tx.quote_expiry && (
                  <p className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    Berlaku hingga: {new Date(tx.quote_expiry).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                )}
              </div>
            )}

            {/* CTA untuk PENDING (Kirim laporan ke WA Admin) */}
            {status === "PENDING" && (
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!counterWa) {
                      alert("Service sedang maintain (Nomor Counter tidak tersedia).");
                      return;
                    }
                    openWhatsApp(counterWa, buildCustomerPendingWaMessage());
                  }}
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-600/20 text-white font-bold text-sm transition-all w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  Kirim Laporan ke WhatsApp Admin
                </button>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  WhatsApp tidak terbuka otomatis? Ketuk tombol di atas untuk mengirimkan rincian pesanan ke admin kami.
                </p>
              </div>
            )}

            {/* CTA untuk QUOTED (Konfirmasi Pesanan ke WA Admin) */}
            {status === "QUOTED" && (
              <div className="pt-2">
                <a
                  href={counterWa ? getWhatsAppFallbackUrl(counterWa, buildCustomerQuotedWaMessage()) : "#"}
                  onClick={(e) => {
                    if (!counterWa) {
                      e.preventDefault();
                      alert("Service sedang maintain (Nomor Counter tidak tersedia).");
                      return;
                    }
                    handleWhatsAppClick(counterWa, buildCustomerQuotedWaMessage())(e);
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#8B6914] hover:shadow-lg hover:shadow-[#C9A84C]/20 text-white font-bold text-sm transition-all w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  Konfirmasi via WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* ── RINCIAN LENGKAP LAYANAN YANG DIPESAN (CUSTOMER VIEW) ── */}
          {parsedItems && parsedItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Rincian Lengkap Layanan yang Dipesan
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {parsedItems.length} Layanan
                </span>
              </div>

              <div className="space-y-4">
                {parsedItems.map((item: any, idx: number) => {
                  const CategoryIcon = getCategoryIcon(item.category, item.title);
                  const pax = Number(item.specs?.pax) || (item.specs?.pax && item.specs.pax !== "N/A" ? item.specs.pax : null);
                  const hasPrice = (status === "QUOTED" || status === "CLOSED") && item.subtotal;

                  // Filter spec entries
                  const specEntries = Object.entries(item.specs || {}).filter(([k, v]) => {
                    if (k === "pax" || k === "customFields" || k === "services") return false;
                    if (v === null || v === undefined || v === "") return false;
                    if (typeof v === "object" && !Array.isArray(v)) {
                      return Object.values(v).some((val) => Number(val) > 0 || (typeof val === "string" && val.trim() !== ""));
                    }
                    return true;
                  });

                  const customFieldEntries = item.specs?.customFields && typeof item.specs.customFields === "object"
                    ? Object.entries(item.specs.customFields).filter(([_, v]) => v !== null && v !== undefined && v !== "")
                    : [];

                  return (
                    <div
                      key={item.id || idx}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                    >
                      {/* Card Header: Lengkap dengan icon, nomor, dan subtotal jika ada */}
                      <div className="flex items-center justify-between px-5 md:px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#C9A84C] flex items-center justify-center font-bold text-xs shadow-sm">
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                              {item.title}
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              Layanan #{idx + 1}
                            </p>
                          </div>
                        </div>

                        {/* Subtotal Item jika QUOTED/CLOSED, atau Badge Status jika PENDING */}
                        <div>
                          {hasPrice ? (
                            <div className="text-right">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Subtotal</span>
                              <span className="text-sm md:text-base font-black text-[#C9A84C]">
                                Rp {Number(item.subtotal).toLocaleString("id-ID")}
                              </span>
                            </div>
                          ) : status === "PENDING" ? (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                              Menunggu Hitungan
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Card Body: Detail Grid Lengkap Semua Data yang Di-input */}
                      <div className="p-5 md:p-6 space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-4 md:p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                          {/* Pax */}
                          {pax && (
                            <div className="space-y-0.5">
                              <p className="text-slate-400 font-medium">Jumlah Pax</p>
                              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                {pax} Orang
                              </p>
                            </div>
                          )}

                          {/* Standard Spec Entries */}
                          {specEntries.map(([k, v]) => (
                            <div key={k} className="space-y-0.5">
                              <p className="text-slate-400 font-medium">{formatSpecLabel(k)}</p>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">
                                {formatSpecValue(k, v)}
                              </p>
                            </div>
                          ))}

                          {/* Custom Fields */}
                          {customFieldEntries.map(([k, v]) => (
                            <div key={k} className="space-y-0.5">
                              <p className="text-slate-400 font-medium">{formatSpecLabel(k)}</p>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">
                                {formatSpecValue(k, v)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Catatan Tambahan Pemesan (Jika ada) */}
          {(userNotes || userManifest) && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Informasi Tambahan Pesanan
              </h3>
              {userNotes && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Catatan / Kebutuhan Khusus:</p>
                  <p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {userNotes}
                  </p>
                </div>
              )}
              {userManifest && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Dokumen Manifest terlampir: <strong>{userManifest}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Footer Card */}
          <div className="text-center space-y-3 pt-2">
            <p className="text-xs font-medium text-slate-400">
              Simpan halaman ini untuk memantau pembaruan status pesanan Anda sewaktu-waktu.
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-2.5 px-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Buat Penawaran Lain
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function UnifiedTransactionDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <UnifiedTransactionPage />
    </Suspense>
  );
}
