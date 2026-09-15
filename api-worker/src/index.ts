import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes
app.use('/*', cors({
  origin: '*', // In production, you might want to restrict this
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

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
    await c.env.DB.prepare("DELETE FROM products").run();
    await c.env.DB.prepare(
      `INSERT INTO products (id, title, icon, requires_pax, form_schema) VALUES 
      ('HOTEL', 'Hotel', 'Building2', 1, '[{"type":"HotelSpecsModule"}]'), 
      ('FLIGHT', 'Tiket Pesawat', 'Plane', 1, '[{"type":"FlightLogicModule"}]'), 
      ('BAGGAGE', 'Bagasi', 'Briefcase', 0, '[{"type":"BaggageModule"}]'), 
      ('VISA', 'Visa', 'Ticket', 1, '[{"type":"VisaModule"}]'), 
      ('TRANS_AIRPORT', 'Transportasi Bandara', 'Car', 1, '[{"type":"TransAirportModule"}]'), 
      ('TRANS_TOUR', 'Transportasi Tour', 'Bus', 1, '[{"type":"TransTourModule"}]')`
    ).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});


// -- Orders API --

app.post('/orders', async (c) => {
  try {
    const formData = await c.req.json();
    
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
    const tokenExpiry = new Date(Date.now() + 20 * 60000).toISOString();
    
    await c.env.DB.prepare(
      `INSERT INTO orders (id, client_name, client_whatsapp, status, verification_token, token_expiry) 
       VALUES (?, ?, ?, 'AWAITING_VERIFICATION', ?, ?)`
    ).bind(
      orderId, 
      formData.name, 
      formData.whatsapp, 
      token, 
      tokenExpiry
    ).run();

    await c.env.DB.prepare(
      `INSERT INTO order_items (order_id, category, specs_json)
       VALUES (?, 'HOTEL', ?)`
    ).bind(
      orderId,
      JSON.stringify({
        pax: formData.pax,
        hotelRating: formData.hotelRating,
        notes: formData.notes
      })
    ).run();

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
           quote_expiry = ? 
       WHERE id = ?`
    ).bind(
      quoteData.totalAmount, 
      new Date(Date.now() + 24 * 60 * 60000).toISOString(), // 24 hours expiry
      orderId
    ).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Admin fetching all orders
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

export default app;
