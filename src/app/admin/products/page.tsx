"use client";

import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, resetProductsToDefault } from "@/modules/catalog/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2, LayoutTemplate, Plus } from "lucide-react";

// List of all supported modules (Component-Based Form)
const AVAILABLE_MODULES = [
  { type: "HotelSpecsModule", label: "Modul Spesifikasi Hotel" },
  { type: "FlightLogicModule", label: "Modul Tiket Pesawat" },
  { type: "BaggageModule", label: "Modul Ekstra Bagasi" },
  { type: "VisaModule", label: "Modul Pengurusan Visa" },
  { type: "TransAirportModule", label: "Modul Transportasi Bandara" },
  { type: "TransTourModule", label: "Modul Transportasi Tour" },
  { type: "TextInput", label: "Teks Input Generik" },
  { type: "DatePickerNative", label: "Pilih Tanggal (Native)" }
];



export default function ProductsCMS() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({
    id: "", title: "", icon: "Building2", requires_pax: false, form_schema: []
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    // Parse form_schema back to object
    const parsedData = data.map((p: any) => ({
      ...p,
      requires_pax: p.requires_pax === 1,
      form_schema: typeof p.form_schema === "string" ? JSON.parse(p.form_schema) : []
    }));
    setProducts(parsedData);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if ID already exists when creating
    if (!isEditing && products.find(p => p.id === currentProduct.id)) {
      alert("ID Produk sudah ada!");
      return;
    }

    const res = isEditing ? await updateProduct(currentProduct) : await createProduct(currentProduct);
    
    if (res.success) {
      setIsEditing(false);
      setCurrentProduct({ id: "", title: "", icon: "Building2", requires_pax: false, form_schema: [] });
      loadProducts();
    } else {
      alert("Gagal menyimpan: " + res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus produk ini?")) {
      const res = await deleteProduct(id);
      if (res.success) loadProducts();
      else alert("Gagal menghapus: " + res.error);
    }
  };

  const addModule = (moduleType: string) => {
    let newModule: any = { type: moduleType };
    if (moduleType === "TextInput" || moduleType === "DatePickerNative") {
      newModule.name = "field_" + Date.now();
      newModule.label = "Label Baru";
    }
    setCurrentProduct({
      ...currentProduct,
      form_schema: [...currentProduct.form_schema, newModule]
    });
  };

  const removeModule = (index: number) => {
    if (confirm("Yakin ingin menghapus field ini?")) {
      const updated = [...currentProduct.form_schema];
      updated.splice(index, 1);
      setCurrentProduct({ ...currentProduct, form_schema: updated });
    }
  };

  const handleReset = async () => {
    if (confirm("AWAS! Tindakan ini akan MENGHAPUS SEMUA produk yang ada saat ini dan meresetnya kembali ke 6 produk bawaan awal. Apakah Anda yakin?")) {
      setLoading(true);
      const res = await resetProductsToDefault();
      if (res.success) loadProducts();
      else {
        alert("Gagal mereset: " + res.error);
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="p-10">Loading CMS...</div>;

  return (
    <div className="p-6 pt-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manajemen Layanan (CMS)</h1>
        {!isEditing && (
          <div className="flex gap-3">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30" onClick={handleReset}>
              Reset ke Default
            </Button>
            <Button onClick={() => setIsEditing(true)}>+ Tambah Produk Baru</Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mb-10 animate-in fade-in zoom-in-95">
          <h2 className="text-xl font-bold mb-6">{currentProduct.id ? "Edit Produk" : "Produk Baru"}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>ID Produk (Unik, huruf besar)</Label>
                <Input required value={currentProduct.id} disabled={!!currentProduct.id && isEditing} onChange={e => setCurrentProduct({...currentProduct, id: e.target.value.toUpperCase().replace(/\s+/g, '_')})} placeholder="Contoh: HOTEL" />
              </div>
              <div className="space-y-2">
                <Label>Nama Layanan Tampil</Label>
                <Input required value={currentProduct.title} onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})} placeholder="Contoh: Tiket Pesawat" />
              </div>
              <div className="space-y-2">
                <Label>Nama Icon (Lucide)</Label>
                <Input required value={currentProduct.icon} onChange={e => setCurrentProduct({...currentProduct, icon: e.target.value})} placeholder="Building2, Plane, Briefcase" />
              </div>
              <div className="space-y-2 flex items-center gap-3 h-full pt-4">
                <input type="checkbox" className="w-5 h-5 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" id="req_pax" checked={currentProduct.requires_pax} onChange={e => setCurrentProduct({...currentProduct, requires_pax: e.target.checked})} />
                <Label htmlFor="req_pax" className="cursor-pointer font-bold text-base">Wajibkan Input Data Jamaah (PAX)</Label>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><LayoutTemplate className="w-5 h-5"/> Skema Form Dinamis</h3>
              <p className="text-sm text-slate-500 mb-4">Tambahkan modul UI yang akan dirender untuk produk ini. Gunakan modul pintar bawaan untuk mempertahankan desain cantik.</p>
              
              {/* Added Modules */}
              <div className="space-y-3 mb-6">
                {currentProduct.form_schema.map((mod: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-[#1a1a1a] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-emerald-600">{mod.type}</span>
                      {(mod.type === "TextInput" || mod.type === "DatePickerNative") && (
                        <div className="flex gap-4 mt-2">
                          <div>
                            <span className="text-xs text-slate-500 block mb-1">Field Name (JSON key)</span>
                            <input className="border rounded px-2 py-1 w-32 bg-white dark:bg-black dark:border-slate-700" value={mod.name} onChange={e => {
                              const newSchema = [...currentProduct.form_schema];
                              newSchema[i].name = e.target.value;
                              setCurrentProduct({...currentProduct, form_schema: newSchema});
                            }} /> 
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 block mb-1">Label Form</span>
                            <input className="border rounded px-2 py-1 w-48 bg-white dark:bg-black dark:border-slate-700" value={mod.label} onChange={e => {
                              const newSchema = [...currentProduct.form_schema];
                              newSchema[i].label = e.target.value;
                              setCurrentProduct({...currentProduct, form_schema: newSchema});
                            }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <Button variant="destructive" size="sm" type="button" onClick={() => removeModule(i)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                {currentProduct.form_schema.length === 0 && (
                  <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center text-slate-500">
                    Belum ada modul terpasang. Form produk ini akan kosong.
                  </div>
                )}
              </div>

              {/* Module Picker */}
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_MODULES.map(m => (
                  <Button key={m.type} type="button" variant="outline" size="sm" className="border-slate-200 dark:border-slate-700" onClick={() => addModule(m.type)}>
                    <Plus className="w-4 h-4 mr-1" /> {m.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8">Simpan Produk</Button>
              <Button type="button" variant="outline" onClick={() => {
                setIsEditing(false);
                setCurrentProduct({ id: "", title: "", icon: "Building2", requires_pax: false, form_schema: [] });
              }}>Batal</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm flex flex-wrap gap-4 items-center justify-between transition-all hover:border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-3 rounded-lg">
                  <LayoutTemplate className="w-6 h-6" /> 
                </div>
                <div>
                  <h3 className="font-bold text-lg">{p.title} <span className="text-sm font-normal text-slate-500 ml-2">[{p.id}]</span></h3>
                  <div className="text-sm text-slate-500 flex gap-4 mt-1">
                    <span><strong>Icon:</strong> {p.icon}</span>
                    <span><strong>Modul Form:</strong> {p.form_schema.length}</span>
                    <span><strong>Wajib PAX:</strong> {p.requires_pax ? "Ya" : "Tidak"}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700" onClick={() => {
                  setCurrentProduct(p);
                  setIsEditing(true);
                }}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 mr-2" /> Hapus</Button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="text-slate-500 text-center py-10 border-2 border-dashed rounded-xl">Belum ada produk. Silakan tambah baru.</p>}
        </div>
      )}
    </div>
  );
}
