const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map(v => v.trim()).filter(Boolean);

// Middleware
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store' });
  next();
});
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin not allowed'));
}, methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'], maxAge: 600 }));
app.use(express.json({ limit: '16kb', strict: true }));
const buckets = new Map();
app.use('/api', (req, res, next) => {
  const now = Date.now();
  const key = req.ip;
  const bucket = buckets.get(key) || { start: now, count: 0 };
  if (now - bucket.start > 60_000) { bucket.start = now; bucket.count = 0; }
  bucket.count += 1;
  buckets.set(key, bucket);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (now - v.start > 120_000) buckets.delete(k);
  if (bucket.count > 120) return res.status(429).json({ success: false, error: 'Too many requests. Please try again shortly.' });
  next();
});

const validStatuses = new Set(['pending', 'confirmed', 'completed', 'cancelled']);
const text = (value, max, field, required = false) => {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string') throw Object.assign(new Error(`${field} must be text.`), { status: 400 });
  const result = value.trim();
  if (required && !result) throw Object.assign(new Error(`${field} is required.`), { status: 400 });
  if (result.length > max) throw Object.assign(new Error(`${field} must be at most ${max} characters.`), { status: 400 });
  return result;
};
const adminOnly = (req, res, next) => {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected || expected.length < 32 || /^replace[_ -]/i.test(expected)) return res.status(503).json({ success: false, error: 'Staff API is disabled until a strong ADMIN_API_TOKEN is configured.' });
  const provided = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(provided); const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ success: false, error: 'Staff authorization required.' });
  next();
};

