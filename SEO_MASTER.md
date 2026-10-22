# Panduan Master SEO: B2B Land Arrangement Umrah (`lafarha.id`)

Dokumen ini adalah *Single Source of Truth* (SSOT) arsitektur teknis, strategi kata kunci komersial, data terstruktur (JSON-LD), dan hierarki konten untuk mendominasi peringkat Google pada entitas:
**LA Farha** — *Platform B2B Land Arrangement Umrah Indonesia* (`https://lafarha.id`).

---

## 1. Master Prompt SEO: B2B Land Arrangement Umrah (`lafarha.id`)

Gunakan master prompt ini setiap kali merancang halaman baru, membuat materi penawaran, atau menyusun copywriting:

```text
Bertindaklah sebagai Senior B2B Technical SEO Architect dan Umrah Industry Copywriter. Saya sedang mengoptimasi platform digital Land Arrangement (LA) Umrah B2B di domain lafarha.id untuk entitas PT LA Farha.

Target Persona: Pemilik Travel Umrah, Direktur PPIU (Penyelenggara Perjalanan Ibadah Umrah), Agen Perjalanan Wisata, dan Pengelola Grup Umrah Mandiri di Indonesia.

Target Utama Keyword:
1. High-Intent Commercial & B2B: land arrangement umrah, la umrah indonesia, provider la umrah, platform la umrah b2b, provider umrah terpercaya.
2. Transactional & Service Components: booking hotel umrah mekkah madinah, hotel umrah bintang 3 4 5, provider visa umrah resmi, tiket pesawat umrah konsorsium, bus umrah eksekutif full trip, muthawif bersertifikat kemenag.
3. Cost & Value Intent: paket la umrah terjangkau, la umrah murah hemat, estimasi biaya land arrangement umrah.

Tolong buatkan strategi dan aset SEO komprehensif:
1. Metadata CTR Tinggi (Title Tag formula: "[Topik Spesifik] — [Brand/Value]", Meta Description 140–160 karakter persuasif, Canonical URL, OpenGraph, dan Twitter Card).
2. JSON-LD Schema Markup bertipe TravelAgency, Organization, WebSite, FAQPage, Product/AggregateOffer, dan Article/BlogPosting.
3. Struktur Konten Semantik H1–H3 dengan keyword placement yang natural tanpa keyword stuffing (mengikuti Anti-Dilution Rules).
4. Strategi Cross-Entity Link Graph yang menghubungkan entitas LA Farha, CTO & Co-Founder (Rezki Ade Pratama Putra / rezkiade.com), dan Technology Partner (Reternia Software House / reternia.com).
```

---

## 2. Target Keyword Matrix & Search Intent Mapping

Agar tidak terjadi *Keyword Cannibalization* antarhalaman, kata kunci dipetakan secara eksklusif ke masing-masing silo:

| Halaman | URL Target | Search Intent | Target Keyword Cluster |
| :--- | :--- | :--- | :--- |
| **Homepage** | `https://lafarha.id` | Commercial / Entity Navigational | *land arrangement umrah, la umrah indonesia, provider la umrah, platform b2b umrah indonesia* |
| **Katalog Modul** | `https://lafarha.id/products` | Commercial / Transactional | *booking hotel mekkah madinah, tiket pesawat umrah, provider visa umrah, bus umrah saudi* |
| **Paket Siap Berangkat** | `https://lafarha.id/packages` | Transactional / Decision | *paket la umrah, paket land arrangement hemat, paket umrah b2b, paket bronze silver gold vip umrah* |
| **Paket Spesifik** | `https://lafarha.id/packages/[id]` | Transactional Deep Link | *rincian paket umrah, estimasi harga la umrah per pax, quotation la umrah* |
| **Direktori Muthawif** | `https://lafarha.id/muthawif` | Commercial / Trust Signal | *muthawif umrah bersertifikat, guide ibadah makkah madinah, pendaftaran muthawif umrah* |
| **Tentang Kami** | `https://lafarha.id/tentang` | Entity / Trust / E-E-A-T | *profil pt la farha, dewan pendiri la farha, kantor operasional la farha jakarta* |
| **Galeri Layanan** | `https://lafarha.id/gallery` | Visual Proof / Trust | *dokumentasi handling umrah, fasilitas hotel la farha, armada bus jamaah umrah* |
| **Blog Edukasi** | `https://lafarha.id/blog` | Informational (Topical Authority) | *panduan persiapan fisik umrah, tips hotel makkah madinah, regulasi visa arab saudi, manasik ibadah* |

