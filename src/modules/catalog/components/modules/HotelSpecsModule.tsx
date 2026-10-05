import React from "react";
import { Check } from "lucide-react";
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

export function HotelSpecsModuleComponent({ srvId, mod, i, moduleSpecs, updateModuleSpec, genericData, updateGenericData, tripType }: CatalogModuleProps & { tripType: string }) {
      const specs = moduleSpecs[srvId] || {};

      const renderLocationFields = (loc: "Mekah" | "Madinah") => {
        const isMekah = loc === "Mekah";
        const prefix = isMekah ? "mekah" : "madinah";
        const isChecked = mod?.locationOnly === loc ? true : specs[isMekah ? "needsMekah" : "needsMadinah"];

        if (!isChecked) return null;

        const availableHotels = HOTEL_OPTIONS.filter(h => h.location === loc);

        let nightCount: number | null = null;
        if (specs[`${prefix}CheckIn`] && specs[`${prefix}CheckOut`]) {
          const inDate = new Date(specs[`${prefix}CheckIn`]);
          const outDate = new Date(specs[`${prefix}CheckOut`]);
          if (!isNaN(inDate.getTime()) && !isNaN(outDate.getTime())) {
            const diffTime = outDate.getTime() - inDate.getTime();
            nightCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
        }

        const cardBorder = isMekah 
          ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10" 
          : "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10";

        return (
          <div className={`mt-4 p-4 rounded-xl border-2 space-y-4 ${cardBorder}`}>
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Detail Hotel {loc}</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Nama Hotel</Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-emerald-500"
                  value={specs[`${prefix}HotelName`] || ""}
                  onChange={e => updateModuleSpec(srvId, `${prefix}HotelName`, e.target.value)}
                >
                  <option value="" disabled>Pilih Hotel di {loc}...</option>
                  {availableHotels.map(h => (
                    <option key={h.name} value={h.name}>
                      {h.name} {h.star ? `(${h.star})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Tanggal Check-In</Label>
                <DatePickerNative value={specs[`${prefix}CheckIn`]} onChange={val => updateModuleSpec(srvId, `${prefix}CheckIn`, val)} />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Check-Out</Label>
                <DatePickerNative value={specs[`${prefix}CheckOut`]} onChange={val => updateModuleSpec(srvId, `${prefix}CheckOut`, val)} />
              </div>
              {nightCount !== null && (
                <div className={`md:col-span-2 text-sm font-medium ${nightCount <= 0 ? 'text-red-500' : 'text-slate-500'}`}>
                  * Lama menginap: {nightCount} malam {nightCount <= 0 && "(Tanggal tidak valid)"}
                </div>
              )}
              <div className="space-y-3 md:col-span-2">
                <Label>Jumlah Kamar (Isi sesuai kebutuhan)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Double', 'Triple', 'Quad', 'Quint'].map(room => {
                    const roomsData = specs[`${prefix}Rooms`] || { Double: 0, Triple: 0, Quad: 0, Quint: 0 };
                    return (
                      <div key={room} className="flex flex-col space-y-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                        <span className="text-xs font-semibold text-slate-500 text-center">{room}</span>
                        <input 
                          type="number" 
                          min="0"
                          className="w-full text-center bg-transparent focus:outline-none font-bold text-slate-700 dark:text-slate-300"
                          value={roomsData[room] || 0}
                          onChange={e => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            updateModuleSpec(srvId, `${prefix}Rooms`, { ...roomsData, [room]: val });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      };

      
      return (
        <div key={i} className="space-y-4">
          {!mod?.locationOnly && (
            <div className="flex flex-wrap gap-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-6 h-6 rounded border-2 border-slate-300 dark:border-slate-600 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                    checked={specs.needsMekah}
                    onChange={e => updateModuleSpec(srvId, 'needsMekah', e.target.checked)}
                  />
                  <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">Hotel Mekah</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-6 h-6 rounded border-2 border-slate-300 dark:border-slate-600 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                    checked={specs.needsMadinah}
                    onChange={e => updateModuleSpec(srvId, 'needsMadinah', e.target.checked)}
                  />
                  <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">Hotel Madinah</span>
              </label>
            </div>
          )}

          {(!mod?.locationOnly || mod.locationOnly === "Mekah") && renderLocationFields("Mekah")}
          {(!mod?.locationOnly || mod.locationOnly === "Madinah") && renderLocationFields("Madinah")}

          {!mod?.locationOnly && !specs.needsMekah && !specs.needsMadinah && (

            <div className="p-4 text-center text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/30">
              Silakan pilih setidaknya satu lokasi hotel (Mekah atau Madinah).
            </div>
          )}
          
        </div>
      );
    }
