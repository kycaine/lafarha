import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SearchableSelect, DatePickerNative, CatalogModuleProps } from "../UtilsCatalog";

// Data imports
import hotelData from "@/data/data-product/hotel.json";
import transportData from "@/data/data-product/transport.json";
import airportData from "@/data/data-product/airport.json";
import visaData from "@/data/data-product/visa.json";

const { hotelOptions: HOTEL_OPTIONS } = hotelData;
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

export function BaggageModuleComponent({ srvId, mod, i, moduleSpecs, updateModuleSpec, genericData, updateGenericData, tripType }: CatalogModuleProps & { tripType: string }) {
      const specs = moduleSpecs[srvId] || {};
      return (
        <div key={i} className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Berat Tambahan (Kg)</Label>
            <Input type="number" placeholder="Contoh: 100" value={specs.weight} onChange={e => updateModuleSpec(srvId, 'weight', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Tanggal Penerbangan</Label>
            <DatePickerNative value={specs.flightDate} onChange={val => updateModuleSpec(srvId, 'flightDate', val)} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Catatan Bagasi</Label>
            <Input placeholder="Contoh: 10 koper air zamzam" value={specs.description} onChange={e => updateModuleSpec(srvId, 'description', e.target.value)} />
          </div>
        </div>
      );
    }
