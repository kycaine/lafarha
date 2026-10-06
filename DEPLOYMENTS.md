# Cloudflare Deployment & Environment Guide

Dokumen ini berisi panduan *deployment* aplikasi FARHA ke ekosistem Cloudflare dan standar operasional (SOP) agar **hasil di Local dan di Dev identik**.

---

## Arsitektur 3 Environment

| | **Local** | **Dev** | **Prod** |
|---|---|---|---|
| **Frontend** | `localhost:3000` (`next dev`) | Pages project `dev-farha` → `https://dev-farha-7xv.pages.dev` | Pages project `farha` |
| **API Worker** | `127.0.0.1:8787` (`wrangler dev`) | `dev-farha-worker` → `https://dev-farha-worker.farhala.workers.dev` | `farha-worker` |
| **Database D1** | Simulasi lokal (`api-worker/.wrangler/state`) | `dev-farha-db` | `farha-db` |
| **Config Worker** | `api-worker/wrangler.toml` + `api-worker/.dev.vars` | `api-worker/wrangler.toml` | `api-worker/wrangler.prod.toml` |
| **Config Pages** | – | `wrangler.toml` (root) | `wrangler.toml` (root) |

> Pages project `dev-farha` memakai **production branch `main`**. `deploy:dev` selalu memakai `--branch=main` agar hasil deploy tidak bergantung pada branch git yang sedang aktif.

> Local dan Dev **tidak berbagi DB**. Agar data konten sama, jalankan `npm run db:sync-local` (lihat bawah).

---

## Prinsip "Tanpa Gap"

Kode **tidak punya nilai fallback** untuk URL/secret. Local dan Dev memakai mekanisme yang sama; bedanya hanya *dari mana* nilainya datang:

| Variabel | Dibaca kapan | Local | Dev / Prod |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Build** (ter-inline) | `.env.development` | `.env.production` (dev) / `.env.prod` (prod) |
| `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_MASTER_EMAIL` | **Build** (ter-inline) | `.env.development` | `.env.production` / `.env.prod` |
| `API_SECRET_KEY` (sisi Next/proxy) | **Runtime** | `.env.development` | **Pages secret** |
| `SESSION_SECRET` (min. 32 karakter) | **Runtime** | `.env.development` | **Pages secret** |
| `API_SECRET_KEY` (sisi Worker) | **Runtime** | `api-worker/.dev.vars` | **Worker secret** |

Kalau salah satu hilang, proxy/session langsung error dengan pesan yang menyebut nama variabelnya (bukan diam-diam memakai nilai bawaan).

> ⚠️ `API_SECRET_KEY` di Next **harus identik** dengan `API_SECRET_KEY` di Worker pada environment yang sama (lokal: `.env.development` ↔ `.dev.vars`; dev: Pages secret ↔ Worker secret).
> Mengisi `API_SECRET_KEY`/`SESSION_SECRET` di `.env.production` **tidak berpengaruh** — nilai itu tidak dipakai saat runtime di Pages. Jangan ditaruh di sana.

### Template file env

| Template | Salin menjadi | Dipakai untuk |
|---|---|---|
| `.env.example` | `.env.development` | `npm run dev` |
| `api-worker/.dev.vars.example` | `api-worker/.dev.vars` | `wrangler dev` |
| `.env.prod.example` | `.env.prod` | `npm run deploy:prod` |

Semua file env asli ada di `.gitignore`. Jangan pernah membuat `.env.local` (menimpa semua environment).

---

## Setup Secret (sekali, atau saat rotasi)

Ganti `<KEY>` dengan string acak, mis. `openssl rand -hex 32`. Nilai **Pages** dan **Worker** untuk `API_SECRET_KEY` harus sama.

```bash
# Worker dev
cd api-worker
echo -n "<KEY>" | npx wrangler secret put API_SECRET_KEY --config wrangler.toml
cd ..

# Pages dev (berlaku untuk deployment BERIKUTNYA → deploy ulang setelahnya)
echo -n "<KEY>"            | CLOUDFLARE_ACCOUNT_ID=ef964688891b9260ac3e9a712c69cd74 npx wrangler pages secret put API_SECRET_KEY --project-name dev-farha
echo -n "<SESSION_SECRET>" | CLOUDFLARE_ACCOUNT_ID=ef964688891b9260ac3e9a712c69cd74 npx wrangler pages secret put SESSION_SECRET --project-name dev-farha
```

Cek nama secret yang terpasang (nilai tidak ditampilkan):

```bash
cd api-worker && npx wrangler secret list --config wrangler.toml
CLOUDFLARE_ACCOUNT_ID=ef964688891b9260ac3e9a712c69cd74 npx wrangler pages secret list --project-name dev-farha
```