---

## 3. Strategi Segitiga Cross-Entity Link Graph (Mutual Authority)

Menghubungkan tiga entitas digital secara sinergis untuk memvalidasi Google Knowledge Graph:
1. **Entitas Bisnis Utama:** `lafarha.id` (Platform B2B Land Arrangement Umrah)
   - **CEO / Founder:** Ahmad Fatih
   - **CTO / Co-Founder:** Rezki Ade (`https://rezkiade.com`)
   - **CMO / Co-Founder:** Hasbi Jamal
2. **Entitas Teknologi & Software House:** `reternia.com` (Pembangun Sistem & Infrastruktur Cloud)
3. **Entitas Personal:** `rezkiade.com` (Rezki Ade — CTO & Co-Founder LA Farha / Founder Reternia)

```
             ┌─────────────────────────┐
             │      rezkiade.com       │
             │ (Personal Entity / CTO) │
             └───────────┬─────────────┘
                         │ ▲
           CTO Profile   │ │ Founder / Personal Brand
             Backlink    │ │ Authority Transfer
                         ▼ │
┌──────────────────────────┐     Tech Partner Backlink      ┌─────────────────────────┐
│        lafarha.id        ├───────────────────────────────►│      reternia.com       │
│  (B2B Umrah Platform)    │◄───────────────────────────────┤ (Software House Entity) │
└──────────────────────────┘     Infrastructure Credit      └─────────────────────────┘
```

### Implementasi Nyata di Kode:
- **`apps/web/src/components/layout/Footer.tsx`**:
  - Tautan *"Profil CTO (Rezki Ade)"* mengarah ke `https://rezkiade.com`.
  - Tautan *"Teknologi didukung oleh Reternia Software House"* mengarah ke `https://reternia.com`.
- **`apps/web/src/app/tentang/page.tsx`**:
  - Dewan Pendiri: **CEO Ahmad Fatih**, **CTO Rezki Ade**, dan **CMO Hasbi Jamal**.
  - Kartu profil CTO Rezki Ade memiliki tautan langsung ke `https://rezkiade.com`.
- **JSON-LD Schema (`app/layout.tsx` & `app/tentang/page.tsx`)**:
  - `founder`:
    - Ahmad Fatih (`CEO / Founder`)
    - Rezki Ade (`CTO / Co-Founder`, dengan `url: "https://rezkiade.com"`)
    - Hasbi Jamal (`CMO / Co-Founder`)
  - `parentOrganization` / `partner`: Reternia (`https://reternia.com`).

---

## 4. Anti-Dilution Rules: Formula 8 Core Keywords

Menghindari *Keyword Stuffing* pada `<meta name="keywords">` root:

```typescript
// apps/web/src/app/layout.tsx
keywords: [
  "Land Arrangement Umrah",
  "LA Umrah Indonesia",
  "Provider LA Umrah",
  "B2B Land Arrangement Umrah",
  "Paket LA Umrah Terbaik",
  "Handling Umrah Indonesia",
  "Booking Hotel Umrah Makkah Madinah",
  "Provider Visa Umrah Resmi",
]
```

Long-tail keywords dipecah dan didistribusikan ke masing-masing halaman layanan (`/products`, `/packages`, `/muthawif`).

---

## 5. Arsitektur Teknis Next.js App Router

### A. Dynamic Sitemap (`apps/web/src/app/sitemap.ts`)
Otomatis menghasilkan `/sitemap.xml` standar Google dengan prioritas yang dikalibrasi:
- `https://lafarha.id` (Priority: 1.0, Daily)
- `https://lafarha.id/packages` & `/products` (Priority: 0.9, Weekly)
- `https://lafarha.id/muthawif` & `/blog` (Priority: 0.8)
- Seluruh artikel blog dinamis `/blog/[id]` (Priority: 0.75, Monthly)
- Seluruh paket siap berangkat dinamis `/packages/[id]` (Priority: 0.85, Weekly)
- `https://lafarha.id/tentang` (Priority: 0.7) & `/gallery` (Priority: 0.6)

### B. Dynamic Robots (`apps/web/src/app/robots.ts`)
Otomatis menghasilkan `/robots.txt`:
- **Allowed:** Seluruh rute publik (`/`, `/packages`, `/products`, `/muthawif`, `/tentang`, `/gallery`, `/blog`).
- **Disallowed (Zero Index Waste):** `/admin/*`, `/api/*`, `/storage/*`, `/counter/*`, `/quote/*`, `/login`, `/settings`.
- **Sitemap Pointer:** `https://lafarha.id/sitemap.xml`.

