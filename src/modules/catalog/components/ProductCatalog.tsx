"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTransaction } from "@/modules/ordering/actions";
import { fetchApi } from "@/lib/api";
import { useAlert } from "@/shared/AlertContext";
import { Building2, Bus, Ticket, User, Phone, Plane, CheckCircle2, UploadCloud, Users, Check, Briefcase, Car, CalendarDays, MapPin, HelpCircle, X, MessageCircle, Search, ChevronDown, ChevronUp } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const ICON_MAP: Record<string, any> = {
  Building2,
  Plane,
  Briefcase,
  Ticket,
  Car,
  Bus,
  HelpCircle,
};

import transportData from "@/contents/products/transport.json";
import hotelData from "@/contents/products/hotel.json";
import airportData from "@/contents/products/airport.json";
import visaData from "@/contents/products/visa.json";
import catalogData from "@/contents/products/catalog.json";
import newHotelData from "@/contents/products/hotel.json";


const {
  transportPrices: TRANSPORT_PRICES,
  fullTripPrices: FULL_TRIP_PRICES,
  transportVehicles: TRANSPORT_VEHICLES,
  fullTripRoutes: FULL_TRIP_ROUTES,
  fullPlusRoutes: FULL_PLUS_ROUTES
} = transportData;

const HOTEL_OPTIONS = [
  ...(hotelData.makkah_hotels || []).map(h => ({ location: "Mekah", name: h.name, star: h.stars })),
  ...(hotelData.madinah_hotels || []).map(h => ({ location: "Madinah", name: h.name, star: h.stars }))
];
const { airportOptions: AIRPORT_OPTIONS } = airportData;

const {
  visaTypes: VISA_TYPES,
  visaCategories: VISA_CATEGORIES,
  visaPricing: VISA_PRICING
} = visaData;

const { defaultModuleSpecs: DEFAULT_MODULE_SPECS } = catalogData;
const { makkah_hotels: MAKKAH_HOTELS, madinah_hotels: MADINAH_HOTELS } = newHotelData;



import { SearchableSelect, DatePickerNative, CatalogModuleProps } from "./UtilsCatalog";
import { HotelSpecsModuleComponent } from "./modules/HotelSpecsModule";
import { FlightLogicModuleComponent } from "./modules/FlightLogicModule";
import { BaggageModuleComponent } from "./modules/BaggageModule";
import { VisaModuleComponent } from "./modules/VisaModule";
import { TransportModuleComponent } from "./modules/TransportModule";

/** Unified specs keyed by service ID — replaces 6 separate useState hooks */
type ModuleSpecs = Record<string, any>;

