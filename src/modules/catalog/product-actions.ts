import fs from "fs";
import path from "path";

// Note: This assumes we are running in an environment where the local file system is writable.
const DATA_FILE = path.join(process.cwd(), "src/data/data-product/catalog.json");

function getProductData() {
  try {
    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Failed to read product data:", error);
    return { products: [] };
  }
}

function saveProductData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Failed to write product data:", error);
    return false;
  }
}

export async function getDefaultProducts() {
  const data = getProductData();
  return data.products || [];
}

export async function getProducts() {
  const data = getProductData();
  return data.products || [];
}

export async function createProduct(product: any) {
  const data = getProductData();
  const newProduct = { ...product, id: product.id || `PROD_${Date.now()}` };
  data.products = data.products || [];
  data.products.push(newProduct);
  
  if (saveProductData(data)) {
    return { success: true, product: newProduct };
  }
  return { success: false, error: "Gagal menyimpan data ke file lokal" };
}

export async function updateProduct(product: any) {
  const data = getProductData();
  data.products = data.products || [];
  
  const idx = data.products.findIndex((p: any) => p.id === product.id);
  if (idx !== -1) {
    data.products[idx] = { ...data.products[idx], ...product };
    if (saveProductData(data)) {
      return { success: true, product: data.products[idx] };
    }
    return { success: false, error: "Gagal menyimpan data ke file lokal" };
  }
  return { success: false, error: "Produk tidak ditemukan" };
}

export async function deleteProduct(id: string) {
  const data = getProductData();
  data.products = data.products || [];
  
  const initialLength = data.products.length;
  data.products = data.products.filter((p: any) => p.id !== id);
  
  if (data.products.length < initialLength) {
    if (saveProductData(data)) {
      return { success: true };
    }
    return { success: false, error: "Gagal menyimpan data ke file lokal" };
  }
  return { success: false, error: "Produk tidak ditemukan" };
}

export async function resetProductsToDefault() {
  // Normally this would wipe the DB, but since we are using local file,
  // we might want to just reset the products array to the initial defaults.
  // For now, we can just return success without modifying the other data.
  return { success: true };
}
