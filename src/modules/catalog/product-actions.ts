import { fetchApi } from "@/lib/api";

export async function getProducts() {
  try {
    const res = await fetchApi('/products');
    return res.data || [];
  } catch (error) {
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
    return await fetchApi('/products/reset', {
      method: 'POST'
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
