# Deployment Guide

Saat ini, aplikasi web utama (Next.js) terhubung secara otomatis dengan *branch* `dev` atau `main` di repositori GitHub, sehingga **tidak perlu deploy manual untuk web utama** (Cloudflare Pages akan melakukan *auto-build* setiap kali ada commit baru ke branch tersebut).

Namun, untuk layanan **API Worker**, Anda perlu melakukan *deployment* secara manual jika ada perubahan di dalam direktori `api-worker/`.

## Cara Deploy API Worker (Manual)

Jalankan perintah berikut di terminal Anda untuk memperbarui dan mengunggah kode worker ke Cloudflare:

```bash
cd api-worker
npx wrangler deploy
```

> **Catatan:** Pastikan Anda sudah login ke akun Cloudflare di CLI (`npx wrangler login`) jika ini pertama kali Anda mendeploy dari perangkat tersebut.
