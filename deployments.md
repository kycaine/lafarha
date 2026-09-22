# Cloudflare Deployment & Environment Guide

Dokumen ini berisi panduan *deployment* aplikasi FARHA ke ekosistem Cloudflare dan standar operasional (SOP) untuk mengelola *database* tanpa konflik.

---

## Arsitektur 3 Environment

| | **Local** | **Dev** | **Prod** |
|---|---|---|---|
| **Frontend** | `localhost:3000` | `la-dev.pages.dev` | `la-prod.pages.dev` *(TBD)* |
| **API Worker** | `localhost:8787` | `la-dev-api.rizkyap90s.workers.dev` | `la-prod-api.rizkyap90s.workers.dev` *(TBD)* |
| **Database D1** | `Simulated Local DB` | `la-dev-db` | `la-prod-db` *(TBD)* |
| **Worker Config** | `wrangler.toml` | `wrangler.toml` | `wrangler.prod.toml` |

> **Perubahan Penting**: Local dan Dev **TIDAK LAGI** berbagi DB yang sama untuk menghindari konflik data dan skema. Local menggunakan simulasi D1 yang filenya tersimpan otomatis di `.wrangler/state/v3/d1`.

---

## Environment Files

Kita menggunakan pemisahan file env secara standar Next.js:

| File | Dipakai saat | Deskripsi & Isi |
|---|---|---|
| `.env.development` | `npm run dev` (Lokal) | Digunakan untuk pengembangan lokal. Memuat konfigurasi seperti `NEXT_PUBLIC_API_URL=http://localhost:8788`. |
| `.env.production` | `npm run deploy:dev` (Deploy) | Digunakan saat proses *build* untuk *deployment*. Memuat konfigurasi server seperti `NEXT_PUBLIC_API_URL=https://la-dev-api.rizkyap90s.workers.dev`. |

> **Info Penting**: Jangan pernah menggunakan `.env.local` karena file tersebut akan mem-bypass dan menimpa lingkungan lain secara paksa.

---

## Manajemen Database (Menghindari Konflik)

Gunakan *script* ini untuk memperbarui struktur tabel (berasal dari `schema.sql`). **JANGAN PERNAH** me-reset atau mengedit skema *database* Dev/Prod saat sedang menguji coba di lokal.

1. **Inisialisasi/Reset Local DB**  
   Selalu gunakan perintah ini saat Anda butuh me-reset *database* lokal:
   ```bash
   npm run db:init-local
   ```
   *(Aman, menggunakan file lokal, tidak menyentuh server Cloudflare).*

2. **Update Dev DB (Remote)**  
   Hanya jalankan perintah ini jika Anda berniat menerapkan skema baru ke server Development:
   ```bash
   npm run db:init-dev
   ```

3. **Update Prod DB (Remote - Hati-Hati!)**  
   Untuk Production (pastikan sudah direview):
   ```bash
   npm run db:init-prod
   ```

---

## Local Development

```bash
npm run dev
```
Perintah ini akan menjalankan frontend Next.js dan API Worker (Miniflare) secara bersamaan menggunakan konfigurasi lokal yang sepenuhnya terisolasi dari Dev.

---

## Deploy Dev

```bash
npm run deploy:dev
```

Yang dijalankan di balik layar:
1. `cd api-worker && npx wrangler deploy --config wrangler.toml` → deploy worker ke `la-dev-api`
2. `npm run build:dev` → build Next.js
3. `npx wrangler pages deploy` → deploy ke Pages

---

## Deploy Prod

> ⚠️ Selesaikan setup Prod terlebih dahulu sebelum deploy:
> 1. Buat D1 database production: `npx wrangler d1 create la-prod-db`
> 2. Isi `database_id` di `api-worker/wrangler.prod.toml`
> 3. Jalankan init ke prod DB: `npm run db:init-prod`
> 4. Buat Cloudflare Pages project `la-prod`

```bash
npm run deploy:prod
```
