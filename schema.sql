-- ─────────────────────────────────────────────────────────────
-- LA Umrah — Database Schema
-- Single transactions table, no user accounts required
-- ─────────────────────────────────────────────────────────────

-- Core transaction table
CREATE TABLE IF NOT EXISTS transactions (
  id           TEXT    PRIMARY KEY,                   -- e.g. HOT-PES-4821
  client_name  TEXT    NOT NULL,
  client_whatsapp TEXT,                               -- nullable: diisi counter setelah verifikasi via WA
  status       TEXT    NOT NULL DEFAULT 'PENDING',
  --   PENDING   : baru masuk, menunggu counter
  --   QUOTED    : harga sudah dikirim ke customer
  --   CLOSED    : deal closed / confirmed
  --   CANCELLED : dibatalkan
  notes        TEXT,                                  -- JSON full specs dari form user
  total_amount_idr INTEGER,
  quote_expiry TEXT,
  created_at   INTEGER
);

-- Line items per transaction
CREATE TABLE IF NOT EXISTS transaction_items (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id  TEXT    NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  category        TEXT    NOT NULL,                   -- HOTEL, FLIGHT, VISA, dll
  title           TEXT    NOT NULL,
  specs           TEXT,                               -- JSON spesifikasi per item
  subtotal        REAL
);

-- Services/products catalog (CMS admin)
CREATE TABLE IF NOT EXISTS products (
  id          TEXT    PRIMARY KEY,
  title       TEXT    NOT NULL,
  icon        TEXT,
  requires_pax INTEGER DEFAULT 0,
  form_schema TEXT    NOT NULL
);

-- Mitra / vendor
CREATE TABLE IF NOT EXISTS mitra (
  id        TEXT    PRIMARY KEY,
  nama      TEXT    NOT NULL,
  kategori  TEXT    NOT NULL,
  foto      TEXT,
  created_at INTEGER
);

-- Contact & social media settings (single row)
CREATE TABLE IF NOT EXISTS contact_settings (
  key              TEXT PRIMARY KEY DEFAULT 'contact',
  whatsapp_number  TEXT DEFAULT '',
  whatsapp_label   TEXT DEFAULT '',
  whatsapp_counter TEXT DEFAULT '',
  email            TEXT DEFAULT '',
  office_address   TEXT DEFAULT '',
  office_city      TEXT DEFAULT '',
  instagram        TEXT DEFAULT '',
  facebook         TEXT DEFAULT '',
  twitter          TEXT DEFAULT '',
  youtube          TEXT DEFAULT '',
  tiktok           TEXT DEFAULT '',
  linkedin         TEXT DEFAULT '',
  telegram         TEXT DEFAULT '',
  updated_at       INTEGER
);

-- Admin/counter users (Firebase auth, role-based)
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  display_name TEXT,
  photo_url    TEXT,
  role         TEXT NOT NULL DEFAULT 'user',   -- master | admin | counter | user
  created_at   INTEGER,
  updated_at   INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_status    ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transaction_items_tid  ON transaction_items(transaction_id);
