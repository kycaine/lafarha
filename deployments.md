# Cloudflare Deployment Guide

Dokumen ini berisi panduan dan arahan untuk melakukan *deployment* aplikasi LA Umrah ke ekosistem Cloudflare.

## Lingkungan Development (DEV)

Untuk tahap *development* atau *staging*, kita menggunakan proyek terpisah agar tidak mengganggu *production*.

### Konfigurasi Proyek Cloudflare
Karena arsitektur sudah dipisahkan (Frontend dan Backend terpisah) untuk menghindari kendala runtime:
- **Cloudflare Pages:** `la-dev` (Frontend Next.js Static Export, URL: https://la-dev.pages.dev)
- **Cloudflare Worker:** `la-dev-api` (Backend Hono API, URL: https://la-dev-api.rizkyap90s.workers.dev)
- **Database D1:** Binding (`DB`) kini berada **hanya di Worker** (`api-worker/wrangler.toml`), Pages tidak lagi membutuhkan binding database.

### Langkah-langkah Deploy ke DEV:
> **Catatan Penting:** Backend Worker harus selalu berjalan/di-deploy agar Frontend bisa memanggil API.

#### 1. Deploy API Worker (Backend)
Buka terminal dan masuk ke folder `api-worker`, lalu deploy:
```bash
cd api-worker
npx wrangler deploy
```
*(Catatan: Ini akan otomatis membaca `api-worker/wrangler.toml` yang sudah memiliki binding ke D1 database Anda).*

#### 2. Deploy Frontend (Next.js Pages)
Pastikan Anda berada di direktori utama proyek (luar folder `api-worker`). 

a. **Build Aplikasi Next.js:**
Aplikasi sekarang menggunakan *Static Export* murni.
```bash
npm run build
```
*(Ini akan membuat folder `out/` yang berisi file HTML/CSS/JS statis).*

b. **Deploy ke Cloudflare Pages (la-dev):**
Gunakan perintah Wrangler untuk men-deploy folder `out/`:
```bash
npx wrangler pages deploy out --project-name la-dev --branch main
```

---

## Lingkungan Production (PROD)
*(Tahapan Production akan ditambahkan nanti setelah environment DEV stabil dan selesai dikonfigurasi).*
