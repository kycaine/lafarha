-- src/shared/db/schema.sql

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS blacklist;

CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_whatsapp TEXT NOT NULL,
    client_ip TEXT,
    status TEXT NOT NULL DEFAULT 'AWAITING_VERIFICATION',
    verification_token TEXT,
    token_expiry DATETIME,
    quote_expiry DATETIME,
    sar_to_idr_rate REAL,
    total_amount_idr REAL,
    dp_amount_idr REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    category TEXT NOT NULL, -- HOTEL, FLIGHT, BUS, VISA, ADDON
    item_title TEXT,
    specs_json TEXT, -- Store complex configs like room matrix
    cost_currency TEXT DEFAULT 'SAR',
    reseller_cost REAL,
    markup_amount REAL,
    client_subtotal_idr REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE blacklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier_type TEXT NOT NULL, -- PHONE, IP
    identifier_value TEXT NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_blacklist_value ON blacklist(identifier_value);
