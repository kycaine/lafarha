# API Documentation — LA Farha Worker Backend

Dokumentasi resmi seluruh endpoint REST API pada Cloudflare Worker (`apps/api`) yang berjalan di atas framework [Hono](https://hono.dev/) dan terhubung ke Cloudflare D1 Database.

---

## 1. Arsitektur & Base URL

### Base URL
| Environment | Base URL Worker (Direct) | Via Next.js Frontend Proxy |
| :--- | :--- | :--- |
| **Local Development** | `http://localhost:8787` | `http://localhost:3000/api/proxy` |
| **Development** | `https://dev-farha-worker.farhala.workers.dev` | `https://dev-farha.pages.dev/api/proxy` |
| **Production** | `https://lafarha-worker.farhala.workers.dev` | `https://lafarha.pages.dev/api/proxy` |

> **Catatan untuk Frontend Developer:**
> Dalam aplikasi web (`apps/web`), **selalu panggil API melalui proxy internal** (`/api/proxy/...`). Next.js Route Handler di `/api/proxy/[...path]` akan otomatis menyisipkan header `X-API-Key` dan membaca session user (`X-User-ID`, `X-User-Role`).

---

## 2. Autentikasi & Request Headers

Semua request yang dikirim langsung ke Worker wajib menyertakan header keamanan berikut:

| Header | Wajib | Tipe | Keterangan |
| :--- | :---: | :--- | :--- |
| `Content-Type` | Ya (POST/PUT/PATCH) | `application/json` | Format payload request |
| `X-API-Key` | **Ya** | `string` | Kunci rahasia API (`API_SECRET_KEY` di Cloudflare Worker) |
| `X-User-Role` | Opsional | `string` | Role user aktif: `'master'`, `'admin'`, `'counter'`, `'muthawif'`, `'user'` |
| `X-User-ID` | Opsional | `string` | Firebase UID user |

### Standar Format Response
Semua endpoint mengembalikan format JSON standar:
```json
// Sukses
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Pesan deskripsi error"
}
```

---

## 3. Users API (`/users`)

Mengelola data pengguna dan hak akses (role). Primary key `id` user adalah Firebase UID.

### 3.1. Get All Users
- **Method:** `GET`
- **Path:** `/users`
- **Akses:** `master`, `admin`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "AIzaSy...",
      "email": "admin@lafarha.id",
      "display_name": "Admin Farha",
      "photo_url": "https://...",
      "role": "admin",
      "created_at": 1728710000000,
      "updated_at": 1728710000000
    }
  ]
}
```

### 3.2. Get User by ID
- **Method:** `GET`
- **Path:** `/users/:id`
- **Param:** `id` (Firebase UID)
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "AIzaSy...",
    "email": "talkto.rezki@gmail.com",
    "display_name": "Master Admin",
    "photo_url": "https://...",
    "role": "master",
    "created_at": 1728710000000,
    "updated_at": 1728710000000
  }
}
```

### 3.3. Create User Manually
Mendaftarkan email baru sebelum user login pertama kali (pre-provisioning).
- **Method:** `POST`
- **Path:** `/users`
- **Akses:** `master`
- **Request Body:**
```json
{
  "email": "staff@lafarha.id",
  "role": "counter"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "manual_1728710000000_abc123",
    "email": "staff@lafarha.id",
    "role": "counter"
  }
}
```

### 3.4. Upsert User on Login
Dipanggil otomatis oleh AuthContext setelah user berhasil Sign In dengan Google/Firebase. Jika user adalah email master (`MASTER_EMAIL`), role otomatis diset sebagai `'master'`.
- **Method:** `POST`
- **Path:** `/users/upsert`
- **Request Body:**
```json
{
  "id": "firebase_uid_12345",
  "email": "staff@lafarha.id",
  "display_name": "Fulan",
  "photo_url": "https://lh3.googleusercontent.com/...",
  "is_master": false
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "firebase_uid_12345",
    "email": "staff@lafarha.id",
    "display_name": "Fulan",
    "photo_url": "https://lh3.googleusercontent.com/...",
    "role": "counter",
    "created_at": 1728710000000,
    "updated_at": 1728720000000
  }
}
```

