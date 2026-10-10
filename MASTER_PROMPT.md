Here is the complete system specification and product prompt for your development team or code-generation LLM, structured around the **No-Login Guest Flow** with the **3-Interface Architecture** and **WhatsApp Token Handshake**.

---

# Land Arrangement (LA) Umrah Web App: Master Development Prompt

You are tasked with building a web-based **Land Arrangement (LA) Umrah Inquiry & Quotation Platform**.

### Core Business Context & Constraints

* **No fixed prices:** Prices fluctuate wildly based on season, exchange rates, and reseller allotments. The customer never sees speculative "starting from" numbers.
* **No front-facing login:** Customers build inquiries as guests to eliminate onboarding friction.
* **Anti-spam mechanism:** Backend-generated one-time token bound to an incoming WhatsApp deep link, protected by an invisible CAPTCHA and IP rate limits.
* **Manual payment closure:** Final confirmation and payments are handled manually over WhatsApp.

---

## 1. System Architecture & The 3 Interfaces

**1. CUSTOMER FRONTEND (Guest / No Login)**
* Open Catalog with Dynamic Component-Based Forms (Hotels, Buses, Flights, Add-ons driven by CMS)
* Specification Cart Builder (PAX, Room Matrix, dynamic form validation)
* Submit Modal (Name, WhatsApp No, Invisible Turnstile)
* Direct WA Redirection with Secure Token
* Read-Only Live Quotation Page (Countdown Timer)
*(creates Order + Token -> passes to Admin)*

**2. ADMIN CALCULATION PAGE (Deal Closer / High Speed)**
* Mobile/Desktop rapid input tool per Order ID
* SAR to IDR live/manual exchange rate converter
* Input Reseller Cost + Custom Markup/Margin
* Auto-calculate subtotal & set Validity Timer
* 1-Click "Publish & Push Quote to Customer"
*(updates status & syncs -> passes to CMS)*

**3. ADMIN BACK-OFFICE CMS (Control & Inventory)**
* Component-Based Product CMS (Build dynamic frontend forms visually: map modules like HotelSpecs, FlightLogic, Generic Inputs)
* Pipeline Kanban (New -> Verified -> Priced -> Done)
* Blacklist / Ban Engine (IP, WhatsApp Number)
* Global Settings (Default profit margins, SAR buffer)

---

## 2. Detailed Technical Specifications

### Interface 1: Customer Frontend (Web)

1. **Corporate Landing Page & Dynamic Component-Based Form:**
   * **Landing Page:** A professional B2B landing page showcasing services fetched dynamically from D1 Database.
   * **Dynamic CMS Forms:** Instead of static form inputs, the page parses JSON `form_schema` from the database and maps them to pre-built React components (e.g. `HotelSpecsModule`, `FlightLogicModule`, `SearchableSelect`).
   * **Hotel & Room Configuration:** Input total PAX, Star Rating (3/4/5), and upload manifest.
   * **Validation:** All custom and generic fields inject HTML5 validation to auto-scroll on incomplete fields.

2. **Submission Modal & Anti-Spam:**
   * User clicks `"Minta Penawaran Harga"` (Request Quote).
   * Modal inputs: **Nama PIC / Travel** + **Nomor WhatsApp**.
   * Integrates an invisible CAPTCHA (Cloudflare Turnstile) on the submit button.
   * Rate Limit: Maximum 2 inquiries per IP every 30 minutes.

3. **WhatsApp Handshake Engine:**
   * On submit, backend creates an order record:
     `order_id: "ORD-1082"`, `token: "a7c2d9"`, `status: "AWAITING_VERIFICATION"`, `token_expiry: 20 minutes`.
   * Automatically launches WhatsApp with deep-link:
     `https://wa.me/{ADMIN_PHONE}?text=Halo%20Admin,%20saya%20order%20LA%20Umrah%20[REF:%20ORD-1082-a7c2d9]%20atas%20nama%20{NAME}`

4. **Client-Facing Quotation Screen (`/quote/{order_id}`):**
   * Displays status: *"Sedang Dihitung Admin"* while awaiting pricing.
   * Once admin publishes, turns into an itemized price sheet.
   * Shows a **Countdown Expiration Timer** (e.g., *"Penawaran berlaku 1x24 jam"*).
   * Button: `"Konfirmasi & Lanjut Pembayaran via WA"`.

---

### Interface 2: Admin Calculation Page (Rapid Deal Closer)

* Accessible via authenticated route: `/admin/orders/{order_id}/calculate`.
* **Clean Single-Screen Layout:**
  * **Header:** Order ID, Client Name, Client WhatsApp, Verification Status badge.
  * **Currency Controls:** Live SAR -> IDR conversion rate with an editable buffer field (e.g., default: 4,300 IDR/SAR).
  * **Calculation Table:**
    * Shows the requested items (e.g., 15 Airline Tickets, 3 Quad Rooms at Hotel Pulman, 1 Coaster Bus).
    * Column A: **Reseller Base Cost** (can select currency: IDR or SAR).
    * Column B: **Margin / Markup** (Nominal or percentage).
    * Column C: **Subtotal (Client Price)** (Auto-converts SAR to IDR).
