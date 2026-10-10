import catalogData from "@/contents/products/catalog.json";

// Mengambil produk langsung dari file JSON statis lokal (0 API Hit)
export async function getProducts() {
  return catalogData.products || [];
}

// Karena produk disepakati disimpan murni di local (bukan DB), 
// operasi mutasi (tambah, edit, hapus) via Dashboard dimatikan.
// Penambahan produk harus via kode / file JSON (menggunakan prompt /add-product)
export async function createProduct(_data: any) {
  return { success: false, error: "Penambahan produk dikunci. Silakan gunakan command /add-product di kodingan." };
}

export async function updateProduct(_data: any) {
  return { success: false, error: "Edit produk dikunci. Silakan ubah file src/data/products/catalog.json" };
}

export async function deleteProduct(_id: string) {
  return { success: false, error: "Hapus produk dikunci. Silakan ubah file src/data/products/catalog.json" };
}

export async function resetProductsToDefault() {
  return { success: true };
}