### 3.5. Update User Role
- **Method:** `PATCH`
- **Path:** `/users/:id/role`
- **Akses:** `master`
- **Request Body:**
```json
{
  "role": "admin"
}
```
*(Role yang valid: `master`, `admin`, `counter`, `user`, `muthawif`)*
- **Response `200 OK`:**
```json
{
  "success": true
}
```

### 3.6. Delete User
- **Method:** `DELETE`
- **Path:** `/users/:id`
- **Akses:** `master` (Akun dengan email master tidak dapat dihapus).
- **Response `200 OK`:**
```json
{
  "success": true
}
```

---

## 4. Products API (`/products`)

Mengelola katalog produk layanan LA (Hotel, Tiket Pesawat, Bagasi, Visa, Transportasi).

### 4.1. Get All Products
- **Method:** `GET`
- **Path:** `/products`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "HOTEL",
      "title": "Hotel",
      "icon": "Building2",
      "requires_pax": 1,
      "form_schema": "[{\"type\":\"HotelSpecsModule\"}]"
    }
  ]
}
```

### 4.2. Create Product
- **Method:** `POST`
- **Path:** `/products`
- **Request Body:**
```json
{
  "id": "HOTEL",
  "title": "Hotel",
  "icon": "Building2",
  "requires_pax": true,
  "form_schema": [{"type": "HotelSpecsModule"}]
}
```
- **Response `200 OK`:** `{"success": true}`

### 4.3. Update Product
- **Method:** `PUT`
- **Path:** `/products/:id`
- **Request Body:**
```json
{
  "title": "Hotel Makkah & Madinah",
  "icon": "Building2",
  "requires_pax": true,
  "form_schema": [{"type": "HotelSpecsModule"}]
}
```
- **Response `200 OK`:** `{"success": true}`

### 4.4. Delete Product
- **Method:** `DELETE`
- **Path:** `/products/:id`
- **Response `200 OK`:** `{"success": true}`

### 4.5. Reset Products to Default
- **Method:** `POST`
- **Path:** `/products/reset`
- **Request Body (Opsional):**
```json
{
  "products": [
    {
      "id": "HOTEL",
      "title": "Hotel",
      "icon": "Building2",
      "requires_pax": 1,
      "form_schema": "[{\"type\":\"HotelSpecsModule\"}]"
    }
  ]
}
```
*(Jika body kosong, sistem akan memasukkan data default: HOTEL, FLIGHT, BAGGAGE, VISA, TRANSPORTASI).*
- **Response `200 OK`:** `{"success": true}`

---

## 5. Transactions API (`/transactions`)

Mengelola alur pemesanan (Order/Quote) mulai dari pengajuan user, penawaran harga oleh counter, hingga penutupan transaksi.

### 5.1. Create Transaction (Submit Order)
- **Method:** `POST`
- **Path:** `/transactions`
- **Request Body:**
```json
{
  "name": "Kiki Tampan",
  "whatsapp": "6281234567890",
  "notes": "{\"services\":[\"HOTEL\",\"FLIGHT\"],\"pax\":45,\"hotel\":{\"city\":\"Makkah\"}}"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "transactionId": "HOT-PES-74912"
}
```

### 5.2. Get All Transactions
- **Method:** `GET`
- **Path:** `/transactions`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "HOT-PES-74912",
      "client_name": "Kiki Tampan",
      "client_whatsapp": "6281234567890",
      "status": "PENDING",
      "total_amount_idr": null,
      "quote_expiry": null,
      "notes": "{...}",
      "created_at": 1728710000000
    }
  ]
}
```

