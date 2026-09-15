"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/modules/ordering/actions";
import { Building2, Bus, Ticket, User, Phone, Plane, CheckCircle2, UploadCloud, Users, Check, Briefcase, Car, CalendarDays, MapPin, HelpCircle } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Building2,
  Plane,
  Briefcase,
  Ticket,
  Car,
  Bus,
  HelpCircle,
};

const AIRPORT_OPTIONS = [
  {
    label: "Indonesia",
    options: [
      { value: "CGK", label: "Jakarta (CGK)" },
      { value: "SUB", label: "Surabaya (SUB)" },
      { value: "KNO", label: "Medan (KNO)" },
      { value: "UPG", label: "Makassar (UPG)" },
      { value: "SOC", label: "Solo (SOC)" },
      { value: "YIA", label: "Yogyakarta (YIA)" },
      { value: "BTH", label: "Batam (BTH)" },
      { value: "PDG", label: "Padang (PDG)" },
      { value: "PLM", label: "Palembang (PLM)" },
      { value: "BPN", label: "Balikpapan (BPN)" },
      { value: "BDJ", label: "Banjarmasin (BDJ)" },
      { value: "LOP", label: "Lombok (LOP)" },
      { value: "BTJ", label: "Banda Aceh (BTJ)" },
      { value: "PKU", label: "Pekanbaru (PKU)" },
      { value: "KJT", label: "Kertajati (KJT)" },
    ]
  },
  {
    label: "Arab Saudi",
    options: [
      { value: "JED", label: "Jeddah (JED)" },
      { value: "MED", label: "Madinah (MED)" },
      { value: "RUH", label: "Riyadh (RUH)" },
      { value: "TIF", label: "Taif (TIF)" },
      { value: "DMM", label: "Dammam (DMM)" },
      { value: "ULH", label: "Al-Ula (ULH)" },
    ]
  }
];