Untuk Prod, ulangi dengan `wrangler.prod.toml` dan `--project-name farha` memakai nilai **berbeda** dari Dev.

---

## Manajemen Database

Skema bersumber dari `schema.sql`. **JANGAN** reset/edit DB Dev/Prod saat menguji di lokal.

| Perintah | Efek |
|---|---|
| `npm run db:init-local` | Terapkan skema ke DB lokal (aman, tidak menyentuh Cloudflare). |
| `npm run db:sync-local` | **Salin data konten** (`mitra`, `products`, `contact_settings`) dari Dev DB ke lokal. Tabel `transactions`/`users` sengaja tidak disalin. |
| `npm run db:init-dev` | Terapkan skema ke Dev DB (remote). |
| `npm run db:init-prod` | Terapkan skema ke Prod DB (remote, hati-hati). |

> Jalankan `db:sync-local` setiap kali data konten di Dev berubah dan ingin dites di lokal. Perintah ini menimpa tabel konten lokal.

### 🔄 Cara Clone/Sync Data dari Dev ke Local
Jika Anda melihat perbedaan data (seperti list mitra, paket produk, atau pengaturan web) antara tampilan di lokal dengan di website *dev*, Anda cukup menjalankan perintah ini di terminal:

```bash
npm run db:sync-local
```
Perintah ini akan menyedot (*dump*) data terkini dari D1 Cloudflare dan memasukkannya ke database lokal Anda, sehingga dijamin 100% sama!

---

## Local Development

```bash
cp .env.example .env.development            # lalu isi
cp api-worker/.dev.vars.example api-worker/.dev.vars   # API_SECRET_KEY sama dengan .env.development
npm run db:init-local
npm run db:sync-local                       # opsional: samakan data dengan Dev
npm run dev
```

Menjalankan Next.js (`:3000`) dan Worker/Miniflare (`:8787`) bersamaan. Browser selalu memanggil `/api/proxy/*` (same-origin) — sama persis dengan Dev.

---

## Deploy Dev

```bash
npm run deploy:dev
```

Yang dijalankan:
1. `wrangler deploy --config wrangler.toml` (di `api-worker`) → worker `dev-farha-worker`
2. `npm run build:dev` → `scripts/build-pages.sh dev` (build Next.js dengan `.env.production` + patch `node:async_hooks`)
3. `wrangler pages deploy .vercel/output/static --project-name dev-farha --branch=main`

Checklist verifikasi setelah deploy:

```bash
# proxy Pages harus 200 (bukan 401/500) dan ukurannya kecil (foto tidak lagi inline base64)
curl -s -o /dev/null -w "%{http_code} %{size_download}B\n" https://dev-farha-7xv.pages.dev/api/proxy/mitra
```

Kalau responsnya `500 API configuration missing: …` → secret Pages belum di-set. Kalau `401` → `API_SECRET_KEY` Pages ≠ Worker.

---

## Deploy Prod

> ⚠️ Selesaikan setup Prod dulu:
> 1. D1 prod sudah ada (`farha-db`, `database_id` di `api-worker/wrangler.prod.toml`). Jalankan `npm run db:init-prod` bila skema berubah.
> 2. Salin `.env.prod.example` → `.env.prod` dan isi `NEXT_PUBLIC_API_URL` ke URL worker **prod** (bukan worker dev).
> 3. Set secret Prod (lihat "Setup Secret") dengan nilai berbeda dari Dev.

```bash
npm run deploy:prod
```

`build:prod` memuat `.env.prod` ke environment shell sehingga menimpa `.env.production` (yang menunjuk worker dev). Build akan gagal jelas bila `.env.prod` tidak ada.

---

## Troubleshooting "beda dengan lokal"

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| API mitra kosong / tidak ter-hit di Dev | `API_SECRET_KEY` Pages ≠ Worker (401), atau secret Pages belum di-set (500) | Ikuti "Setup Secret", deploy ulang, jalankan curl verifikasi di atas. Error kini tercatat di console (`[getMitra]`, `[Proxy]`). |
| Data di Dev beda dengan lokal | DB terpisah | `npm run db:sync-local` |
| Hover/animasi navbar tidak jalan di Dev | JS client tidak ter-hydrate (chunk lama/error) | Buka DevTools → Console, cari `ChunkLoadError` / error hydration; hard-reload setelah deploy. |
| Login lokal/dev gagal "SESSION_SECRET belum di-set" | Secret hilang atau < 32 karakter | Set ulang di `.env.development` / Pages secret |