export function ProductCatalog({ initialProducts = [] }: { initialProducts?: any[] }) {
  const { showAlert } = useAlert();

  // Memoize parsed products + O(1) lookup map together
  const { products, productMap } = useMemo(() => {
    const prods = initialProducts.map(p => {
      let parsedSchema = [];
      if (typeof p.form_schema === "string") {
        try { parsedSchema = JSON.parse(p.form_schema); } catch { parsedSchema = []; }
      } else {
        parsedSchema = p.form_schema || [];
      }
      return { ...p, requires_pax: p.requires_pax === 1, form_schema: parsedSchema };
    });
    const map: Record<string, typeof prods[0]> = Object.fromEntries(prods.map(p => [p.id, p]));
    return { products: prods, productMap: map };
  }, [initialProducts]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal konfirmasi kontak
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showVisaPricingModal, setShowVisaPricingModal] = useState(false);
  const [showHotelPricingModal, setShowHotelPricingModal] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", whatsapp: "" });

  // Pax & manifest data (tidak termasuk nama/WA lagi)
  const [formData, setFormData] = useState({
    pax: "",
    manifestFileName: "",
    notes: "",
  });

  // Unified module specs state — keyed by service ID
  // Replaces the 6 separate useState hooks (flightData, hotelData, etc.)
  const [moduleSpecs, setModuleSpecs] = useState<Record<string, ModuleSpecs>>(DEFAULT_MODULE_SPECS);

  const updateModuleSpec = (serviceId: string, field: string, value: any) => {
    setModuleSpecs(prev => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] || {}), [field]: value }
    }));
  };

  // State for generic custom fields (from dynamic schema TextInput / DatePickerNative)
  const [genericData, setGenericData] = useState<Record<string, Record<string, string>>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  
  // ─── Deep Linking / URL Query Initialization ──────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const product = params.get("product");
      
      if (product) {
        setSelectedServices([product]);
        
        setModuleSpecs((prev) => {
          const newSpecs = { ...prev };
          
          if (product === "HOTEL") {
            const city = params.get("city");
            const checkin = params.get("checkin");
            if (!newSpecs.HOTEL) newSpecs.HOTEL = { ...DEFAULT_MODULE_SPECS.HOTEL };
            if (city === "Mekah") {
              newSpecs.HOTEL.needsMekah = true;
              newSpecs.HOTEL.needsMadinah = false;
              if (checkin) newSpecs.HOTEL.mekahCheckIn = checkin;
            } else if (city === "Madinah") {
              newSpecs.HOTEL.needsMadinah = true;
              newSpecs.HOTEL.needsMekah = false;
              if (checkin) newSpecs.HOTEL.madinahCheckIn = checkin;
            }
          } 
          else if (product === "FLIGHT_INTL") {
            const route = params.get("route");
            const date = params.get("date");
            const rt = params.get("round_trip");
            if (!newSpecs.FLIGHT_INTL) newSpecs.FLIGHT_INTL = { ...(DEFAULT_MODULE_SPECS.FLIGHT || {}) };
            if (route) {
              const [origin, dest] = route.split("-");
              if (origin) newSpecs.FLIGHT_INTL.origin = origin;
              if (dest) newSpecs.FLIGHT_INTL.destination = dest;
            }
            if (date) newSpecs.FLIGHT_INTL.departureDate = date;
            if (rt !== null) newSpecs.FLIGHT_INTL.isRoundTrip = rt === "true";
          }
          else if (product === "TRANSPORTASI") {
            const type = params.get("type");
            if (!newSpecs.TRANSPORTASI) newSpecs.TRANSPORTASI = { ...DEFAULT_MODULE_SPECS.TRANSPORTASI };
            if (type) {
              const t = type.toLowerCase();
              newSpecs.TRANSPORTASI.tripType = t === "single trip" ? "single" : t === "full trip" ? "full" : "full_plus";
            }
          }
          else if (product === "VISA") {
            const type = params.get("type");
            const pax = params.get("pax");
            if (!newSpecs.VISA) newSpecs.VISA = { ...DEFAULT_MODULE_SPECS.VISA };
            if (type) newSpecs.VISA.type = type;
            // Pax is handled globally in formData, so we do it outside prev
          }
          
          return newSpecs;
        });

        // Set pax if product is VISA
        if (product === "VISA") {
          const pax = params.get("pax");
          if (pax) {
            setFormData(prevForm => ({ ...prevForm, pax }));
          }
        }
      }
    }
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGenericChange = (serviceId: string, fieldName: string, value: string) => {
    setGenericData(prev => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] || {}), [fieldName]: value }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, manifestFileName: e.target.files[0].name });
    }
  };

  // O(1) lookup via productMap — avoids find() inside render
  const needsPax = selectedServices.some(id => productMap[id]?.requires_pax);

  // ─── Module Render Registry ───────────────────────────────────────────────
  // O(1) lookup by type string instead of linear if-chain.
  // Signature: (serviceId, mod, index) => ReactNode
  // ─────────────────────────────────────────────────────────────────────────
  const moduleRenderers: Record<string, (srvId: string, mod: any, i: number) => React.ReactNode> = {

    HotelSpecsModule: (srvId, _mod, i) => <HotelSpecsModuleComponent key={i} srvId={srvId} mod={_mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={moduleSpecs[srvId]?.tripType || 'single'} />,

    FlightLogicModule: (srvId, _mod, i) => <FlightLogicModuleComponent key={i} srvId={srvId} mod={_mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={moduleSpecs[srvId]?.tripType || 'single'} />,

    BaggageModule: (srvId, _mod, i) => <BaggageModuleComponent key={i} srvId={srvId} mod={_mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={moduleSpecs[srvId]?.tripType || 'single'} />,

    VisaModule: (srvId, _mod, i) => <VisaModuleComponent key={i} srvId={srvId} mod={_mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={moduleSpecs[srvId]?.tripType || 'single'} />,

    TransportModule: (srvId, _mod, i) => <TransportModuleComponent key={i} srvId={srvId} mod={_mod} i={i} moduleSpecs={moduleSpecs} updateModuleSpec={updateModuleSpec} tripType={moduleSpecs[srvId]?.tripType || 'single'} />,

    // Generic modules — also in registry for uniformity
    TextInput: (srvId, mod, i) => (
      <div key={i} className="space-y-2">
        <Label>{mod.label}</Label>
        <Input
          placeholder="Ketik jawaban..."
          value={genericData[srvId]?.[mod.name] || ""}
          onChange={e => handleGenericChange(srvId, mod.name, e.target.value)}
          required
        />
      </div>
    ),

    DatePickerNative: (srvId, mod, i) => (
      <div key={i} className="space-y-2">
        <Label>{mod.label}</Label>
        <DatePickerNative
          value={genericData[srvId]?.[mod.name] || ""}
          onChange={val => handleGenericChange(srvId, mod.name, val)}
        />
      </div>
    ),
  };

  /** Step 1: Validasi form layanan → tampilkan modal kontak */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      showAlert({ title: "Perhatian", message: "Silakan pilih minimal 1 layanan.", type: "warning" });
      return;
    }
    // Form layanan valid — tampilkan modal isi nama & nomor WA
    setShowContactModal(true);
  };

  /** Step 2: Dari modal — kirim order, buka tab quote + redirect WA admin */
  const doSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let counterWa = "";
    try {
      const contactData = await fetchApi('/settings/contact');
      const apiWa = contactData?.whatsapp_counter || contactData?.whatsapp_number;
      if (apiWa) {
        counterWa = apiWa.replace(/\D/g, '');
      }
    } catch (e) {
      console.warn("Failed to fetch contact settings", e);
    }

    if (!counterWa) {
      showAlert({ title: "Maaf", message: "Service sedang maintain.", type: "error" });
      setLoading(false);
      return;
    }

    const customFields: any = {};
    selectedServices.forEach(id => {
      if (genericData[id]) customFields[id] = genericData[id];
    });

    const flightSpecs = moduleSpecs['FLIGHT'];
    const specsJson = JSON.stringify({
      services: selectedServices,
      pax: needsPax ? formData.pax : "N/A",
      notes: formData.notes,
      manifest: formData.manifestFileName,
      flight: selectedServices.includes("FLIGHT") ? {
        ...flightSpecs,
        route: `${flightSpecs.origin} - ${flightSpecs.destination} ${flightSpecs.isRoundTrip ? `- ${flightSpecs.origin}` : ''}`
      } : null,
      hotel: selectedServices.includes("HOTEL") ? moduleSpecs['HOTEL'] : null,
      baggage: selectedServices.includes("BAGGAGE") ? moduleSpecs['BAGGAGE'] : null,
      visa: selectedServices.includes("VISA") ? moduleSpecs['VISA'] : null,
      transAirport: selectedServices.includes("TRANS_AIRPORT") ? moduleSpecs['TRANS_AIRPORT'] : null,
      transTour: selectedServices.includes("TRANS_TOUR") ? moduleSpecs['TRANS_TOUR'] : null,
      customFields
    });
    // Buka tab baru sebelum await untuk menghindari popup blocker
    const waTab = window.open('about:blank', '_blank');

    try {
      const res = await createTransaction({
        name: contactForm.name,
        whatsapp: "", // Sudah tidak pakai input WA dari user
        pax: needsPax ? formData.pax : "0",
        hotelRating: moduleSpecs['HOTEL']?.rating || "4",
        notes: specsJson,
      });

      if (res.success) {
        const txId = res.transactionId;

        const adminLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/counter/products/${txId}`;

        // Bangun pesan WA untuk admin (Laporan)
        const waMessage = [
          `*LAPORAN PESANAN BARU MASUK*`,
          ``,
          `• ID Pesanan : ${txId}`,
          `• Nama       : ${contactForm.name}`,
          `• Layanan    : ${selectedServices.join(", ")}`,
          ``,
          `lihat transaksi berikut`,
          adminLink
        ].join("\n");

        const waUrl = `https://wa.me/${counterWa}?text=${encodeURIComponent(waMessage)}`;
        const txUrl = `/products/${txId}`;

        // Arahkan tab baru ke WA, dan tab saat ini ke halaman penawaran
        if (waTab) waTab.location.href = waUrl;
        window.location.href = txUrl;

        // Reset semua state
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

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const displayedProducts = (searchQuery || showAllProducts) ? filteredProducts : filteredProducts.slice(0, 6);

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
  };

  const handleDownloadPdf = async (elementId: string, filename: string) => {
    setIsDownloadingPdf(true);
    // Beri jeda sejenak agar UI bisa update menjadi loading
    await new Promise(resolve => setTimeout(resolve, 100));

    const element = document.getElementById(elementId);
    if (!element) {
      setIsDownloadingPdf(false);
      return;
    }

    // Cari tahu lebar asli tabel untuk menghindari kepotong di HP
    let targetWidth = element.scrollWidth;
    const innerTables = element.querySelectorAll('table');
    innerTables.forEach(t => {
      if (t.scrollWidth + 100 > targetWidth) {
        targetWidth = t.scrollWidth + 100;
      }
    });
    // Paksa minimal lebar seperti desktop (1200px) agar layout tidak terhimpit
    targetWidth = Math.max(targetWidth, 1200);

    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        windowWidth: targetWidth,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.overflow = 'visible';
            clonedElement.style.height = 'max-content';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.width = targetWidth + 'px';
            
            // Allow horizontal tables to expand fully
            const scrollables = clonedElement.querySelectorAll('.overflow-x-auto, .overflow-auto');
            scrollables.forEach(el => {
              (el as HTMLElement).style.overflow = 'visible';
              (el as HTMLElement).style.width = '100%';
            });

            // Show logo on PDF
            const logoEl = clonedElement.querySelector('.pdf-logo');
            if (logoEl) {
              logoEl.classList.remove('hidden');
              logoEl.classList.add('flex');
            }
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(filename);
    } catch (error: any) {
      console.error('Failed to generate PDF', error);
      alert("Gagal memproses PDF: " + (error?.message || error));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-emerald-500" />
        </div>
        <input
          type="text"
          className="w-full h-14 pl-12 pr-28 rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-sm"
          placeholder="Cari layanan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-3 flex items-center text-red-500 hover:text-red-600 transition-colors bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 my-2 rounded-xl"
            title="Hapus pencarian"
          >
            <span className="text-sm font-medium mr-1">Hapus</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 1. Services Selection Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">1</span>
          Pilih Layanan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayedProducts.map((srv) => {
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
          {filteredProducts.length === 0 && (
            <div className="col-span-2 md:col-span-3 p-10 border-2 border-dashed rounded-xl text-center text-slate-500">
              Belum ada layanan tersedia. Hubungi Administrator.
            </div>
          )}
        </div>
        {!searchQuery && products.length > 6 && (
          <div className="flex justify-center mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 group transition-all"
            >
              {showAllProducts ? (
                <>
                  Sembunyikan semua paket <ChevronUp className="ml-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                </>
              ) : (
                <>
                  Lihat semua paket ({products.length}) <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </Button>
          </div>
        )}
      </section>

      {/* Show Forms if any service is selected */}
      {selectedServices.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">

          {/* 2. Dynamic Service Forms */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">2</span>
              Detail Layanan
            </h2>
            <div className="grid gap-6">

              {selectedServices.map(srvId => {
                const service = productMap[srvId]; // O(1) lookup
                if (!service) return null;

                const IconComp = ICON_MAP[service.icon] || HelpCircle;

                return (
                  <div key={srvId} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <IconComp className="text-emerald-500 h-5 w-5" /> Spesifikasi {service.title}
                        {(service.id === 'TRANSPORTASI' || service.id === 'VISA' || service.id === 'HOTEL') && (
                          <button
                            type="button"
                            onClick={() => {
                              if (service.id === 'VISA') {
                                setShowVisaPricingModal(true);
                              } else if (service.id === 'HOTEL') {
                                setShowHotelPricingModal(true);
                              } else {
                                setShowPricingModal(true);
                              }
                            }}
                            className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500 text-[10px] hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-900/60 dark:hover:text-yellow-400 transition-colors cursor-pointer font-medium"
                            title="Lihat Referensi Harga"
                          >
                            Cek Estimasi Harga
                          </button>
                        )}
                        {service.id === 'VISA_BUS' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setShowVisaPricingModal(true)}
                              className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500 text-[10px] hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-900/60 dark:hover:text-yellow-400 transition-colors cursor-pointer font-medium"
                              title="Lihat Referensi Harga Visa"
                            >
                              Cek Harga Visa
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowPricingModal(true)}
                              className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500 text-[10px] hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-900/60 dark:hover:text-yellow-400 transition-colors cursor-pointer font-medium"
                              title="Lihat Referensi Harga Transportasi"
                            >
                              Cek Harga Bus
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Registry lookup — O(1) instead of linear if-chain */}
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

          {/* 3. General Data & Manifest */}
          {needsPax && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">3</span>
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
                          if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                            e.preventDefault();
                          }
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

          {/* 3/4. Submit Button */}
          <section className="space-y-6">
            <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {loading ? "Memproses..." : "Buat Penawaran"}
              </Button>
              <p className="text-center text-xs text-slate-400 mt-3">Anda akan diminta mengisi nama, lalu diarahkan ke WhatsApp admin.</p>
            </div>
          </section>

        </form>
      )}

      {/* ── Modal Konfirmasi Kontak ─────────────────────────────────────────── */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowContactModal(false); }}
        >
          <div className="w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Satu Langkah Lagi!</h3>
                <p className="text-sm text-slate-500 mt-0.5">Masukkan data diri untuk mengirim penawaran.</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form kontak */}
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

      {/* Modal Pricing */}
      {showPricingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => {
            if (!isDownloadingPdf) setShowPricingModal(false);
          }}
        >
          <div
            className="bg-white dark:bg-[#111] rounded-2xl w-[90vw] max-w-5xl overflow-hidden shadow-2xl relative flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg">Estimasi Harga Transportasi (Harga dalam SAR)</h3>
              <Button variant="ghost" size="icon" disabled={isDownloadingPdf} onClick={() => setShowPricingModal(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 overflow-auto flex-1 bg-slate-50 dark:bg-slate-900/50" id="pricing-table-container">
              <div className="w-full bg-white dark:bg-[#111] rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-8">
                
                {/* PDF Header - Hidden in UI, visible in PDF */}
                <div className="pdf-logo hidden flex-col border-b border-slate-300 pb-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <img src="/farha-logo-full.svg" alt="Farha Logo" className="h-12 w-auto object-contain object-left mb-3" />
                      <p className="text-emerald-800 font-bold text-[15px] tracking-wide">Platform Land Arrangement Umrah</p>
                    </div>
                    <div className="text-right text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800 text-sm">PT. Farha Inovasi Mandiri</p>
                      <p>Gedung Office 8, SCBD, Jakarta Selatan</p>
                      <p>Telp: +62 811 1234 5678</p>
                      <p>Email: info@farha.id | Web: www.farha.id</p>
                    </div>
                  </div>
                </div>

                {/* Single Trip Table */}
                <div>
                  <h4 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-500">Single Trip</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                      <thead className="text-xs text-white bg-slate-800 uppercase">
                        <tr>
                          <th className="px-4 py-3 border border-slate-700">Rute Perjalanan</th>
                          {TRANSPORT_VEHICLES.map((v: any) => (
                            <th key={v.id} className="px-4 py-3 border border-slate-700 text-center">
                              {v.name}<br />
                              <span className="text-[10px] font-normal">({v.capacity})</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TRANSPORT_PRICES.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="px-4 py-2 border-r border-slate-200 dark:border-slate-800 font-medium">{item.route}</td>
                            {TRANSPORT_VEHICLES.map((v: any, vIdx: number) => (
                              <td key={v.id} className={`px-4 py-2 text-center font-medium text-emerald-600 dark:text-emerald-400 ${vIdx < TRANSPORT_VEHICLES.length - 1 ? 'border-r border-slate-200 dark:border-slate-800' : ''}`}>
                                {item[v.id as keyof typeof item]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Full Trip Table */}
                <div>
                  <h4 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-500">Full Trip ++ (Bus)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                      <thead className="text-xs text-white bg-slate-800 uppercase">
                        <tr>
                          <th className="px-4 py-3 border border-slate-700 w-2/3">Paket Full Trip</th>
                          <th className="px-4 py-3 border border-slate-700 text-center w-1/3">Harga (SAR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FULL_TRIP_PRICES.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="px-4 py-2 border-r border-slate-200 dark:border-slate-800 font-medium">{item.route}</td>
                            <td className="px-4 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400">{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                disabled={isDownloadingPdf}
                onClick={() => handleDownloadPdf('pricing-table-container', 'estimasi-harga-transportasi.pdf')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 min-w-[140px]"
              >
                {isDownloadingPdf ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  "Download PDF"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pricing Visa */}
      {showVisaPricingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowVisaPricingModal(false)}
        >
          <div
            className="bg-white dark:bg-[#111] rounded-2xl w-[90vw] max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg">Estimasi Harga Visa</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowVisaPricingModal(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 overflow-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
              <div className="w-full bg-white dark:bg-[#111] rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-8">
                <div>
                  <div className="text-center py-8">
                    <p className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-4">
                      {VISA_PRICING.estimate}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
                      {VISA_PRICING.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button onClick={() => setShowVisaPricingModal(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white">Tutup</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pricing Hotel */}
      {showHotelPricingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowHotelPricingModal(false)}
        >
          <div
            className="bg-white dark:bg-[#111] rounded-2xl w-[90vw] max-w-5xl overflow-hidden shadow-2xl relative flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg">Estimasi Harga Hotel (Harga dalam SAR)</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowHotelPricingModal(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 overflow-auto flex-1 bg-slate-50 dark:bg-slate-900/50" id="hotel-pricing-table-container">
              <div className="w-full bg-white dark:bg-[#111] rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-8">
                
                {/* PDF Header - Hidden in UI, visible in PDF */}
                <div className="pdf-logo hidden flex-col border-b border-slate-300 pb-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <img src="/farha-logo-full.svg" alt="Farha Logo" className="h-12 w-auto object-contain object-left mb-3" />
                      <p className="text-emerald-800 font-bold text-[15px] tracking-wide">Platform Land Arrangement Umrah</p>
                    </div>
                    <div className="text-right text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800 text-sm">PT. Farha Inovasi Mandiri</p>
                      <p>Gedung Office 8, SCBD, Jakarta Selatan</p>
                      <p>Telp: +62 811 1234 5678</p>
                      <p>Email: info@farha.id | Web: www.farha.id</p>
                    </div>
                  </div>
                </div>

                {/* Makkah Hotels Table */}
                <div>
                  <h4 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-500">Makkah Hotels</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                      <thead className="text-xs text-white bg-slate-800 uppercase">
                        <tr>
                          <th className="px-4 py-3 border border-slate-700 text-center">No</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Periode</th>
                          <th className="px-4 py-3 border border-slate-700">Hotel</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Meals</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Double</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Triple</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Quad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MAKKAH_HOTELS.map((hotel: any, idx: number) => (
                          hotel.periods?.map((period: any, pIdx: number) => (
                            <tr key={`${idx}-${pIdx}`} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                              {pIdx === 0 && (
                                <td rowSpan={hotel.periods.length} className="px-4 py-2 border-r border-slate-200 dark:border-slate-800 font-medium text-center align-top">
                                  {idx + 1}
                                </td>
                              )}
                              <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                                <div className="flex flex-col text-xs whitespace-nowrap">
                                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(period.from)} - {formatDate(period.to)}</span>
                                </div>
                              </td>
                              {pIdx === 0 && (
                                <td rowSpan={hotel.periods.length} className="px-4 py-2 border-r border-slate-200 dark:border-slate-800 font-medium align-top">
                                  {hotel.name} <span className="text-xs text-slate-500">({hotel.stars}★)</span>
                                </td>
                              )}
                              <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">{period.meals || "-"}</td>
                              <td className="px-4 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-800">{period.rates?.double || "-"}</td>
                              <td className="px-4 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-800">{period.rates?.triple || "-"}</td>
                              <td className="px-4 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400">{period.rates?.quad || "-"}</td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Madinah Hotels Table */}
                <div>
                  <h4 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-500">Madinah Hotels</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                      <thead className="text-xs text-white bg-slate-800 uppercase">
                        <tr>
                          <th className="px-4 py-3 border border-slate-700 text-center">No</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Periode</th>
                          <th className="px-4 py-3 border border-slate-700">Hotel</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Meals</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Double</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Triple</th>
                          <th className="px-4 py-3 border border-slate-700 text-center">Quad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MADINAH_HOTELS.map((hotel: any, idx: number) => (
                          hotel.periods?.map((period: any, pIdx: number) => (
                            <tr key={`${idx}-${pIdx}`} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                              {pIdx === 0 && (
                                <td rowSpan={hotel.periods.length} className="px-4 py-2 border-r border-slate-200 dark:border-slate-800 font-medium text-center align-top">
                                  {idx + 1}
                                </td>
                              )}
                              <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                                <div className="flex flex-col text-xs whitespace-nowrap">
                                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(period.from)} - {formatDate(period.to)}</span>
                                </div>
                              </td>
                              {pIdx === 0 && (
                                <td rowSpan={hotel.periods.length} className="px-4 py-2 border-r border-slate-200 dark:border-slate-800 font-medium align-top">
                                  {hotel.name} <span className="text-xs text-slate-500">({hotel.stars}★)</span>
                                </td>
                              )}
                              <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">{period.meals || "-"}</td>
                              <td className="px-4 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-800">{period.rates?.double || "-"}</td>
                              <td className="px-4 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-800">{period.rates?.triple || "-"}</td>
                              <td className="px-4 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400">{period.rates?.quad || "-"}</td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <Button onClick={() => setShowHotelPricingModal(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white">Tutup</Button>
              <Button
                disabled={isDownloadingPdf}
                onClick={() => handleDownloadPdf('hotel-pricing-table-container', 'estimasi-harga-hotel.pdf')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 min-w-[140px]"
              >
                {isDownloadingPdf ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  "Download PDF"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
