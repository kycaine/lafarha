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

export function TransportModuleComponent({ srvId, mod, i, moduleSpecs, updateModuleSpec, genericData, updateGenericData, tripType }: CatalogModuleProps & { tripType: string }) {
      const specs = moduleSpecs[srvId] || {};
      const currentTripType = specs.tripType || 'single';
      const isFullTrip = currentTripType === 'full';

      return (
        <div key={i} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-3 mb-2">
            <Label>Tipe Perjalanan</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label
                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${currentTripType === 'single'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-200 dark:hover:border-emerald-800'
                  }`}
              >
                <input
                  type="radio"
                  name={`tripType-${srvId}`}
                  value="single"
                  checked={currentTripType === 'single'}
                  onChange={() => {
                    updateModuleSpec(srvId, 'tripType', 'single');
                    updateModuleSpec(srvId, 'route', '');
                  }}
                  className="sr-only"
                />
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${currentTripType === 'single' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    Single Trip
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${currentTripType === 'single' ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                    {currentTripType === 'single' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                </div>
                <span className="text-xs text-slate-500 mt-1">Satu rute perjalanan spesifik</span>
              </label>

              <label
                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${currentTripType === 'full'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-200 dark:hover:border-emerald-800'
                  }`}
              >
                <input
                  type="radio"
                  name={`tripType-${srvId}`}
                  value="full"
                  checked={currentTripType === 'full'}
                  onChange={() => {
                    updateModuleSpec(srvId, 'tripType', 'full');
                    updateModuleSpec(srvId, 'route', 'Jeddah - Makkah - City Tour Makkah - Madinah - City Tour Madinah');
                  }}
                  className="sr-only"
                />
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${currentTripType === 'full' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    Full Trip
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${currentTripType === 'full' ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                    {currentTripType === 'full' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                </div>
                <span className="text-xs text-slate-500 mt-1">Paket 5 trip standar (Jeddah, Makkah, Madinah)</span>
              </label>

              <label
                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${currentTripType === 'full_plus'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-200 dark:hover:border-emerald-800'
                  }`}
              >
                <input
                  type="radio"
                  name={`tripType-${srvId}`}
                  value="full_plus"
                  checked={currentTripType === 'full_plus'}
                  onChange={() => {
                    updateModuleSpec(srvId, 'tripType', 'full_plus');
                    updateModuleSpec(srvId, 'route', 'Full Trip + Al Ula'); // Default combination
                  }}
                  className="sr-only"
                />
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${currentTripType === 'full_plus' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    Full Trip ++
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${currentTripType === 'full_plus' ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                    {currentTripType === 'full_plus' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                </div>
                <span className="text-xs text-slate-500 mt-1">Full trip dengan tambahan rute kombinasi khusus</span>
              </label>
            </div>

            {currentTripType === 'full' && (
              <div className="mt-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                <Label className="mb-3 block text-emerald-800 dark:text-emerald-300">Pilih Rute Full Trip</Label>
                <div className="grid grid-cols-1 gap-3">
                  {FULL_TRIP_ROUTES.map((opt: any) => (
                    <label key={opt.value} className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${specs.route === opt.value ? 'border-emerald-500 bg-white dark:bg-emerald-950/20 shadow-sm' : 'border-slate-200 bg-white/50 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/50'}`}>
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${specs.route === opt.value ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'}`}>
                          {specs.route === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <input
                        type="radio"
                        name={`combo-${srvId}`}
                        value={opt.value}
                        checked={specs.route === opt.value}
                        onChange={() => updateModuleSpec(srvId, 'route', opt.value)}
                        className="sr-only"
                      />
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${specs.route === opt.value ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {opt.title}
                        </span>
                        <span className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {opt.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentTripType === 'full_plus' && (
              <div className="mt-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                <Label className="mb-3 block text-emerald-800 dark:text-emerald-300">Pilih Kombinasi Rute</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FULL_PLUS_ROUTES.map((opt: any) => (
                    <label key={opt.value} className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${specs.route === opt.value ? 'border-emerald-500 bg-white dark:bg-emerald-950/20 shadow-sm' : 'border-slate-200 bg-white/50 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/50'}`}>
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${specs.route === opt.value ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'}`}>
                          {specs.route === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <input
                        type="radio"
                        name={`combo-${srvId}`}
                        value={opt.value}
                        checked={specs.route === opt.value}
                        onChange={() => updateModuleSpec(srvId, 'route', opt.value)}
                        className="sr-only"
                      />
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${specs.route === opt.value ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {opt.title}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {opt.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Jenis Transportasi</Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-emerald-500"
              value={specs.vehicle || ""}
              onChange={e => updateModuleSpec(srvId, 'vehicle', e.target.value)}
              required
            >
              <option value="" disabled>Pilih Kendaraan</option>
              {TRANSPORT_VEHICLES.map((v: any) => (
                <option key={v.id} value={`${v.name} (${v.capacity})`}>
                  {v.name} ({v.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Jumlah Kendaraan</Label>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="Contoh: 1"
              value={specs.vehicleCount || ""}
              onChange={e => updateModuleSpec(srvId, 'vehicleCount', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                  e.preventDefault();
                }
              }}
              required
            />
          </div>

          {currentTripType === 'single' && (
            <div className="space-y-2">
              <Label>Rute Perjalanan</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus:ring-emerald-500"
                value={specs.route || ""}
                onChange={e => updateModuleSpec(srvId, 'route', e.target.value)}
                required={currentTripType === 'single'}
              >
                <option value="" disabled>Pilih Rute</option>
                {TRANSPORT_PRICES.map((p: any) => (
                  <option key={p.route} value={p.route}>{p.route}</option>
                ))}
              </select>
            </div>
          )}

          <div className={`space-y-2 ${tripType !== 'single' ? 'md:col-span-2' : ''}`}>
            <Label>Tanggal Keberangkatan / Penggunaan</Label>
            <DatePickerNative value={specs.date || ""} onChange={val => updateModuleSpec(srvId, 'date', val)} />
          </div>
        </div>
      );
    }