// Turns a SQLite UTC timestamp into a label like "3 days ago"
const timeAgo = (value) => {
  const t = Date.parse(String(value).replace(' ', 'T') + 'Z');
  if (Number.isNaN(t)) return 'Recently';
  const seconds = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (seconds < 60) return 'Just now';
  const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [name, size] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${name}${n > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

// 0. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    database: db.getEngine(),
    port: PORT,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 1. Book Appointment + Automated / Fallback Notification
app.post('/api/appointments', async (req, res) => {
  let patient_name, phone, email, service, branch, appointment_date, appointment_time, notes;
  try {
    patient_name = text(req.body.patient_name, 120, 'Patient name', true);
    phone = text(req.body.phone, 32, 'Phone number', true);
    email = text(req.body.email, 254, 'Email');
    service = text(req.body.service, 120, 'Service', true);
    branch = text(req.body.branch || 'Clinic I (Kannakurichi)', 120, 'Branch', true);
    appointment_date = text(req.body.appointment_date, 10, 'Appointment date', true);
    appointment_time = text(req.body.appointment_time || 'Flexible', 40, 'Appointment time', true);
    notes = text(req.body.notes, 1000, 'Notes');
    if (!/^\+?[\d\s().-]{7,20}$/.test(phone)) throw Object.assign(new Error('Enter a valid phone number.'), { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Object.assign(new Error('Enter a valid email address.'), { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(appointment_date) || Number.isNaN(Date.parse(`${appointment_date}T00:00:00Z`))) throw Object.assign(new Error('Enter a valid appointment date.'), { status: 400 });
  } catch (error) { return res.status(error.status || 400).json({ success: false, error: error.message }); }

  try {
    // Generate human-friendly tracking reference
    const bookingReference = `RDC-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Save appointment into database
    const sql = `
      INSERT INTO appointments 
        (booking_reference, patient_name, phone, email, service, branch, appointment_date, appointment_time, notes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      bookingReference,
      patient_name.trim(),
      cleanPhone,
      (email || '').trim(),
      service.trim(),
      branch.trim(),
      appointment_date,
      appointment_time,
      (notes || '').trim(),
      'pending'
    ]);

    res.status(201).json({
      success: true,
      message: 'Appointment successfully scheduled!',
      appointmentId: result.insertId,
      bookingReference,
      data: {
        id: result.insertId,
        booking_reference: bookingReference,
        patient_name: patient_name.trim(),
        phone: cleanPhone,
        email: (email || '').trim(),
        service: service.trim(),
        branch: branch.trim(),
        appointment_date,
        appointment_time,
        notes: (notes || '').trim(),
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('[Error: /api/appointments POST]', error);
    res.status(500).json({ success: false, error: 'Database error while saving appointment.' });
  }
});

// 2. Fetch Appointments (with optional search, status, and date filters)
app.get('/api/appointments', adminOnly, async (req, res) => {
  try {
    const { q, status, date } = req.query;
    let sql = 'SELECT * FROM appointments WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (date) {
      sql += ' AND appointment_date = ?';
      params.push(date);
    }
    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      sql += ' AND (patient_name LIKE ? OR phone LIKE ? OR booking_reference LIKE ? OR service LIKE ?)';
      params.push(term, term, term, term);
    }

    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
    const offset = Math.max(0, Number.parseInt(req.query.offset, 10) || 0);
    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, limit, offset, appointments: rows });
  } catch (error) {
    console.error('[Error: /api/appointments GET]', error);
    res.status(500).json({ success: false, error: 'Could not fetch appointments.' });
  }
});

// 3. Appointment Analytics / Stats for Staff Dashboard
app.get('/api/appointments/stats', adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT COUNT(*) AS total,
      SUM(CASE WHEN appointment_date = date('now') THEN 1 ELSE 0 END) AS today,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
      FROM appointments`);
    const stats = Object.fromEntries(Object.entries(rows[0]).map(([key, value]) => [key, Number(value || 0)]));

    res.json({ success: true, stats });
  } catch (error) {
    console.error('[Error: /api/appointments/stats]', error);
    res.status(500).json({ success: false, error: 'Could not fetch appointment statistics.' });
  }
});

// 4. Update Appointment Status
app.patch('/api/appointments/:id/status', adminOnly, async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!/^\d+$/.test(id) || !validStatuses.has(status) || (notes !== undefined && (typeof notes !== 'string' || notes.length > 1000))) return res.status(400).json({ success: false, error: 'A valid appointment ID, status, and notes are required.' });

  try {
    const [result] = await db.execute(notes !== undefined ? 'UPDATE appointments SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?' : 'UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', notes !== undefined ? [status, notes.trim(), id] : [status, id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, error: 'Appointment not found.' });
    res.json({ success: true, message: `Appointment #${id} updated to ${status}.` });
  } catch (error) {
    console.error('[Error: /api/appointments/:id/status]', error);
    res.status(500).json({ success: false, error: 'Failed to update appointment status.' });
  }
});

// 5. Delete Appointment
app.delete('/api/appointments/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    if (!/^\d+$/.test(id)) return res.status(400).json({ success: false, error: 'Invalid appointment ID.' });
    const [result] = await db.execute('DELETE FROM appointments WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, error: 'Appointment not found.' });
    res.json({ success: true, message: `Appointment #${id} deleted successfully.` });
  } catch (error) {
    console.error('[Error: /api/appointments/:id DELETE]', error);
    res.status(500).json({ success: false, error: 'Failed to delete appointment.' });
  }
});

// 6. Fetch reviews (real data from SQLite only)
app.get('/api/reviews', async (req, res) => {
  try {
    const [summaryRows] = await db.query('SELECT COUNT(*) AS count, AVG(rating) AS avg FROM reviews');
    const summary = summaryRows[0] || {};
    const [rows] = await db.query('SELECT id, author_name, rating, comment, created_at FROM reviews ORDER BY id DESC LIMIT 100');
    const count = Number(summary.count || 0);
    const avgRating = count ? Number(Number(summary.avg).toFixed(1)) : 0;

    res.json({
      success: true,
      source: 'database',
      data: {
        name: 'Royal Dental Care',
        rating: avgRating,
        userRatingCount: count,
        reviews: rows.map(r => ({
          id: r.id,
          authorAttribution: { displayName: r.author_name, photoURI: '' },
          rating: Number(r.rating),
          relativePublishTimeDescription: timeAgo(r.created_at),
          text: { text: r.comment },
          createdAt: r.created_at
        }))
      }
    });
  } catch (error) {
    console.error('[Error: /api/reviews GET]', error);
    res.status(500).json({ success: false, error: 'Could not fetch reviews.' });
  }
});

