"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTransaction } from "@/modules/ordering/actions";
import { fetchApi } from "@/lib/api";
import { useAlert } from "@/shared/AlertContext";
import { Building2, Bus, Ticket, User, Users, Plane, CheckCircle2, UploadCloud, Check, Briefcase, Car, MessageCircle, HelpCircle } from "lucide-react";
import { DatePickerNative } from "./UtilsCatalog";
import { HotelSpecsModuleComponent } from "./modules/HotelSpecsModule";
import { FlightLogicModuleComponent } from "./modules/FlightLogicModule";
import { VisaModuleComponent } from "./modules/VisaModule";
import { TransportModuleComponent } from "./modules/TransportModule";
import packageItemsData from "@/contents/packages/packages.json";

const ICON_MAP: Record<string, any> = {
  Building2,
  Plane,
  Briefcase,
  Ticket,
  Car,
  Bus,
  User,
  Users,
  CheckCircle2,
  HelpCircle,
};

const PACKAGE_ITEMS = packageItemsData.criteria;

const DEFAULT_MODULE_SPECS: Record<string, any> = {
  FLIGHT: { origin: "", destination: "", airline: "", departureDate: "", returnDate: "", isRoundTrip: true, isCheapest: false },
  HOTEL_MEKAH: { mekahHotelName: "", mekahCheckIn: "", mekahCheckOut: "", mekahRooms: { Double: 1, Triple: 0, Quad: 0, Quint: 0 } },
  HOTEL_MADINAH: { madinahHotelName: "", madinahCheckIn: "", madinahCheckOut: "", madinahRooms: { Double: 1, Triple: 0, Quad: 0, Quint: 0 } },
  VISA: { type: "Umrah", entryDate: "", exitDate: "", groupType: "Perorangan" },
  TRANS_FULL: { vehicle: "", vehicleCount: "", route: "", date: "" },
  FLIGHT_DOM: { origin: "", destination: "", airline: "", departureDate: "", returnDate: "", isRoundTrip: true, isCheapest: false },
  HOTEL_DOM: { mekahHotelName: "", mekahCheckIn: "", mekahCheckOut: "", mekahRooms: { Double: 1, Triple: 0, Quad: 0, Quint: 0 } }
};

