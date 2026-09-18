-- Users table — Firebase UID digunakan sebagai primary key
-- Role: master | admin | counter | user
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,           -- Firebase UID
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  photo_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,                  -- Firebase UID (nullable untuk order tanpa login)
  client_name TEXT NOT NULL,
  client_whatsapp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AWAITING_VERIFICATION',
  token TEXT,
  token_expiry INTEGER,
  total_amount_idr INTEGER,
  dp_amount_idr INTEGER,
  pelunasan_amount_idr INTEGER,
  quote_expiry TEXT,
  created_at INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  specs TEXT,
  cost_currency TEXT DEFAULT 'SAR',
  reseller_cost REAL,
  markup REAL,
  subtotal REAL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blacklist (
  identifier TEXT PRIMARY KEY,
  reason TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT,
  requires_pax INTEGER DEFAULT 0,
  form_schema TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mitra (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  kategori TEXT NOT NULL,
  foto TEXT,
  created_at INTEGER
);