// 7. Staff: list all reviews
app.get('/api/admin/reviews', adminOnly, async (req, res) => {
  try {
    const [reviews] = await db.query('SELECT * FROM reviews ORDER BY id DESC');
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error('[Error: /api/admin/reviews GET]', error);
    res.status(500).json({ success: false, error: 'Could not fetch database reviews.' });
  }
});

// 8. Submit a review (saved to SQLite)
app.post('/api/reviews', async (req, res) => {
  const { author_name, rating, comment } = req.body;

  let cleanName, cleanComment;
  try {
    cleanName = text(author_name, 120, 'Author name', true);
    cleanComment = text(comment, 2000, 'Review comment', true);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  const validRating = (typeof rating === 'number' || typeof rating === 'string')
    && Number.isInteger(Number(rating)) && Number(rating) >= 1 && Number(rating) <= 5;
  if (!validRating) {
    return res.status(400).json({ success: false, error: 'Rating must be a whole number from 1 to 5.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO reviews (author_name, rating, comment, verified) VALUES (?, ?, ?, 0)',
      [cleanName, Number(rating), cleanComment]
    );
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      reviewId: result.insertId
    });
  } catch (error) {
    console.error('[Error: /api/reviews POST]', error);
    res.status(500).json({ success: false, error: 'Failed to submit review.' });
  }
});

// 9. Contact Enquiries
app.post('/api/contact', async (req, res) => {
  const { name, phone, email = '', subject = 'General Inquiry', message } = req.body;

  let cleanName, cleanPhone, cleanEmail, cleanSubject, cleanMessage;
  try { cleanName = text(name, 120, 'Name', true); cleanPhone = text(phone, 32, 'Phone number', true); cleanEmail = text(email, 254, 'Email'); cleanSubject = text(subject, 160, 'Subject'); cleanMessage = text(message, 2000, 'Message', true); }
  catch (error) { return res.status(400).json({ success: false, error: error.message }); }
  if (!/^\+?[\d\s().-]{7,20}$/.test(cleanPhone)) return res.status(400).json({ success: false, error: 'Enter a valid phone number.' });
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ success: false, error: 'Enter a valid email address.' });

  try {
    const [result] = await db.execute(
      'INSERT INTO contacts (name, phone, email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [cleanName, cleanPhone, cleanEmail, cleanSubject || 'General Inquiry', cleanMessage]
    );

    res.status(201).json({
      success: true,
      message: 'Your message has been sent! Our team will contact you shortly.',
      contactId: result.insertId
    });
  } catch (error) {
    console.error('[Error: /api/contact POST]', error);
    res.status(500).json({ success: false, error: 'Failed to record contact enquiry.' });
  }
});

// 10. Fetch Contact Enquiries
app.get('/api/contacts', adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY id DESC');
    res.json({ success: true, count: rows.length, contacts: rows });
  } catch (error) {
    console.error('[Error: /api/contacts GET]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contact inquiries.' });
  }
});

// Start Express Server
const server = app.listen(PORT, async () => {
  try { await db.ready(); } catch (error) { console.error('[DB] Initialization failed:', error.message); process.exitCode = 1; server.close(); return; }
  console.log(`[Server] Royal Dental Care API running on http://localhost:${PORT}`);
  console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || (error.type === 'entity.parse.failed' ? 400 : 500);
  res.status(status).json({ success: false, error: status === 400 ? 'Invalid request body.' : (status === 403 ? 'Request origin is not allowed.' : 'Internal server error.') });
});