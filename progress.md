# LA Project - Progress & Handoff Document

## 1. Arsitektur Sistem Saat Ini
Project ini menggunakan arsitektur *Monorepo* yang terbagi menjadi dua bagian utama:
*   **Frontend (Next.js App Router)**: Dideploy ke Cloudflare Pages (`la-dev.pages.dev`).
*   **Backend (Hono.js)**: Dideploy ke Cloudflare Workers (`la-dev-api.rizkyap90s.workers.dev`).
*   **Database**: Cloudflare D1 (`la-dev-db`).

## 2. Fitur yang Sudah Selesai & Berjalan
*   **Authentication (Firebase + Iron Session)**: 
    *   Pengguna login menggunakan Firebase Auth (Google).
    *   Frontend mendapatkan *token/UID* lalu mengirimnya ke endpoint internal (`/api/auth/session`) untuk membuat *HTTP-Only Cookie* menggunakan `iron-session`.
    *   Setiap request ke backend secara otomatis membawa `X-User-ID` dan `X-User-Role`.
*   **Database Schema & Migrations**:
    *   Tabel `users`, `orders`, `order_items`, `products`, `mitra`, `blacklist` sudah terdeploy ke D1 *Production* / *Dev*.
*   **API Proxy (Penting!)**:
    *   Semua pemanggilan API dari Frontend ke Backend TIDAK dilakukan secara langsung. 
    *   Frontend memanggil rute internal `/api/proxy/[...path]`.
    *   Rute Proxy tersebut berjalan di *Cloudflare Edge*, bertugas **menyuntikkan rahasia** (`API_SECRET_KEY`) ke header request sebelum diteruskan ke URL Backend (`la-dev-api`).
    *   Ini mencegah tereksposnya `API_SECRET_KEY` di sisi *client/browser*.

## 3. Masalah Terakhir yang Sudah Diperbaiki (Bug Fixes)
*   **Error 500 pada Proxy (Gagal memuat Data & Gagal Simpan Profil)**:
    *   **Penyebab Asli**: Modul `session.ts` sebelumnya mengevaluasi `process.env.SESSION_SECRET` di level modul (*global scope*). Edge Runtime Cloudflare tidak mendukung pembacaan `process.env` di luar fungsi *handler*, sehingga ini membuat seluruh *route* proxy dan *middleware* Next.js *crash* (Error 500). Selain itu, `API_SECRET_KEY` tidak terbaca di Cloudflare Pages karena belum di-set di Dashboard.
    *   **Solusi yang telah diterapkan**: 
        1. Membungkus `sessionOptions` ke dalam fungsi `getSessionOptions()` sehingga `process.env` dievaluasi secara aman (*lazy evaluation*).
        2. Kunci rahasia `API_SECRET_KEY` sudah diunggah langsung ke *Environment Variables* Cloudflare Pages menggunakan perintah `npx wrangler pages secret put API_SECRET_KEY`.
        3. Menghapus semua URL *hardcode* dan memastikan *build script* menggunakan file `.env.production` (tanpa menimpa / override dengan inline script yang salah).

## 4. Cara Menjalankan & Deploy (Untuk Dev Selanjutnya)
1.  **Lokal (Development)**:
    *   Pastikan ada file `.env.development` yang berisi kredensial Firebase dan `NEXT_PUBLIC_API_URL=http://localhost:8788`.
    *   Jalankan: `npm run dev` (Akan memanggil Frontend Next.js dan Backend Worker lokal secara bersamaan menggunakan *concurrently*).
2.  **Deploy ke Cloudflare**:
    *   Pastikan ada file `.env.production` yang berisi kredensial Firebase dan `NEXT_PUBLIC_API_URL=https://la-dev-api.rizkyap90s.workers.dev`.
    *   Jalankan: `npm run deploy:dev`.
    *   Jika ada rahasia (*secret*) baru yang ditambahkan di *backend*, PASTIKAN rahasia tersebut juga didaftarkan ke *Cloudflare Pages* menggunakan perintah `npx wrangler pages secret put NAMA_RAHASIA --project-name la-dev`.

## 5. Status Terkini
Proses pendaftaran *user*, halaman *Mitra*, dan *Products* **SUDAH BERFUNGSI NORMAL** pada rilis terakhir. Jika kamu membaca ini, sistem secara teknis sudah berhasil lolos dari masalah otentikasi dan *crash* proxy. Langkah selanjutnya adalah fokus pada pembuatan dan perapihan komponen UI untuk *Dashboard*, *Penawaran*, dan pengelolaan pesanan (*Orders*).

## 6. Bug Fixes — User Data Sync (2026-09-19)
**Issue:** Data user tidak tersimpan ke D1 setelah login Firebase. User selalu gagal di-upsert.

**Root Causes yang ditemukan & diperbaiki:**

### Bug A — Trailing whitespace di `.env.development`
- `NEXT_PUBLIC_MASTER_EMAIL=talkto.rezki@gmail.com ` (ada spasi di belakang!)
- Menyebabkan perbandingan `email === MASTER_EMAIL` di `user-store.ts` selalu `false`.
- **Fix**: Hapus trailing whitespace.

### Bug B — `MASTER_EMAIL` tidak ada di `api-worker/.dev.vars`
- Backend worker tidak bisa baca `MASTER_EMAIL` dari env saat dev lokal.
- Fallback ke hardcoded `talkto.rezki@gmail.com` di kode, jadi masih bisa jalan, tapi rentan jika diubah.
- **Fix**: Tambahkan `MASTER_EMAIL="talkto.rezki@gmail.com"` ke `.dev.vars`.
- **PENTING untuk Production**: Jalankan `cd api-worker && npx wrangler secret put MASTER_EMAIL` untuk set di production.

### Bug C — Error handling di `AuthContext.tsx` tidak ada fallback
- Jika `upsertUserProfile()` gagal (network error, worker belum ready), `setLoading(false)` tidak dipanggil dengan benar dan session tidak pernah di-set → user stuck.
- **Fix**: Tambahkan fallback di catch block: set session dengan `role: "user"` dari Firebase UID secara langsung, agar user tidak stuck di loading screen.

### Bug D — Tidak ada logging untuk debug
- **Fix**: Tambahkan `console.log` di `user-store.ts`, `AuthContext.tsx`, dan proxy route untuk mempermudah debugging di masa depan.

