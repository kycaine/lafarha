import { fetchApi } from "@/lib/api";

/** Returns the hardcoded default product list.
 *  Call this when you want to seed / fall back to the 6 built-in services
 *  without hitting the API. Rename intentional — not an API fetch. */
export async function getDefaultProducts() {
  return [
    { id: 'HOTEL', title: 'Hotel', icon: 'Building2', requires_pax: 1, form_schema: '[{"type":"HotelSpecsModule"}]' },
    { id: 'FLIGHT', title: 'Tiket Pesawat', icon: 'Plane', requires_pax: 1, form_schema: '[{"type":"FlightLogicModule"}]' },
    { id: 'BAGGAGE', title: 'Bagasi', icon: 'Briefcase', requires_pax: 0, form_schema: '[{"type":"BaggageModule"}]' },
    { id: 'VISA', title: 'Visa', icon: 'Ticket', requires_pax: 1, form_schema: '[{"type":"VisaModule"}]' },
    { id: 'TRANS_AIRPORT', title: 'Transportasi Bandara', icon: 'Car', requires_pax: 1, form_schema: '[{"type":"TransAirportModule"}]' },
    { id: 'TRANS_TOUR', title: 'Transportasi Tour', icon: 'Bus', requires_pax: 1, form_schema: '[{"type":"TransTourModule"}]' }
  ];
}

export async function getProducts() {
  try {
    const res = await fetchApi('/products');
    return res.success ? res.data : [];
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return [];
  }
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
  try {
    // Single source of truth: use getDefaultProducts() as the payload.
    // The API worker will wipe the DB and re-insert exactly these products,
    // so frontend hardcode and DB are always guaranteed to match.
    const defaults = await getDefaultProducts();
    return await fetchApi('/products/reset', {
      method: 'POST',
      body: JSON.stringify({ products: defaults }),
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