function SearchableSelect({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: any[], placeholder: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const filtered = options.flatMap((group: any) => 
    group.options.filter((opt: any) => opt.label.toLowerCase().includes(query.toLowerCase()))
  );

  const selectedOpt = options.flatMap((g: any) => g.options).find((o: any) => o.value === value);

  return (
    <div className="relative">
      <input 
        type="text" 
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10" 
        value={value} 
        onChange={() => {}} 
        required 
        onFocus={() => setIsOpen(true)}
      />
      <div 
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white dark:border-slate-800 dark:bg-slate-950 cursor-pointer focus:ring-2 focus:ring-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOpt ? "text-slate-900 dark:text-slate-100" : "text-slate-500"}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <span className="text-slate-400 text-xs">▼</span>
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1a1a1a] shadow-xl p-2 animate-in fade-in zoom-in-95 duration-100">
            <input 
              type="text" 
              className="w-full rounded-md bg-slate-100 dark:bg-black border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none mb-2 focus:ring-2 focus:ring-emerald-500 transition-shadow" 
              placeholder="Ketik untuk mencari..." 
              autoFocus
              value={query} 
              onChange={e => setQuery(e.target.value)} 
            />
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filtered.map((opt: any) => (
                <div 
                  key={opt.value} 
                  className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${
                    value === opt.value 
                      ? "bg-emerald-500 text-white font-semibold" 
                      : "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  {opt.label}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-slate-500">Tidak ditemukan.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DatePickerNative({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const formatDate = (d: string) => {
    if (!d) return "Pilih Tanggal...";
    const date = new Date(d);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if ("showPicker" in e.currentTarget) {
      (e.currentTarget as HTMLInputElement).showPicker();
    }
  };

  return (
    <div className="relative h-10 w-full group">
      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors pointer-events-none z-10" />
      
      <div className="absolute inset-0 pl-10 pr-3 flex items-center text-sm border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 pointer-events-none group-focus-within:ring-2 group-focus-within:ring-emerald-500">
        <span className={value ? "text-slate-900 dark:text-slate-100 font-medium" : "text-slate-500"}>
          {formatDate(value)}
        </span>
      </div>

      <input 
        type="date" 
        onClick={handleDateClick} 
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        required 
      />
    </div>
  );
}

export function ProductCatalog({ initialProducts = [] }: { initialProducts?: any[] }) {
  const products = initialProducts.map(p => {
    let parsedSchema = [];
    if (typeof p.form_schema === "string") {
      try {
        parsedSchema = JSON.parse(p.form_schema);
      } catch (e) {
        parsedSchema = [];
      }
    } else {
      parsedSchema = p.form_schema || [];
    }
    return {
      ...p,
      requires_pax: p.requires_pax === 1,
      form_schema: parsedSchema
    };
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    pax: "",
    manifestFileName: "",
    notes: "",
  });

  // Dynamic Forms State for specific complex modules
  const [flightData, setFlightData] = useState({ origin: "CGK", destination: "JED", airline: "", departureDate: "", returnDate: "", isRoundTrip: true, isCheapest: false });
  const [hotelData, setHotelData] = useState({ checkInDate: "", checkOutDate: "", rating: "4", roomDetails: "" });
  const [baggageData, setBaggageData] = useState({ weight: "", description: "", flightDate: "" });
  const [visaData, setVisaData] = useState({ type: "Umrah", entryDate: "" });
  const [transAirportData, setTransAirportData] = useState({ vehicle: "", flightDetails: "", pickupDate: "" });
  const [transTourData, setTransTourData] = useState({ vehicle: "", route: "", tourDate: "" });

  // State for generic custom fields
  const [genericData, setGenericData] = useState<Record<string, Record<string, string>>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGenericChange = (serviceId: string, fieldName: string, value: string) => {
    setGenericData(prev => ({
      ...prev,
      [serviceId]: {
        ...(prev[serviceId] || {}),
        [fieldName]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, manifestFileName: e.target.files[0].name });
    }
  };

  const needsPax = selectedServices.some(id => products.find(p => p.id === id)?.requires_pax);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      alert("Silakan pilih minimal 1 layanan.");
      return;
    }

    setLoading(true);
    
    // Attach dynamically typed custom fields for selected services
    const customFields: any = {};
    selectedServices.forEach(id => {
      if (genericData[id]) customFields[id] = genericData[id];
    });

    const specsJson = JSON.stringify({
      services: selectedServices,
      pax: needsPax ? formData.pax : "N/A",
      notes: formData.notes,
      manifest: formData.manifestFileName,
      flight: selectedServices.includes("FLIGHT") ? {
        ...flightData,
        route: `${flightData.origin} - ${flightData.destination} ${flightData.isRoundTrip ? `- ${flightData.origin}` : ''}`
      } : null,
      hotel: selectedServices.includes("HOTEL") ? hotelData : null,
      baggage: selectedServices.includes("BAGGAGE") ? baggageData : null,
      visa: selectedServices.includes("VISA") ? visaData : null,
      transAirport: selectedServices.includes("TRANS_AIRPORT") ? transAirportData : null,
      transTour: selectedServices.includes("TRANS_TOUR") ? transTourData : null,
      customFields
    });

    try {
      const res = await createOrder({
        name: formData.name,
        whatsapp: "Direct WA", 
        pax: needsPax ? formData.pax : "0",
        hotelRating: hotelData.rating || "4",
        notes: specsJson,
      });

      if (res.success) {
        const adminPhone = "6285176861181"; 
        const selectedNames = selectedServices.map(id => products.find(p => p.id === id)?.title).join(", ");
        const text = encodeURIComponent(`Halo Admin, saya order LA Umrah [REF: ${res.orderId}-${res.token}] atas nama ${formData.name}.\nLayanan: ${selectedNames}${needsPax ? `\nPAX: ${formData.pax}` : ""}`);
        window.location.href = `https://wa.me/${adminPhone}?text=${text}`;
      } else {
        alert("Gagal mengirim pesanan: " + res.error);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* 1. Services Selection Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">1</span>
          Pilih Layanan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((srv) => {
            const isSelected = selectedServices.includes(srv.id);
            const IconComp = ICON_MAP[srv.icon] || HelpCircle;
            
            return (
              <div 
                key={srv.id}
                onClick={() => toggleService(srv.id)}
                className={`relative cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected 
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
          {products.length === 0 && (
            <div className="col-span-2 md:col-span-3 p-10 border-2 border-dashed rounded-xl text-center text-slate-500">
              Belum ada layanan tersedia. Hubungi Administrator.
            </div>
          )}
        </div>
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
                const service = products.find(p => p.id === srvId);
                if (!service) return null;
                
                const IconComp = ICON_MAP[service.icon] || HelpCircle;

                return (
                  <div key={srvId} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
                      <IconComp className="text-emerald-500 h-5 w-5" /> Spesifikasi {service.title}
                    </div>
                    
                    {/* Render Modules Dynamically */}
                    <div className="space-y-4">
                      {service.form_schema.map((mod: any, i: number) => {
                        
                        // --- MODULE: HOTEL SPECS ---
                        if (mod.type === "HotelSpecsModule") {
                          return (
                            <div key={i} className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Tanggal Check-In</Label>
                                <DatePickerNative value={hotelData.checkInDate} onChange={val => setHotelData({...hotelData, checkInDate: val})} />
                              </div>
                              <div className="space-y-2">
                                <Label>Tanggal Check-Out</Label>
                                <DatePickerNative value={hotelData.checkOutDate} onChange={val => setHotelData({...hotelData, checkOutDate: val})} />
                              </div>
                              <div className="space-y-2">
                                <Label>Preferensi Bintang</Label>
                                <select 
                                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-emerald-500"
                                  value={hotelData.rating}
                                  onChange={e => setHotelData({...hotelData, rating: e.target.value})}
                                >
                                  <option value="3">Bintang 3 (Ekonomis)</option>
                                  <option value="4">Bintang 4 (Premium)</option>
                                  <option value="5">Bintang 5 (VIP)</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label>Kebutuhan Kamar</Label>
                                <Input placeholder="Contoh: 10 Quad, 2 Double" value={hotelData.roomDetails} onChange={e => setHotelData({...hotelData, roomDetails: e.target.value})} required />
                              </div>
                            </div>
                          );
                        }

                        // --- MODULE: FLIGHT LOGIC ---
                        if (mod.type === "FlightLogicModule") {
                          return (
                            <div key={i} className="space-y-4">
                              <div className="flex flex-col gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id="roundTrip" 
                                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600" 
                                    checked={flightData.isRoundTrip} 
                                    onChange={e => setFlightData({...flightData, isRoundTrip: e.target.checked})}
                                  />
                                  <Label htmlFor="roundTrip" className="cursor-pointer font-semibold text-sm">Penerbangan Pulang Pergi (Round Trip)</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id="cheapestFlight" 
                                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600" 
                                    checked={flightData.isCheapest} 
                                    onChange={e => {
                                      const isChecked = e.target.checked;
                                      setFlightData({...flightData, isCheapest: isChecked, airline: isChecked ? "Termurah / Fleksibel" : ""});
                                    }}
                                  />
                                  <Label htmlFor="cheapestFlight" className="cursor-pointer font-semibold text-sm">Carikan tiket termurah (Fleksibel Maskapai)</Label>
                                </div>
                              </div>
                              
                              <div className="space-y-2 mb-6">
                                <Label className="text-base text-slate-800 dark:text-slate-200">Maskapai Harapan</Label>
                                <Input 
                                  placeholder="Contoh: Saudia / Garuda" 
                                  value={flightData.airline} 
                                  onChange={e => setFlightData({...flightData, airline: e.target.value})} 
                                  required 
                                  disabled={flightData.isCheapest}
                                  className={`h-12 text-lg ${flightData.isCheapest ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900" : "bg-white dark:bg-slate-950"}`}
                                />
                              </div>

                              <div className="p-5 border-2 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl mb-6">
                                <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400 font-bold">
                                  <MapPin className="w-5 h-5" /> Rute Perjalanan
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Bandara Asal (Origin)</Label>
                                    <SearchableSelect 
                                      placeholder="Pilih Bandara Asal..."
                                      options={AIRPORT_OPTIONS} 
                                      value={flightData.origin} 
                                      onChange={(val: string) => setFlightData({...flightData, origin: val})} 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Bandara Tujuan (Destination)</Label>
                                    <SearchableSelect 
                                      placeholder="Pilih Bandara Tujuan..."
                                      options={AIRPORT_OPTIONS} 
                                      value={flightData.destination} 
                                      onChange={(val: string) => setFlightData({...flightData, destination: val})} 
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="p-5 border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl">
                                <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400 font-bold">
                                  <CalendarDays className="w-5 h-5" /> Jadwal Penerbangan
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Tanggal Keberangkatan</Label>
                                    <DatePickerNative value={flightData.departureDate} onChange={val => setFlightData({...flightData, departureDate: val})} />
                                  </div>
                                  {flightData.isRoundTrip && (
                                    <div className="space-y-2">
                                      <Label>Tanggal Kepulangan</Label>
                                      <DatePickerNative value={flightData.returnDate} onChange={val => setFlightData({...flightData, returnDate: val})} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // --- MODULE: BAGGAGE ---
                        if (mod.type === "BaggageModule") {
                          return (
                            <div key={i} className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Total Berat Tambahan (Kg)</Label>
                                <Input type="number" placeholder="Contoh: 100" value={baggageData.weight} onChange={e => setBaggageData({...baggageData, weight: e.target.value})} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Tanggal Penerbangan</Label>
                                <DatePickerNative value={baggageData.flightDate} onChange={val => setBaggageData({...baggageData, flightDate: val})} />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label>Catatan Bagasi</Label>
                                <Input placeholder="Contoh: 10 koper air zamzam" value={baggageData.description} onChange={e => setBaggageData({...baggageData, description: e.target.value})} />
                              </div>
                            </div>
                          );
                        }

                        // --- MODULE: VISA ---
                        if (mod.type === "VisaModule") {
                          return (
                            <div key={i} className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Jenis Visa</Label>
                                <select 
                                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-emerald-500"
                                  value={visaData.type}
                                  onChange={e => setVisaData({...visaData, type: e.target.value})}
                                >
                                  <option value="Umrah">Visa Umrah</option>
                                  <option value="Turis">Visa Turis</option>
                                  <option value="Ziarah">Visa Ziarah</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label>Rencana Tanggal Masuk (Entry)</Label>
                                <DatePickerNative value={visaData.entryDate} onChange={val => setVisaData({...visaData, entryDate: val})} />
                              </div>
                            </div>
                          );
                        }

                        // --- MODULE: TRANS AIRPORT ---
                        if (mod.type === "TransAirportModule") {
                          return (
                            <div key={i} className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Armada (Hiace / Bus / Sedan)</Label>
                                <Input placeholder="Contoh: Toyota Hiace" value={transAirportData.vehicle} onChange={e => setTransAirportData({...transAirportData, vehicle: e.target.value})} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Tanggal Penjemputan</Label>
                                <DatePickerNative value={transAirportData.pickupDate} onChange={val => setTransAirportData({...transAirportData, pickupDate: val})} />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label>Detail Penerbangan</Label>
                                <Input placeholder="Contoh: SV 818 ETA 14:00 JED" value={transAirportData.flightDetails} onChange={e => setTransAirportData({...transAirportData, flightDetails: e.target.value})} required />
                              </div>
                            </div>
                          );
                        }

                        // --- MODULE: TRANS TOUR ---
                        if (mod.type === "TransTourModule") {
                          return (
                            <div key={i} className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Kebutuhan Armada</Label>
                                <Input placeholder="Contoh: 1 Bus VIP 45 Seat" value={transTourData.vehicle} onChange={e => setTransTourData({...transTourData, vehicle: e.target.value})} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Tanggal Tour</Label>
                                <DatePickerNative value={transTourData.tourDate} onChange={val => setTransTourData({...transTourData, tourDate: val})} />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <Label>Rute Ziarah</Label>
                                <Input placeholder="Contoh: Makkah - Madinah - Thaif" value={transTourData.route} onChange={e => setTransTourData({...transTourData, route: e.target.value})} required />
                              </div>
                            </div>
                          );
                        }

                        // --- GENERIC MODULES ---
                        if (mod.type === "TextInput") {
                          return (
                            <div key={i} className="space-y-2">
                              <Label>{mod.label}</Label>
                              <Input 
                                placeholder="Ketik jawaban..."
                                value={genericData[srvId]?.[mod.name] || ""} 
                                onChange={e => handleGenericChange(srvId, mod.name, e.target.value)} 
                                required 
                              />
                            </div>
                          );
                        }

                        if (mod.type === "DatePickerNative") {
                          return (
                            <div key={i} className="space-y-2">
                              <Label>{mod.label}</Label>
                              <DatePickerNative 
                                value={genericData[srvId]?.[mod.name] || ""} 
                                onChange={val => handleGenericChange(srvId, mod.name, val)} 
                              />
                            </div>
                          );
                        }

                        return null;
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
                      <Input type="number" required={needsPax} placeholder="Contoh: 45" className="pl-10 h-10" value={formData.pax} onChange={e => setFormData({...formData, pax: e.target.value})} />
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
                  <Textarea placeholder="Tulis instruksi khusus di sini..." className="min-h-[100px]" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>

              </div>
            </section>
          )}

          {/* 4. Contact & Submit */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-sm">{needsPax ? "4" : "3"}</span>
              Kirim Permintaan
            </h2>
            <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="space-y-2">
                <Label>Nama Pemesan</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input required placeholder="Masukkan nama Anda" className="pl-10 h-10 w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg mt-4"
              >
                {loading ? "Memproses..." : "Kirim & Lanjut ke WA Admin"}
              </Button>
            </div>
          </section>

        </form>
      )}
    </div>
  );
}
