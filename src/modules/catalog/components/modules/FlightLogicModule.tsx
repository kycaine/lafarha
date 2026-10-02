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
      return (
        <div key={i} className="space-y-4">
          <div className="flex flex-col gap-3 mb-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="roundTrip"
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                checked={specs.isRoundTrip}
                onChange={e => updateModuleSpec(srvId, 'isRoundTrip', e.target.checked)}
              />
              <Label htmlFor="roundTrip" className="cursor-pointer font-semibold text-sm">Penerbangan Pulang Pergi (Round Trip)</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cheapestFlight"
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
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
              <Label htmlFor="cheapestFlight" className="cursor-pointer font-semibold text-sm">Carikan tiket termurah (Fleksibel Maskapai)</Label>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label className="text-base text-slate-800 dark:text-slate-200">Maskapai Harapan</Label>
            <Input
              placeholder="Contoh: Saudia / Garuda"
              value={specs.airline}
              onChange={e => updateModuleSpec(srvId, 'airline', e.target.value)}
              required
              disabled={specs.isCheapest}
              className={`h-12 text-lg ${specs.isCheapest ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900" : "bg-white dark:bg-slate-950"}`}
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
          </div>

          <div className="p-5 border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400 font-bold">
              <CalendarDays className="w-5 h-5" /> Jadwal Penerbangan
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Keberangkatan</Label>
                <DatePickerNative value={specs.departureDate} onChange={val => updateModuleSpec(srvId, 'departureDate', val)} />
              </div>
              {specs.isRoundTrip && (
                <div className="space-y-2">
                  <Label>Tanggal Kepulangan</Label>
                  <DatePickerNative value={specs.returnDate} onChange={val => updateModuleSpec(srvId, 'returnDate', val)} />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