### 5.3. Get Transaction Detail
- **Method:** `GET`
- **Path:** `/transactions/:id`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "HOT-PES-74912",
    "client_name": "Kiki Tampan",
    "client_whatsapp": "6281234567890",
    "status": "PENDING",
    "total_amount_idr": null,
    "quote_expiry": null,
    "notes": "{...}",
    "created_at": 1728710000000,
    "items": [
      {
        "id": 1,
        "transaction_id": "HOT-PES-74912",
        "category": "HOTEL",
        "title": "Hotel",
        "specs": "{\"city\":\"Makkah\",\"pax\":45}",
        "subtotal": null
      }
    ]
  }
}
```

### 5.4. Update Client WhatsApp Contact
- **Method:** `PATCH`
- **Path:** `/transactions/:id/contact`
- **Akses:** `counter`, `admin`, `master`
- **Request Body:**
```json
{
  "whatsapp": "6289988776655"
}
```
- **Response `200 OK`:** `{"success": true}`

### 5.5. Submit Quote (Kirim Penawaran Harga)
- **Method:** `PUT`
- **Path:** `/transactions/:id/quote`
- **Akses:** `counter`, `admin`, `master`
- **Request Body:**
```json
{
  "totalAmount": 150000000,
  "validityHours": 24,
  "items": {
    "1": 90000000,
    "2": 60000000
  }
}
```
*(Status transaksi akan otomatis berubah menjadi `QUOTED`).*
- **Response `200 OK`:** `{"success": true}`

### 5.6. Update Transaction Status
- **Method:** `PATCH`
- **Path:** `/transactions/:id/status`
- **Akses:** `counter`, `admin`, `master`
- **Request Body:**
```json
{
  "status": "CLOSED"
}
```
*(Status yang valid: `'PENDING'`, `'QUOTED'`, `'CLOSED'`, `'CANCELLED'`)*
- **Response `200 OK`:** `{"success": true}`

---

## 6. Mitra API (`/mitra`)

Mengelola data rekanan/mitra bisnis LA Farha.

### 6.1. Get All Mitra
- **Method:** `GET`
- **Path:** `/mitra`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "MITRA-AB12CD",
      "nama": "Saudi Airlines",
      "kategori": "Airlines",
      "foto": "/mitra/MITRA-AB12CD/foto?v=4200",
      "created_at": 1728710000000
    }
  ]
}
```

### 6.2. Get Foto Mitra (Binary Stream)
- **Method:** `GET`
- **Path:** `/mitra/:id/foto`
- **Response:** Mengembalikan binary image dengan header caching `Cache-Control: public, max-age=31536000, immutable`.

### 6.3. Create Mitra
- **Method:** `POST`
- **Path:** `/mitra`
- **Akses:** `master`, `admin`
- **Request Body:**
```json
{
  "nama": "Hilton Makkah",
  "kategori": "Hotel",
  "foto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "id": "MITRA-XY98ZT"
}
```

### 6.4. Update Mitra
- **Method:** `PUT`
- **Path:** `/mitra/:id`
- **Akses:** `master`, `admin`
- **Request Body:**
```json
{
  "nama": "Hilton Convention Makkah",
  "kategori": "Hotel",
  "foto": "data:image/png;base64,..."
}
```
- **Response `200 OK`:** `{"success": true}`

### 6.5. Delete Mitra
- **Method:** `DELETE`
- **Path:** `/mitra/:id`
- **Akses:** `master`, `admin`
- **Response `200 OK`:** `{"success": true}`

---

## 7. Muthawif API (`/muthawifs`)

Mengelola data pendaftaran, profil, dan persetujuan muthawif.

### 7.1. Get All Muthawifs
- **Method:** `GET`
- **Path:** `/muthawifs`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "MUTHAWIF-12AB34",
      "nama": "Ustadz Abdullah",
      "email": "abdullah@gmail.com",
      "status": "APPROVED",
      "cv_file": "https://...",
      "panggilan": "Abu Maryam",
      "foto": "data:image/jpeg;base64,...",
      "umur": "35",
      "languages": "Indonesia, Arab, Inggris",
      "experience": "8 Tahun di Makkah & Madinah",
      "location": "Makkah",
      "rating": 5,
      "created_at": 1728710000000
    }
  ]
}
```

### 7.2. Get Muthawif by ID
- **Method:** `GET`
- **Path:** `/muthawifs/:id`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "MUTHAWIF-12AB34",
    "nama": "Ustadz Abdullah",
    "email": "abdullah@gmail.com",
    "status": "APPROVED"
  }
}
```