### C. Master JSON-LD Schemas
Diinjeksikan langsung ke dalam DOM HTML mentah (`Raw GET Response`) untuk memastikan Googlebot dapat memproses entitas tanpa rendering delay:
1. **Root Layout (`apps/web/src/app/layout.tsx`):**
   - `@type: "TravelAgency"` + `"WebSite"`
   - Area Served: Indonesia & Saudi Arabia
   - PriceRange: `$$`
   - Complete `hasOfferCatalog` (Akomodasi Hotel, Transportasi Bus, Tiket Pesawat, Visa, Muthawif)
   - `founder`:
     - **Ahmad Fatih** (`jobTitle: "CEO / Founder"`)
     - **Rezki Ade** (`jobTitle: "CTO / Co-Founder"`, `url: "https://rezkiade.com"`)
     - **Hasbi Jamal** (`jobTitle: "CMO / Co-Founder"`)
2. **Homepage (`apps/web/src/app/page.tsx`):**
   - `@type: "FAQPage"` berisi 5 tanya-jawab krusial seputar Land Arrangement Umrah untuk memicu Google Featured Snippets.
3. **Paket Detail (`apps/web/src/app/packages/[id]/layout.tsx`):**
   - `@type: "Product"` + `AggregateOffer`
4. **Blog Detail (`apps/web/src/app/blog/[id]/layout.tsx`):**
   - `@type: "BlogPosting"`
5. **Tentang Kami (`apps/web/src/app/tentang/page.tsx`):**
   - `@type: "AboutPage"` dengan data dewan pendiri lengkap (CEO Ahmad Fatih, CTO Rezki Ade, CMO Hasbi Jamal).

---

## 6. Topical Authority & Educational Content Silo

Topik artikel blog dirancang untuk membangun keandalan industri di mata algoritma Helpful Content Google:
1. **Pilar Persiapan:** *Panduan Lengkap Persiapan Fisik Sebelum Berangkat Umrah* (Fisik, stamina, logistik).
2. **Pilar Akomodasi:** *5 Tips Memilih Penginapan Terbaik di Makkah dan Madinah* (Jarak, shuttle bus, kontur jalan, makanan nusantara).
3. **Pilar Musim Ibadah:** *Keutamaan Melaksanakan Ibadah Umrah di Bulan Ramadhan* (Ritme ibadah, cuaca, pahala setara haji).
4. **Pilar Regulasi & Dokumen:** *Mengenal Jenis-Jenis Visa Arab Saudi untuk Kebutuhan Ibadah* (Visa Umrah resmi vs Visa Turis, Siskopatuh, aturan musim haji).
5. **Pilar Sejarah & Ziarah:** *Rekomendasi Tempat Ziarah Bersejarah di Sekitar Madinah* (Masjid Quba, Qiblatain, Jabal Uhud).
6. **Pilar Tata Cara Ibadah (Manasik):** *Tata Cara Thawaf yang Benar Sesuai Sunnah* (Rukun, doa, adab).

**Aturan Penulisan Semantik:**
- Bersih dari token tanda hubung berulang (`end-to-end` ➔ `menyeluruh`, `real-time` ➔ `waktu nyata`).
- Optimasi keterbacaan untuk Google Search Generative Experience (SGE).

---

## 7. Checklist Audit Berkala (Evaluasi Triwulanan)

Jalankan evaluasi teknis ini secara berkala:

- [ ] **Google Rich Results Test:** Uji `https://lafarha.id` untuk memastikan skema `TravelAgency` dan `FAQPage` terdeteksi valid 100% tanpa peringatan.
- [ ] **Sitemap Indexing:** Pastikan `https://lafarha.id/sitemap.xml` telah disubmit dan berstatus *Success* di Google Search Console.
- [ ] **Robots.txt Reachability:** Pastikan Googlebot tidak terblokir saat mengakses `/products`, `/packages`, dan `/blog`.
- [ ] **Cross-Entity Linking Health:** Pastikan tautan footer ke `https://reternia.com` dan `https://rezkiade.com` aktif dengan atribut `rel="noopener"`.
- [ ] **Core Web Vitals:** Pastikan skor LCP < 2.0s, CLS = 0, dan FID/INP optimal melalui static pre-rendering Next.js.
- [ ] **CTR & Title Optimization:** Evaluasi *Search Queries* di Google Search Console setiap bulan untuk mendeteksi kata kunci baru yang memiliki *impressions* tinggi untuk dijadikan artikel pilar berikutnya.

