// Configuration for the API Worker Backend
// Remove direct URL, point everything to local proxy
export const API_URL = "/api/proxy";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${API_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    
    // Attempt to parse JSON response
    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error("fetchApi error:", res.status, data);
      return { success: false, error: data.error || `Error ${res.status}` };
    }
    
    return data;
  } catch (error: any) {
    console.error("fetchApi catch error:", error);
    return { success: false, error: error.message };
  }
}
