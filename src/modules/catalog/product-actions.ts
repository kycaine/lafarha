import { fetchApi } from "@/lib/api";

export async function getProducts() {
  return [
    { id: 'HOTEL', title: 'Hotel', icon: 'Building2', requires_pax: 1, form_schema: '[{"type":"HotelSpecsModule"}]' },
    { id: 'FLIGHT', title: 'Tiket Pesawat', icon: 'Plane', requires_pax: 1, form_schema: '[{"type":"FlightLogicModule"}]' },
    { id: 'BAGGAGE', title: 'Bagasi', icon: 'Briefcase', requires_pax: 0, form_schema: '[{"type":"BaggageModule"}]' },
    { id: 'VISA', title: 'Visa', icon: 'Ticket', requires_pax: 1, form_schema: '[{"type":"VisaModule"}]' },
    { id: 'TRANS_AIRPORT', title: 'Transportasi Bandara', icon: 'Car', requires_pax: 1, form_schema: '[{"type":"TransAirportModule"}]' },
    { id: 'TRANS_TOUR', title: 'Transportasi Tour', icon: 'Bus', requires_pax: 1, form_schema: '[{"type":"TransTourModule"}]' }
  ];
}

export async function createProduct(data: any) {
  try {
    return await fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(data: any) {
  try {
    return await fetchApi(`/products/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    return await fetchApi(`/products/${id}`, {
      method: 'DELETE'
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetProductsToDefault() {
  return { success: true };
}
