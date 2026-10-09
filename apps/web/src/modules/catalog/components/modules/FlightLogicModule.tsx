import React from "react";
import { MapPin, CalendarDays } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SearchableSelect, DatePickerNative, CatalogModuleProps } from "../UtilsCatalog";

// Data imports
import hotelData from "@/contents/products/hotel.json";
import transportData from "@/contents/products/transport.json";
import airportData from "@/contents/products/airport.json";
import visaData from "@/contents/products/visa.json";
import flightIntrData from "@/contents/products/flight_intr.json";

const HOTEL_OPTIONS = [
  ...(hotelData.makkah_hotels || []).map(h => ({ location: "Mekah", name: h.name, star: h.stars })),
  ...(hotelData.madinah_hotels || []).map(h => ({ location: "Madinah", name: h.name, star: h.stars }))
];
const { airportOptions: AIRPORT_OPTIONS } = airportData;
const {
  transportPrices: TRANSPORT_PRICES,
  transportVehicles: TRANSPORT_VEHICLES,
  fullTripRoutes: FULL_TRIP_ROUTES,
  fullPlusRoutes: FULL_PLUS_ROUTES
} = transportData;
const {
  visaTypes: VISA_TYPES,
  visaCategories: VISA_CATEGORIES
} = visaData;

export function FlightLogicModuleComponent({ srvId, mod, i, moduleSpecs, updateModuleSpec, genericData, updateGenericData, tripType }: CatalogModuleProps & { tripType: string }) {
      const specs = moduleSpecs[srvId] || {};
      const isIntl = srvId === 'FLIGHT_INTL';
      const flightType = specs.flightType || 'direct';
      
      return (
        <div key={i} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <label className={`relative flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${specs.isRoundTrip ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] hover:border-slate-300 dark:hover:border-slate-700'}`}>
              <div className="flex items-center h-full pt-0.5">
                <input
                  type="checkbox"
                  className="w-6 h-6 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600 transition-all"
                  checked={specs.isRoundTrip}
                  onChange={e => updateModuleSpec(srvId, 'isRoundTrip', e.target.checked)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-base">Pulang Pergi (Round Trip)</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Tambahkan rute dan jadwal kepulangan</span>
              </div>
            </label>

            <label className={`relative flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${specs.isCheapest ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] hover:border-slate-300 dark:hover:border-slate-700'}`}>
              <div className="flex items-center h-full pt-0.5">
                <input
                  type="checkbox"
                  className="w-6 h-6 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600 transition-all"
                  checked={specs.isCheapest}
                  onChange={e => {
                    const isChecked = e.target.checked;
                    updateModuleSpec(srvId, 'isCheapest', isChecked);
                    if (isChecked) {
                      updateModuleSpec(srvId, 'airline', "Termurah / Fleksibel");
                    } else {
                      updateModuleSpec(srvId, 'airline', "");
                    }
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-base">Tiket Termurah</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Pilih maskapai paling fleksibel & hemat</span>
              </div>
            </label>
          </div>

          {isIntl && !specs.isCheapest && (
            <div className="space-y-2 mb-4">
              <Label className="text-base text-slate-800 dark:text-slate-200">Tipe Penerbangan (Internasional)</Label>
              <select
                className="w-full h-12 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                value={flightType}
                onChange={e => {
                  updateModuleSpec(srvId, 'flightType', e.target.value);
                  updateModuleSpec(srvId, 'airline', '');
                }}
              >
                <option value="direct">Direct (Langsung)</option>
                <option value="transit">Transit</option>
              </select>
            </div>
          )}

          <div className="space-y-2 mb-6">
            <Label className="text-base text-slate-800 dark:text-slate-200">Maskapai Harapan</Label>
            {isIntl && !specs.isCheapest ? (
              <select
                className="w-full h-12 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                value={specs.airline}
                onChange={e => updateModuleSpec(srvId, 'airline', e.target.value)}
                required
              >
                <option value="">-- Pilih Maskapai --</option>
                {(flightType === 'transit' ? flightIntrData.transit : flightIntrData.direct).map((airline: string) => (
                  <option key={airline} value={airline}>{airline}</option>
                ))}
              </select>
            ) : (
              <Input
                placeholder="Contoh: Saudia / Garuda"
                value={specs.airline}
                onChange={e => updateModuleSpec(srvId, 'airline', e.target.value)}
                required
                disabled={specs.isCheapest}
                className={`h-12 text-lg ${specs.isCheapest ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900" : "bg-white dark:bg-slate-950"}`}
              />
            )}
          </div>

          <div className="p-5 border-2 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl mb-6">
            <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400 font-bold">
              <MapPin className="w-5 h-5" /> Data Keberangkatan (Pergi)
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Bandara Asal (Origin)</Label>
                <SearchableSelect
                  placeholder="Pilih Bandara Asal..."
                  options={AIRPORT_OPTIONS}
                  value={specs.origin}
                  onChange={(val: string) => updateModuleSpec(srvId, 'origin', val)}
                />
              </div>
              <div className="space-y-2">
                <Label>Bandara Tujuan (Destination)</Label>
                <SearchableSelect
                  placeholder="Pilih Bandara Tujuan..."
                  options={AIRPORT_OPTIONS}
                  value={specs.destination}
                  onChange={(val: string) => updateModuleSpec(srvId, 'destination', val)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Keberangkatan</Label>
                <DatePickerNative value={specs.departureDate} onChange={val => updateModuleSpec(srvId, 'departureDate', val)} />
              </div>
            </div>
          </div>

          {specs.isRoundTrip && (
            <div className="p-5 border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400 font-bold">
                <MapPin className="w-5 h-5" /> Data Kepulangan (Pulang)
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Bandara Asal Pulang (Origin)</Label>
                  <SearchableSelect
                    placeholder="Pilih Bandara Asal..."
                    options={AIRPORT_OPTIONS}
                    value={specs.returnOrigin || ''}
                    onChange={(val: string) => updateModuleSpec(srvId, 'returnOrigin', val)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bandara Tujuan Pulang (Destination)</Label>
                  <SearchableSelect
                    placeholder="Pilih Bandara Tujuan..."
                    options={AIRPORT_OPTIONS}
                    value={specs.returnDestination || ''}
                    onChange={(val: string) => updateModuleSpec(srvId, 'returnDestination', val)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Kepulangan</Label>
                  <DatePickerNative value={specs.returnDate} onChange={val => updateModuleSpec(srvId, 'returnDate', val)} />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
