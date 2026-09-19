# Cloudflare Deployment Guide

Dokumen ini berisi panduan deployment aplikasi LA ke ekosistem Cloudflare.

---

## Arsitektur 3 Environment

| | **Local** | **Dev** | **Prod** |
|---|---|---|---|
| **Frontend** | `localhost:3000` | `la-dev.pages.dev` | `la-prod.pages.dev` *(TBD)* |
| **API Worker** | `localhost:8787` | `la-dev-api.rizkyap90s.workers.dev` | `la-prod-api.rizkyap90s.workers.dev` *(TBD)* |
| **Database D1** | `la-dev-db` | `la-dev-db` | `la-prod-db` *(TBD)* |
| **Worker Config** | `wrangler.toml` | `wrangler.toml` | `wrangler.prod.toml` |

> Local dan Dev berbagi **DB yang sama** (`la-dev-db`). Worker-nya berbeda tapi hit D1 yang sama.

---

## Environment Files

Mulai sekarang, kita menggunakan pemisahan file env secara standar Next.js:

| File | Dipakai saat | Deskripsi & Isi |
|---|---|---|
| `.env.development` | `npm run dev` (Lokal) | Digunakan untuk pengembangan lokal. Memuat konfigurasi seperti `NEXT_PUBLIC_API_URL=http://localhost:8788`. |
| `.env.production` | `npm run deploy:dev` (Deploy) | Digunakan saat proses *build* untuk *deployment*. Memuat konfigurasi server seperti `NEXT_PUBLIC_API_URL=https://la-dev-api.rizkyap90s.workers.dev`. |

> **Info Penting**: Jangan pernah menggunakan `.env.local` karena file tersebut akan mem-bypass dan menimpa lingkungan lain secara paksa, yang sering menyebabkan URL lokal (localhost) ikut terbawa (ter-bake) ke dalam build untuk *production*.

---

## Local Development

```bash
# 1. Jalankan API Worker lokal (connect ke la-dev-db di Cloudflare)
cd api-worker && npx wrangler dev --remote

# 2. Jalankan frontend (terminal baru)
npm run dev
```

---

## Deploy Dev

```bash
npm run deploy:dev
```

Yang dijalankan di balik layar:
1. `cd api-worker && npx wrangler deploy --config wrangler.toml` → deploy worker ke `la-dev-api`
2. `npm run build:dev` → build Next.js dengan URL `la-dev-api` di-bake
3. `npx wrangler pages deploy out --project-name la-dev --branch main` → deploy ke Pages

---

## Deploy Prod

> ⚠️ Selesaikan setup Prod terlebih dahulu sebelum deploy:
> 1. Buat D1 database production: `npx wrangler d1 create la-prod-db`
> 2. Isi `database_id` di `api-worker/wrangler.prod.toml`
> 3. Jalankan migrations ke prod DB: `npx wrangler d1 execute la-prod-db --file=schema.sql`
> 4. Buat Cloudflare Pages project `la-prod`

```bash
npm run deploy:prod
```