export function PackageBuilder() {
  const { showAlert } = useAlert();
  
  const productMap = useMemo(() => {
    return Object.fromEntries(PACKAGE_ITEMS.map(p => [p.id, p]));
  }, []);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", whatsapp: "" });

  const [formData, setFormData] = useState({ pax: "", manifestFileName: "", notes: "" });
  const [moduleSpecs, setModuleSpecs] = useState<Record<string, any>>(DEFAULT_MODULE_SPECS);
  const [genericData, setGenericData] = useState<Record<string, Record<string, string>>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleService = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const updateModuleSpec = (serviceId: string, field: string, value: any) => {
    setModuleSpecs(prev => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] || {}), [field]: value }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, manifestFileName: e.target.files[0].name });
    }
  };

  const needsPax = selectedServices.some(id => productMap[id]?.requires_pax);
  const { totalEstimateMin, totalEstimateMax } = useMemo(() => {
    return selectedServices.reduce((acc, id) => {
      const p = productMap[id];
      if (p) {
        acc.totalEstimateMin += p.estimatedPriceMin || 0;
        acc.totalEstimateMax += p.estimatedPriceMax || 0;
      }
      return acc;
    }, { totalEstimateMin: 0, totalEstimateMax: 0 });
  }, [selectedServices, productMap]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };


  const moduleRenderers: Record<string, (srvId: string, mod: any, i: number) => React.ReactNode> = {
    HotelSpecsModule: (srvId, mod, i) => <HotelSpecsModuleComponent key={i} srvId={srvId} mod={mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={'single'} />,
    FlightLogicModule: (srvId, mod, i) => <FlightLogicModuleComponent key={i} srvId={srvId} mod={mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={'single'} />,
    VisaModule: (srvId, mod, i) => <VisaModuleComponent key={i} srvId={srvId} mod={mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={'single'} />,
    TransportModule: (srvId, mod, i) => <TransportModuleComponent key={i} srvId={srvId} mod={mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={'full'} />,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      showAlert({ title: "Perhatian", message: "Silakan pilih minimal 1 layanan.", type: "warning" });
      return;
    }
    setShowContactModal(true);
  };

  const doSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let counterWa = "";
    try {
      const contactData = await fetchApi('/settings/contact');
      const apiWa = contactData?.whatsapp_counter || contactData?.whatsapp_number;
      if (apiWa) counterWa = apiWa.replace(/\D/g, '');
    } catch (e) {
      console.warn("Failed to fetch contact settings", e);
    }

    if (!counterWa) {
      showAlert({ title: "Maaf", message: "Service sedang maintain.", type: "error" });
      setLoading(false);
      return;
    }

    const specsJson = JSON.stringify({
      services: selectedServices.map(id => productMap[id].title),
      pax: needsPax ? formData.pax : "N/A",
      notes: formData.notes,
      manifest: formData.manifestFileName,
      flight: selectedServices.includes("FLIGHT") ? moduleSpecs['FLIGHT'] : null,
      hotelMekah: selectedServices.includes("HOTEL_MEKAH") ? moduleSpecs['HOTEL_MEKAH'] : null,
      hotelMadinah: selectedServices.includes("HOTEL_MADINAH") ? moduleSpecs['HOTEL_MADINAH'] : null,
      visa: selectedServices.includes("VISA") ? moduleSpecs['VISA'] : null,
      transport: selectedServices.includes("TRANS_FULL") ? moduleSpecs['TRANS_FULL'] : null,
      flightDom: selectedServices.includes("FLIGHT_DOM") ? moduleSpecs['FLIGHT_DOM'] : null,
      hotelDom: selectedServices.includes("HOTEL_DOM") ? moduleSpecs['HOTEL_DOM'] : null,
      flags: {
        tourLeader: selectedServices.includes("TOUR_LEADER"),
        muthawif: selectedServices.includes("MUTHAWIF"),
        handlingJkt: selectedServices.includes("HANDLING_JKT"),
        handlingArab: selectedServices.includes("HANDLING_ARAB"),
        transThaif: selectedServices.includes("TRANS_THAIF"),
        siskopatuh: selectedServices.includes("SISKOPATUH")
      }
    });

    const waTab = window.open('about:blank', '_blank');

    try {
      const res = await createTransaction({
        name: contactForm.name,
        whatsapp: "",
        pax: needsPax ? formData.pax : "0",
        hotelRating: "4",
        notes: specsJson,
        data: moduleSpecs,
      });

      if (res.success) {
        const txId = res.transactionId;
        const adminLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/counter/products/${txId}`;

        const waMessage = [
          `*LAPORAN PAKET UMRAH BARU*`,
          ``,
          `• ID Pesanan : ${txId}`,
          `• Nama       : ${contactForm.name}`,
          `• Kriteria Paket :`,
          ...selectedServices.map(id => `  - ${productMap[id].title}`),
          ``,
          `lihat transaksi berikut`,
          adminLink
        ].join("\n");

        const waUrl = `https://wa.me/${counterWa}?text=${encodeURIComponent(waMessage)}`;
        const txUrl = `/products/${txId}`;

        if (waTab) waTab.location.href = waUrl;
        window.location.href = txUrl;

        setShowContactModal(false);
        setContactForm({ name: "", whatsapp: "" });
        setFormData({ pax: "", manifestFileName: "", notes: "" });
        setSelectedServices([]);
      } else {
        if (waTab) waTab.close();
        showAlert({ title: "Gagal", message: "Gagal mengirim pesanan: " + res.error, type: "error" });
      }
    } catch (err) {
      if (waTab) waTab.close();
      console.error(err);
      showAlert({ title: "Error", message: "Terjadi kesalahan. Silakan coba lagi.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-12 pb-24">
      {/* Estimasi Tarif Box - Moved to top */}
      {selectedServices.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-2xl p-6 flex flex-col items-center md:items-start text-center md:text-left shadow-lg animate-in fade-in slide-in-from-top-8 duration-500 gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400">Estimasi Tarif Dasar</h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-500/80">Harga adalah estimasi per pax, bisa berubah berdasarkan spesifikasi aktual.</p>
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatRupiah(totalEstimateMin)} - {formatRupiah(totalEstimateMax)}
          </div>
        </div>
      )}

      {/* 1. Services Selection Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">1</span>
          Pilih Kriteria Paket
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PACKAGE_ITEMS.map((srv) => {
            const isSelected = selectedServices.includes(srv.id);
            const IconComp = ICON_MAP[srv.icon] || HelpCircle;

            return (
              <div
                key={srv.id}
                onClick={() => toggleService(srv.id)}
                className={`relative cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${isSelected
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-md scale-105'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-black/40 text-slate-500 hover:border-emerald-300'
                  }`}
              >
                <IconComp className="h-8 w-8" />
                <span className="mt-4 font-semibold text-center text-sm">{srv.title}</span>
                {isSelected && (
                  <div className="absolute top-3 right-3 text-emerald-500">
                    <CheckCircle2 className="h-5 w-5 fill-emerald-100" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      
      {/* Show Forms if any service is selected */}
      {selectedServices.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">


          {/* 2. Dynamic Service Forms */}
          {selectedServices.some(id => productMap[id].form_schema.length > 0) && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">2</span>
                Detail Kriteria
              </h2>
              <div className="grid gap-6">
                {selectedServices.map(srvId => {
                  const service = productMap[srvId];
                  if (!service || service.form_schema.length === 0) return null;

                  const IconComp = ICON_MAP[service.icon] || HelpCircle;

                  return (
                    <div key={srvId} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3 text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
                        <IconComp className="text-emerald-500 h-5 w-5" /> {service.title}
                      </div>

                      <div className="space-y-4">
                        {service.form_schema.map((mod: any, i: number) => {
                          const renderer = moduleRenderers[mod.type];
                          return renderer ? renderer(srvId, mod, i) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. General Data & Manifest */}
          {needsPax && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">
                  {selectedServices.some(id => productMap[id].form_schema.length > 0) ? '3' : '2'}
                </span>
                Data Rombongan
              </h2>
              <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-6">

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col justify-center">
                    <Label>Total Jamaah (PAX)</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="number"
                        min="1"
                        required={needsPax}
                        placeholder="Contoh: 45"
                        className="pl-10 h-10"
                        value={formData.pax}
                        onChange={e => setFormData({ ...formData, pax: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') e.preventDefault();
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Manifest (Opsional)</Label>
                    <div
                      className="flex items-center gap-4 p-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors h-[4.5rem]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div className="flex-1 overflow-hidden flex flex-col justify-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                          {formData.manifestFileName || "Pilih file Excel/PDF..."}
                        </p>
                        <p className="text-xs text-slate-500">Maksimal 5MB</p>
                      </div>
                      {formData.manifestFileName && <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2" />}
                    </div>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.xlsx,.xls,.csv" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Catatan Tambahan</Label>
                  <Textarea placeholder="Tulis instruksi khusus di sini..." className="min-h-[100px]" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                </div>
              </div>
            </section>
          )}

          {/* Submit Button */}
          <section className="space-y-6">
            <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {loading ? "Memproses..." : "Buat Penawaran Paket"}
              </Button>
            </div>
          </section>

        </form>
      )}

      {/* Modal Konfirmasi Kontak */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowContactModal(false); }}
        >
          <div className="w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Satu Langkah Lagi!</h3>
                <p className="text-sm text-slate-500 mt-0.5">Masukkan nama untuk pesanan ini.</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={doSubmitOrder} className="px-6 py-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="modal-name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="modal-name"
                    required
                    autoFocus
                    placeholder="Masukkan nama Anda"
                    className="pl-10 h-11"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {loading ? "Mengirim..." : "Kirim & Buka WhatsApp Admin"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
