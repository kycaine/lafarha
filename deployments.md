# Cloudflare Deployment Guide

Dokumen ini berisi panduan dan arahan untuk melakukan *deployment* aplikasi LA ke ekosistem Cloudflare.

---

## Arsitektur

Aplikasi terbagi menjadi dua bagian terpisah:

| Bagian | Teknologi | Proyek Cloudflare | URL |
|---|---|---|---|
| **Frontend** | Next.js Static Export | Cloudflare Pages `la-dev` | https://la-dev.pages.dev |
| **Backend** | Hono API Worker | Cloudflare Worker `la-dev-api` | https://la-dev-api.rizkyap90s.workers.dev |

> **Catatan:** Database D1 (`DB`) hanya di-binding ke Worker (`api-worker/wrangler.toml`). Pages tidak perlu binding database.

---

## Lingkungan Development (DEV)

### Deploy Backend (API Worker)

Jalankan dari **root proyek**:

```bash
cd api-worker && npx wrangler deploy
```

### Deploy Frontend (Next.js Pages)

Jalankan dari **root proyek** (bukan dari dalam `api-worker`):

```bash
npm run build && npx wrangler pages deploy out --project-name la-dev --branch main
```

### Deploy Keduanya Sekaligus

```bash
cd api-worker && npx wrangler deploy && cd .. && npm run build && npx wrangler pages deploy out --project-name la-dev --branch main
```

---

## Lingkungan Production (PROD)

*(Akan ditambahkan setelah environment DEV stabil.)*
