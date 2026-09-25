import { fetchApi } from "@/lib/api";

export async function createTransaction(formData: any) {
  try {
    return await fetchApi('/transactions', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTransactions() {
  try {
    const res = await fetchApi('/transactions');
    return res.data || [];
  } catch {
    return [];
  }
}

export async function getTransactionById(id: string) {
  try {
    const res = await fetchApi(`/transactions/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function updateTransactionContact(id: string, whatsapp: string) {
  try {
    return await fetchApi(`/transactions/${id}/contact`, {
      method: 'PATCH',
      body: JSON.stringify({ whatsapp })
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTransactionQuote(id: string, quoteData: {
  totalAmount: number;
  validityHours?: number;
  items: Record<number, string>;
}) {
  try {
    return await fetchApi(`/transactions/${id}/quote`, {
      method: 'PUT',
      body: JSON.stringify(quoteData)
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTransactionStatus(id: string, status: 'PENDING' | 'QUOTED' | 'CLOSED' | 'CANCELLED') {
  try {
    return await fetchApi(`/transactions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
