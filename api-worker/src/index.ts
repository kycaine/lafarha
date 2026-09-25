import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  API_SECRET_KEY: string;
  MASTER_EMAIL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-User-ID', 'X-User-Role'],
}));

// Protect all routes with API Key
app.use('/*', async (c, next) => {
  // Check API Key
  const apiKey = c.req.header('X-API-Key');
  if (!apiKey || apiKey !== c.env.API_SECRET_KEY) {
    return c.json({ success: false, error: 'Unauthorized: Invalid or missing API Key' }, 401);
  }

  await next();
});

// Helper for Role Verification
const requireRole = (c: any, allowedRoles: string[]) => {
  const role = c.req.header('X-User-Role');
  return role && allowedRoles.includes(role);
};

// -- Users API --
// Primary key = Firebase UID

app.get('/users', async (c) => {
  if (!requireRole(c, ['master', 'admin'])) return c.json({ success: false, error: 'Forbidden' }, 403);
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM users ORDER BY created_at DESC"
    ).all();
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await c.env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(id).first();
    if (!user) return c.json({ success: false, error: 'Not found' }, 404);
    return c.json({ success: true, data: user });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create user manually (by Master)
app.post('/users', async (c) => {
  if (!requireRole(c, ['master'])) return c.json({ success: false, error: 'Forbidden' }, 403);
  try {
    const { email, role } = await c.req.json();
    if (!email || !role) return c.json({ success: false, error: 'Email and role required' }, 400);

    const existing = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (existing) return c.json({ success: false, error: 'Email sudah terdaftar' }, 400);

    // Use a dummy ID for now, it will be overwritten with Firebase UID when they first log in
    const dummyId = `manual_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = Date.now();

    await c.env.DB.prepare(
      `INSERT INTO users (id, email, display_name, photo_url, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(dummyId, email, '', '', role, now, now).run();

    return c.json({ success: true, data: { id: dummyId, email, role } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Upsert user on login — Firebase UID is the primary key
app.post('/users/upsert', async (c) => {
  try {
    const data = await c.req.json();
    const { id, email, display_name, photo_url, is_master } = data;
    const now = Date.now();

    const MASTER_EMAIL = c.env.MASTER_EMAIL || 'talkto.rezki@gmail.com';

    // Cari berdasarkan email terlebih dahulu (bukan berdasarkan ID karena ID di awal berupa dummy)
    let existing = await c.env.DB.prepare(
      "SELECT * FROM users WHERE email = ?"
    ).bind(email).first() as any;

    if (!existing) {
      if (is_master || email === MASTER_EMAIL) {
        // Jika master login pertama kali, kita buatkan akunnya
        await c.env.DB.prepare(
          `INSERT INTO users (id, email, display_name, photo_url, role, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, email, display_name, photo_url, 'master', now, now).run();
        existing = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
      } else {
        // Email tidak ada di database, artinya belum didaftarkan master -> Blokir!
        return c.json({ success: false, error: 'Email Anda belum terdaftar. Hubungi Master Admin.' }, 403);
      }
    } else {
      // User ada di database (sudah didaftarkan master). 
      // Update ID-nya dengan Firebase UID (karena ID dari master adalah dummy_xxx), 
      // dan update info dari Firebase
      const role = (email === MASTER_EMAIL) ? 'master' : existing.role;

      await c.env.DB.prepare(
        `UPDATE users SET id = ?, display_name = ?, photo_url = ?, role = ?, updated_at = ? WHERE email = ?`
      ).bind(id, display_name, photo_url, role, now, email).run();

      existing = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
    }

    return c.json({ success: true, data: existing });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Set user role (master only — enforced in UI layer)
app.patch('/users/:id/role', async (c) => {
  if (!requireRole(c, ['master'])) return c.json({ success: false, error: 'Forbidden' }, 403);
  try {
    const id = c.req.param('id');
    const { role } = await c.req.json();

    const validRoles = ['master', 'admin', 'counter', 'user'];
    if (!validRoles.includes(role)) {
      return c.json({ success: false, error: 'Invalid role' }, 400);
    }

    await c.env.DB.prepare(
      "UPDATE users SET role = ?, updated_at = ? WHERE id = ?"
    ).bind(role, Date.now(), id).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});



// -- Products API --

app.get('/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM products").all();
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post('/products', async (c) => {
  try {
    const data = await c.req.json();
    await c.env.DB.prepare(
      "INSERT INTO products (id, title, icon, requires_pax, form_schema) VALUES (?, ?, ?, ?, ?)"
    ).bind(
      data.id, data.title, data.icon, data.requires_pax ? 1 : 0, typeof data.form_schema === "string" ? data.form_schema : JSON.stringify(data.form_schema)
    ).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put('/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    await c.env.DB.prepare(
      "UPDATE products SET title = ?, icon = ?, requires_pax = ?, form_schema = ? WHERE id = ?"
    ).bind(
      data.title, data.icon, data.requires_pax ? 1 : 0, typeof data.form_schema === "string" ? data.form_schema : JSON.stringify(data.form_schema), id
    ).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete('/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post('/products/reset', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const products: any[] = body.products;

    await c.env.DB.prepare("DELETE FROM products").run();

    if (products && products.length > 0) {
      // Insert exactly what the frontend sent — single source of truth
      for (const p of products) {
        await c.env.DB.prepare(
          "INSERT INTO products (id, title, icon, requires_pax, form_schema) VALUES (?, ?, ?, ?, ?)"
        ).bind(
          p.id,
          p.title,
          p.icon,
          p.requires_pax ? 1 : 0,
          typeof p.form_schema === "string" ? p.form_schema : JSON.stringify(p.form_schema)
        ).run();
      }
    } else {
      // Fallback: hardcoded insert (e.g. called directly without body)
      await c.env.DB.prepare(
        `INSERT INTO products (id, title, icon, requires_pax, form_schema) VALUES 
        ('HOTEL', 'Hotel', 'Building2', 1, '[{"type":"HotelSpecsModule"}]'), 
        ('FLIGHT', 'Tiket Pesawat', 'Plane', 1, '[{"type":"FlightLogicModule"}]'), 
        ('BAGGAGE', 'Bagasi', 'Briefcase', 0, '[{"type":"BaggageModule"}]'), 
        ('VISA', 'Visa', 'Ticket', 1, '[{"type":"VisaModule"}]'), 
        ('TRANS_AIRPORT', 'Transportasi Bandara', 'Car', 1, '[{"type":"TransAirportModule"}]'), 
        ('TRANS_TOUR', 'Transportasi Tour', 'Bus', 1, '[{"type":"TransTourModule"}]')`
      ).run();
    }

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});


// ── Transactions API ──────────────────────────────────────────────────────

// POST /transactions — buat transaksi baru dari form user
app.post('/transactions', async (c) => {
  try {
    const formData = await c.req.json();
    let specsJson: any = {};
    try {
      specsJson = JSON.parse(formData.notes);
    } catch {
      specsJson = { services: [] };
    }

    const services: string[] = specsJson.services || [];

    const prefixMap: Record<string, string> = {
      'HOTEL': 'HOT', 'FLIGHT': 'PES', 'BAGGAGE': 'BAG',
      'VISA': 'VIS', 'TRANS_AIRPORT': 'TRA', 'TRANS_TOUR': 'TRT',
    };
    const titleMap: Record<string, string> = {
      'HOTEL': 'Hotel', 'FLIGHT': 'Tiket Pesawat', 'BAGGAGE': 'Bagasi',
      'VISA': 'Visa', 'TRANS_AIRPORT': 'Transportasi Bandara', 'TRANS_TOUR': 'Transportasi Tour',
    };

    const prefixes = services.map((s) => prefixMap[s] || s.substring(0, 3)).join('-') || 'TRX';
    const txId = `${prefixes}-${Math.floor(Math.random() * 90000) + 10000}`;

    await c.env.DB.prepare(
      `INSERT INTO transactions (id, client_name, client_whatsapp, status, notes, created_at)
       VALUES (?, ?, ?, 'PENDING', ?, ?)`
    ).bind(
      txId,
      formData.name,
      formData.whatsapp || null,
      formData.notes,
      Date.now()
    ).run();

    for (const srv of services) {
      const specMap: Record<string, any> = {
        HOTEL: specsJson.hotel, FLIGHT: specsJson.flight,
        BAGGAGE: specsJson.baggage, VISA: specsJson.visa,
        TRANS_AIRPORT: specsJson.transAirport, TRANS_TOUR: specsJson.transTour,
      };
      const itemSpecs = {
        ...(specMap[srv] || {}),
        pax: specsJson.pax,
        customFields: specsJson.customFields?.[srv],
      };

      await c.env.DB.prepare(
        `INSERT INTO transaction_items (transaction_id, category, title, specs)
         VALUES (?, ?, ?, ?)`
      ).bind(txId, srv, titleMap[srv] || srv, JSON.stringify(itemSpecs)).run();
    }

    return c.json({ success: true, transactionId: txId });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// GET /transactions — semua transaksi (admin/counter)
app.get('/transactions', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM transactions ORDER BY created_at DESC'
    ).all();
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// GET /transactions/:id — detail transaksi + items
app.get('/transactions/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const tx = await c.env.DB.prepare(
      'SELECT * FROM transactions WHERE id = ?'
    ).bind(id).first();
    if (!tx) return c.json({ success: false, error: 'Not found' }, 404);

    const { results: items } = await c.env.DB.prepare(
      'SELECT * FROM transaction_items WHERE transaction_id = ?'
    ).bind(id).all();

    return c.json({ success: true, data: { ...tx, items } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// PATCH /transactions/:id/contact — counter update nomor WA terverifikasi
app.patch('/transactions/:id/contact', async (c) => {
  if (!requireRole(c, ['counter', 'admin', 'master'])) return c.json({ success: false, error: 'Forbidden' }, 403);
  try {
    const id = c.req.param('id');
    const { whatsapp } = await c.req.json();
    if (!whatsapp) return c.json({ success: false, error: 'whatsapp required' }, 400);

    await c.env.DB.prepare(
      'UPDATE transactions SET client_whatsapp = ? WHERE id = ?'
    ).bind(whatsapp, id).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// PUT /transactions/:id/quote — counter submit harga → status QUOTED
app.put('/transactions/:id/quote', async (c) => {
  if (!requireRole(c, ['counter', 'admin', 'master'])) return c.json({ success: false, error: 'Forbidden' }, 403);
  try {
    const id = c.req.param('id');
    const { totalAmount, validityHours = 24, items } = await c.req.json();

    const expiry = new Date(Date.now() + validityHours * 3600_000).toISOString();

    await c.env.DB.prepare(
      `UPDATE transactions SET status = 'QUOTED', total_amount_idr = ?, quote_expiry = ? WHERE id = ?`
    ).bind(totalAmount, expiry, id).run();

    if (items) {
      for (const [itemId, price] of Object.entries(items)) {
        await c.env.DB.prepare('UPDATE transaction_items SET subtotal = ? WHERE id = ?')
          .bind(Number(price), itemId).run();
      }
    }

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// PATCH /transactions/:id/status — update status (CLOSED / CANCELLED)
app.patch('/transactions/:id/status', async (c) => {
  if (!requireRole(c, ['counter', 'admin', 'master'])) return c.json({ success: false, error: 'Forbidden' }, 403);
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const allowed = ['PENDING', 'QUOTED', 'CLOSED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return c.json({ success: false, error: 'Invalid status' }, 400);
    }

    await c.env.DB.prepare('UPDATE transactions SET status = ? WHERE id = ?')
      .bind(status, id).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});


// -- Mitra API --

app.get('/mitra', async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM mitra ORDER BY created_at DESC").all();
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post('/mitra', async (c) => {
  try {
    const data = await c.req.json();
    const id = `MITRA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await c.env.DB.prepare(
      "INSERT INTO mitra (id, nama, kategori, foto, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(
      id, data.nama, data.kategori, data.foto || null, Date.now()
    ).run();
    return c.json({ success: true, id });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put('/mitra/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    await c.env.DB.prepare(
      "UPDATE mitra SET nama = ?, kategori = ?, foto = ? WHERE id = ?"
    ).bind(
      data.nama, data.kategori, data.foto || null, id
    ).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete('/mitra/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare("DELETE FROM mitra WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});


// -- Settings: Contact & Social Media --

// GET /settings/contact — ambil settings (create default row jika belum ada)
app.get('/settings/contact', async (c) => {
  try {
    let row = await c.env.DB.prepare(
      "SELECT * FROM contact_settings WHERE key = 'contact'"
    ).first() as any;

    if (!row) {
      // Insert default empty row
      await c.env.DB.prepare(
        `INSERT INTO contact_settings (key, updated_at) VALUES ('contact', ?)`
      ).bind(Date.now()).run();
      row = await c.env.DB.prepare(
        "SELECT * FROM contact_settings WHERE key = 'contact'"
      ).first();
    }

    // Remove the internal 'key' field before returning
    const { key, updated_at, ...data } = row as any;
    return c.json({ success: true, ...data });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// PUT /settings/contact — simpan/update settings
app.put('/settings/contact', async (c) => {
  try {
    const data = await c.req.json();
    const now = Date.now();

    // Upsert: insert or replace
    await c.env.DB.prepare(
      `INSERT INTO contact_settings 
        (key, whatsapp_number, whatsapp_label, whatsapp_counter, email, office_address, office_city,
         instagram, facebook, twitter, youtube, tiktok, linkedin, telegram, updated_at)
       VALUES ('contact', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         whatsapp_number  = excluded.whatsapp_number,
         whatsapp_label   = excluded.whatsapp_label,
         whatsapp_counter = excluded.whatsapp_counter,
         email            = excluded.email,
         office_address  = excluded.office_address,
         office_city     = excluded.office_city,
         instagram       = excluded.instagram,
         facebook        = excluded.facebook,
         twitter         = excluded.twitter,
         youtube         = excluded.youtube,
         tiktok          = excluded.tiktok,
         linkedin        = excluded.linkedin,
         telegram        = excluded.telegram,
         updated_at      = excluded.updated_at`
    ).bind(
      data.whatsapp_number ?? '',
      data.whatsapp_label ?? '',
      data.whatsapp_counter ?? '',
      data.email ?? '',
      data.office_address ?? '',
      data.office_city ?? '',
      data.instagram ?? '',
      data.facebook ?? '',
      data.twitter ?? '',
      data.youtube ?? '',
      data.tiktok ?? '',
      data.linkedin ?? '',
      data.telegram ?? '',
      now
    ).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