* **Payment Terms Split:** Option to set Down Payment (DP) percentage (e.g., 30%) and Pelunasan balance.
* **Validity Timer:** Set expiration time (e.g., 3 hours, 12 hours, 24 hours).
* **Actions:**
  * `[Publish Quote]`: Changes order status to `QUOTATION_READY` and unlocks the client quote page.
  * `[Copy WhatsApp Summary]`: Generates a formatted text message with the total breakdown ready to paste into chat.
  * `[Block & Blacklist]`: 1-click ban for troll inquiries.

---

### Interface 3: Admin Back-Office CMS

* **Authentication:** Role-based access for Super-Admin and Sales Agents.
* **Order Pipeline (Kanban / Table View):**
  * Columns: `Awaiting WhatsApp Verification` -> `Calculating / In Review` -> `Quotation Ready` -> `Deal Closed` -> `Expired / Cancelled`.
* **Master Catalog Management:**
  * CRUD interfaces for Hotels (name, zone, star rating, photos, amenities).
  * CRUD interfaces for Bus fleets and transport routes.
* **Security & Blacklist Hub:**
  * Search, view, and remove blacklisted WhatsApp numbers and IP addresses.
  * System alerts showing repeated inquiries from identical device fingerprints.

---

## 3. Database Schema Blueprint (Cloudflare D1 / SQLite)

*Note: Translated to text overview for readability.*

**1. Products Table (Dynamic Form CMS)**
* **ID:** Unique text (HOTEL, FLIGHT, etc.)
* **Title & Icon:** Display name and Lucide icon reference
* **Requires Pax:** Boolean/Integer flag (Does this service require group passenger data?)
* **Form Schema:** JSON String defining the layout of modules (e.g. `[{"type": "HotelSpecsModule"}]`)

**2. Orders Table**
* **ID / Code:** Unique UUID, formatted code (e.g. ORD-2026-1082)
* **Client Info:** Name, WhatsApp, IP Address
* **Status:** AWAITING_VERIFICATION, CALCULATING, QUOTATION_READY, DEAL_CLOSED, CANCELLED, BLACKLISTED
* **Tokens & Timers:** Verification token, Token expiry, Quote expiry
* **Financials:** SAR to IDR rate, Total amount (IDR), DP amount (IDR)
* **Timestamps:** Created at

**2. Order Items (Requested Specifications)**
* **Relation:** Linked to Order ID
* **Details:** Category (HOTEL, FLIGHT, BUS, VISA, ADDON), Item title, Specification payload (JSON format)
* **Pricing Inputs:** Cost currency (SAR/IDR), Reseller cost, Markup amount, Client subtotal (IDR)

**3. Blacklist Table**
* **Identifiers:** Phone number, IP address
* **Details:** Reason for blacklist
* **Timestamps:** Created at

---

## 4. Suggested Tech Stack (Current Architecture)

* **Monorepo Architecture:** Managed via NPM Workspaces (or `pnpm`), separating frontend and backend for independent deployments while sharing typed contracts.
* **Frontend (`apps/web`):** **Next.js (App Router)** deployed on **Cloudflare Pages**.
  * UI: Tailwind CSS, `cn()` utility, generic UI components (Button, Input, Card).
  * State & Context: `AuthContext.tsx`, `AlertContext.tsx`.
* **Backend (`apps/api`):** **Hono Framework** deployed on **Cloudflare Workers**.
  * Provides strict REST endpoints consumed by the frontend via a centralized `fetchApi()` utility.
* **Database & Storage:** 
  * **Cloudflare D1** (Serverless SQLite) as the primary database.
  * **Cloudflare R2** for file and media storage.
* **Authentication:** **Firebase Auth** (Google Provider) used exclusively for Identity/Login (Admin/Muthawif), with user profiles automatically synced (`upsertUserProfile`) to Cloudflare D1. Session persistence is handled securely.
* **Automated CI/CD:** GitHub Actions (`.github/workflows/ci.yml`) managing isolated builds and sequential `wrangler` deployments for both Worker and Pages to `dev` and `main` environments.

---

## 5. Recommended Folder Structure (Monorepo)

The project is structured as a Monorepo to separate the Edge API from the Frontend UI, while maintaining a Modular Monolith pattern inside the Next.js app.

```text
/
├── .github/workflows/
│   └── ci.yml               # Automated build & deploy pipeline
├── apps/
│   ├── api/                 # Cloudflare Worker (Backend)
│   │   ├── src/
│   │   │   └── index.ts     # Hono API entrypoint & routes
│   │   ├── wrangler.toml    # Worker config (D1, R2 bindings)
│   │   └── package.json
│   │
│   └── web/                 # Next.js App Router (Frontend)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/      # Guest facing forms
│       │   │   └── admin/         # Authenticated admin routes (Dashboard, Users, Contacts)
│       │   │
│       │   ├── lib/               # Core utilities
│       │   │   ├── api.ts         # fetchApi wrapper
│       │   │   ├── firebase.ts    # Firebase client init
│       │   │   └── auth.ts        # Server-side auth & signOut
│       │   │
│       │   ├── modules/           # Business Domains
│       │   │   ├── catalog/       # ProductCatalog, HotelSpecsModule, FlightLogicModule
│       │   │   └── ordering/      # Transactions, actions.ts, Status Badges
│       │   │
│       │   └── shared/            # Cross-cutting UI & Context
│       │       ├── AuthContext.tsx
│       │       └── AlertContext.tsx
│       │
│       ├── next.config.mjs
│       └── package.json
│
├── package.json             # Root workspace config
├── DEPLOYMENTS.md           # CI/CD and Secrets guide
└── MASTER_PROMPT.md         # Architecture prompt
```