### 7.3. Register Muthawif (Pendaftaran Baru)
- **Method:** `POST`
- **Path:** `/muthawifs`
- **Request Body:**
```json
{
  "nama": "Ustadz Ahmad",
  "email": "ahmad@gmail.com",
  "cv_file": "https://lafarha-storage.r2.cloudflarestorage.com/cv.pdf"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "id": "MUTHAWIF-56CD78"
}
```

### 7.4. Get Muthawif Profile by Email
- **Method:** `GET`
- **Path:** `/muthawifs/by-email/:email`
- **Response `200 OK`:** Mengembalikan detail profil muthawif sesuai email.

### 7.5. Update Muthawif Profile
- **Method:** `PUT`
- **Path:** `/muthawifs/by-email/:email`
- **Request Body:**
```json
{
  "nama": "Ustadz Ahmad",
  "panggilan": "Abu Zakariya",
  "foto": "data:image/jpeg;base64,...",
  "umur": "32",
  "languages": "Indonesia, Arab",
  "experience": "5 Tahun",
  "location": "Madinah"
}
```
- **Response `200 OK`:** `{"success": true}`

### 7.6. Approve Muthawif
Menyetujui pendaftaran muthawif dan otomatis membuat/mengupdate role user di tabel `users` menjadi `'muthawif'`.
- **Method:** `PATCH`
- **Path:** `/muthawifs/:id/approve`
- **Response `200 OK`:** `{"success": true}`

---

## 8. Settings API (`/settings`)

Mengelola konfigurasi kontak, WhatsApp CS & Counter, alamat kantor, dan tautan sosial media platform.

### 8.1. Get Contact Settings
- **Method:** `GET`
- **Path:** `/settings/contact`
- **Response `200 OK`:**
```json
{
  "success": true,
  "whatsapp_number": "6281234567890",
  "whatsapp_label": "Customer Service",
  "whatsapp_counter": "6289876543210",
  "email": "info@lafarha.id",
  "office_address": "Jl. Raya Condet No. 12",
  "office_city": "Jakarta Timur",
  "instagram": "https://instagram.com/lafarha.id",
  "facebook": "",
  "twitter": "",
  "youtube": "",
  "tiktok": "",
  "linkedin": "",
  "telegram": ""
}
```

### 8.2. Update Contact Settings
- **Method:** `PUT`
- **Path:** `/settings/contact`
- **Request Body:**
```json
{
  "whatsapp_number": "6281234567890",
  "whatsapp_label": "Customer Service LA Farha",
  "whatsapp_counter": "6289876543210",
  "email": "info@lafarha.id",
  "office_address": "Gedung Farha Lt. 2, Jl. TB Simatupang",
  "office_city": "Jakarta Selatan",
  "instagram": "https://instagram.com/lafarha.id",
  "facebook": "https://facebook.com/lafarha",
  "twitter": "",
  "youtube": "https://youtube.com/@lafarha",
  "tiktok": "https://tiktok.com/@lafarha",
  "linkedin": "",
  "telegram": ""
}
```
- **Response `200 OK`:** `{"success": true}`


---

## 9. Storage & Upload API (`/upload` & `/storage`)

Mengelola upload gambar ke Cloudflare R2 bucket.

### 9.1. Upload Image (WebP)
- **Method:** `POST`
- **Path:** `/upload`
- **Request Body:**
```json
{
  "base64": "data:image/webp;base64,UklGR...",
  "folder": "gallery"
}
```
*(Folder opsional: `'gallery'`, `'blog'`, `'mitra'`).*
- **Response `200 OK`:**
```json
{
  "success": true,
  "url": "/storage/gallery/1728710000000-ab12cd.webp"
}
```

