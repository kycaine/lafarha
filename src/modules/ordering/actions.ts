import { fetchApi } from "@/lib/api";

export async function createOrder(formData: any) {
  try {
    return await fetchApi('/orders', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderQuote(orderId: string, quoteData: any) {
  try {
    return await fetchApi(`/orders/${orderId}/quote`, {
      method: 'PUT',
      body: JSON.stringify(quoteData)
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getOrders() {
  try {
    const res = await fetchApi('/orders');
    return res.data || [];
  } catch (error) {
    return [];
  }
}

export async function getOrderById(id: string) {
  try {
    const res = await fetchApi(`/orders/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
}

