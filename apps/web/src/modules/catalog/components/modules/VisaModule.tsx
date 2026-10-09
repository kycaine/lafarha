import React from "react";
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

export function VisaModuleComponent({ srvId, mod, i, moduleSpecs, updateModuleSpec, genericData, updateGenericData, tripType }: CatalogModuleProps & { tripType: string }) {
      const specs = moduleSpecs[srvId] || {};
      return (
        <div key={i} className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Jenis Visa</Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-emerald-500"
              value={specs.type}
              onChange={e => updateModuleSpec(srvId, 'type', e.target.value)}
            >
              {VISA_TYPES.map((type: string) => (
                <option key={type} value={type}>Visa {type}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Kategori Pengajuan</Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-emerald-500"
              value={specs.groupType || "Perorangan"}
              onChange={e => updateModuleSpec(srvId, 'groupType', e.target.value)}
            >
              {VISA_CATEGORIES.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Tanggal Masuk (Entry)</Label>
            <DatePickerNative value={specs.entryDate} onChange={val => updateModuleSpec(srvId, 'entryDate', val)} />
          </div>
          <div className="space-y-2">
            <Label>Tanggal Keluar (Exit)</Label>
            <DatePickerNative value={specs.exitDate || ""} onChange={val => updateModuleSpec(srvId, 'exitDate', val)} />
          </div>
        </div>
      );
    }
