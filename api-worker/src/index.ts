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

// -- Users API --
// Primary key = Firebase UID

app.get('/users', async (c) => {
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

// Upsert user on login — Firebase UID is the primary key
app.post('/users/upsert', async (c) => {
  try {
    const data = await c.req.json();
    const { id, email, display_name, photo_url, is_master } = data;
    const now = Date.now();

    const existing = await c.env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(id).first() as any;

    const MASTER_EMAIL = c.env.MASTER_EMAIL || 'talkto.rezki@gmail.com';

    if (!existing) {
      // New user — create with default role
      const role = is_master || email === MASTER_EMAIL ? 'master' : 'user';
      await c.env.DB.prepare(
        `INSERT INTO users (id, email, display_name, photo_url, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(id, email, display_name, photo_url, role, now, now).run();

      const newUser = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
      return c.json({ success: true, data: newUser });
    }

    // Existing user — always enforce master role for master email, update display info
    const role = (email === MASTER_EMAIL) ? 'master' : existing.role;
    await c.env.DB.prepare(
      `UPDATE users SET display_name = ?, photo_url = ?, role = ?, updated_at = ? WHERE id = ?`
    ).bind(display_name, photo_url, role, now, id).run();

    const updatedUser = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
    return c.json({ success: true, data: updatedUser });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Set user role (master only — enforced in UI layer)
app.patch('/users/:id/role', async (c) => {
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


// -- Orders API --

app.post('/orders', async (c) => {
  try {
    const formData = await c.req.json();
    let specsJson: any = {};
    try {
      specsJson = JSON.parse(formData.notes);
    } catch (e) {
      specsJson = { services: ['HOTEL'] };
    }

    const services = specsJson.services || [];

    // Prefix Mapping
    const prefixMap: Record<string, string> = {
      'HOTEL': 'HOT',
      'FLIGHT': 'PES',
      'BAGGAGE': 'BAG',
      'VISA': 'VIS',
      'TRANS_AIRPORT': 'TRA',
      'TRANS_TOUR': 'TRT'
    };

    const titleMap: Record<string, string> = {
      'HOTEL': 'Hotel',
      'FLIGHT': 'Tiket Pesawat',
      'BAGGAGE': 'Bagasi',
      'VISA': 'Visa',
      'TRANS_AIRPORT': 'Transportasi Bandara',
      'TRANS_TOUR': 'Transportasi Tour'
    };

    const prefixes = services.map((s: string) => prefixMap[s] || s.substring(0, 3)).join('-');
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `${prefixes}-${Math.floor(Math.random() * 10000)}`;
    const tokenExpiry = new Date(Date.now() + 20 * 60000).toISOString();

    await c.env.DB.prepare(
      `INSERT INTO orders (id, client_name, client_whatsapp, status, token, token_expiry, created_at) 
       VALUES (?, ?, ?, 'AWAITING_VERIFICATION', ?, ?, ?)`
    ).bind(
      orderId,
      formData.name,
      formData.whatsapp,
      token,
      tokenExpiry,
      new Date().toISOString()
    ).run();

    // Insert each service as a distinct order item
    for (const srv of services) {
      let itemSpecs = {};
      if (srv === 'HOTEL') itemSpecs = specsJson.hotel || {};
      else if (srv === 'FLIGHT') itemSpecs = specsJson.flight || {};
      else if (srv === 'BAGGAGE') itemSpecs = specsJson.baggage || {};
      else if (srv === 'VISA') itemSpecs = specsJson.visa || {};
      else if (srv === 'TRANS_AIRPORT') itemSpecs = specsJson.transAirport || {};
      else if (srv === 'TRANS_TOUR') itemSpecs = specsJson.transTour || {};

      // Inject generic pax info into each spec if needed
      itemSpecs = { ...itemSpecs, pax: specsJson.pax, customFields: specsJson.customFields?.[srv] };

      await c.env.DB.prepare(
        `INSERT INTO order_items (order_id, category, title, specs)
         VALUES (?, ?, ?, ?)`
      ).bind(
        orderId,
        srv,
        titleMap[srv] || srv,
        JSON.stringify(itemSpecs)
      ).run();
    }

    return c.json({ success: true, orderId, token });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put('/orders/:id/quote', async (c) => {
  try {
    const orderId = c.req.param('id');
    const quoteData = await c.req.json();

    await c.env.DB.prepare(
      `UPDATE orders 
       SET status = 'QUOTATION_READY', 
           total_amount_idr = ?,
           dp_amount_idr = ?,
           pelunasan_amount_idr = ?,
           quote_expiry = ? 
       WHERE id = ?`
    ).bind(
      quoteData.totalAmount,
      quoteData.dpAmount,
      quoteData.pelunasanAmount,
      new Date(Date.now() + (quoteData.validityHours || 24) * 60 * 60000).toISOString(),
      orderId
    ).run();

    if (quoteData.items) {
      for (const [itemId, price] of Object.entries(quoteData.items)) {
        await c.env.DB.prepare(`UPDATE order_items SET subtotal = ? WHERE id = ?`)
          .bind(Number(price), itemId).run();
      }
    }

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Admin fetching all orders
app.put('/orders/:id/issue', async (c) => {
  try {
    const orderId = c.req.param('id');
    await c.env.DB.prepare(
      `UPDATE orders SET status = 'ISSUED' WHERE id = ?`
    ).bind(orderId).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
app.get('/orders', async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get a single order
app.get('/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { results: orders } = await c.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).all();
    if (orders.length === 0) return c.json({ success: false, error: 'Not found' }, 404);

    const { results: items } = await c.env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(id).all();
    return c.json({ success: true, data: { ...orders[0], items } });
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

export default app;