### 9.2. Serve Image
- **Method:** `GET`
- **Path:** `/storage/:key`
- **Akses:** Publik (tidak memerlukan API Key)
- **Response:** Binary image stream dengan header `Cache-Control: public, max-age=31536000, immutable`.

---

## 10. Gallery API (`/gallery`)

Mengelola foto dokumentasi perjalanan umrah LA Farha.

### 10.1. Get All Gallery Photos
- **Method:** `GET`
- **Path:** `/gallery`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "GAL-AB12CD",
      "image": "/storage/gallery/1728710000000-ab12cd.webp",
      "caption": "Momen di Masjid Nabawi",
      "created_at": 1728710000000
    }
  ]
}
```

### 10.2. Add Photo to Gallery
- **Method:** `POST`
- **Path:** `/gallery`
- **Akses:** `master`, `admin`
- **Request Body:**
```json
{
  "image": "/storage/gallery/1728710000000-ab12cd.webp",
  "caption": "Momen di Masjid Nabawi"
}
```
- **Response `200 OK`:** `{"success": true, "id": "GAL-AB12CD"}`

### 10.3. Delete Photo
- **Method:** `DELETE`
- **Path:** `/gallery/:id`
- **Akses:** `master`, `admin`
- **Response `200 OK`:** `{"success": true}`

---

## 11. Articles & Blog API (`/articles`)

Mengelola artikel edukasi dan panduan umrah.

### 11.1. Get All Articles
- **Method:** `GET`
- **Path:** `/articles`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Panduan Lengkap Persiapan Fisik Sebelum Berangkat Umrah",
      "excerpt": "Kesehatan fisik sangat penting...",
      "content": "Isi lengkap artikel...",
      "author": "Tim Farha",
      "date": "25 Oktober 2026",
      "image": "/storage/blog/1728710000000-ef56gh.webp",
      "category": "Persiapan"
    }
  ]
}
```

### 11.2. Get Article by ID
- **Method:** `GET`
- **Path:** `/articles/:id`
- **Response `200 OK`:** Detail 1 artikel.

### 11.3. Create Article
- **Method:** `POST`
- **Path:** `/articles`
- **Akses:** `master`, `admin`
- **Request Body:**
```json
{
  "title": "Tips Umrah Mandiri",
  "excerpt": "Ringkasan...",
  "content": "Konten lengkap...",
  "author": "Tim Farha",
  "date": "12 Oktober 2026",
  "image": "/storage/blog/cover.webp",
  "category": "Tips"
}
```
- **Response `200 OK`:** `{"success": true, "id": 7}`

### 11.4. Update Article
- **Method:** `PUT`
- **Path:** `/articles/:id`
- **Akses:** `master`, `admin`
- **Request Body:** Format sama seperti Create Article.
- **Response `200 OK`:** `{"success": true}`

### 11.5. Delete Article
- **Method:** `DELETE`
- **Path:** `/articles/:id`
- **Akses:** `master`, `admin`
- **Response `200 OK`:** `{"success": true}`

---

## 12. Contoh Request (cURL & Fetch)

### Contoh cURL Direct ke Worker:
```bash
curl -X POST https://lafarha-worker.farhala.workers.dev/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_SECRET_KEY" \
  -H "X-User-Role: master" \
  -d '{"email": "counter@lafarha.id", "role": "counter"}'
```

### Contoh Fetch di Frontend (`apps/web` via Proxy):
```typescript
// Di frontend, gunakan helper fetchApi dari @/lib/api
import { fetchApi } from "@/lib/api";

const res = await fetchApi("/transactions", {
  method: "POST",
  body: JSON.stringify({
    name: "Pak Budi",
    whatsapp: "62812345678",
    notes: JSON.stringify({ services: ["HOTEL"] })
  })
});

if (res.success) {
  console.log("Transaction ID:", res.transactionId);
}
```
