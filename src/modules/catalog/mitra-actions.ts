import { fetchApi, API_URL } from "@/lib/api";

export async function getMitra() {
  try {
    const res = await fetchApi('/mitra');
    if (!res.success) {
      console.error("[getMitra] API mitra gagal:", res.error);
      return [];
    }
    // Worker mengembalikan foto sebagai path (/mitra/:id/foto?v=..); arahkan lewat proxy.
    return (res.data as any[]).map((m) => ({
      ...m,
      foto: typeof m.foto === "string" && m.foto.startsWith("/mitra/") ? `${API_URL}${m.foto}` : m.foto,
    }));
  } catch (error: any) {
    console.error("Failed to fetch mitra:", error);
    return [];
  }
}

export async function createMitra(data: any) {
  try {
    return await fetchApi('/mitra', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateMitra(data: any) {
  try {
    return await fetchApi(`/mitra/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMitra(id: string) {
  try {
    return await fetchApi(`/mitra/${id}`, {
      method: 'DELETE'
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
