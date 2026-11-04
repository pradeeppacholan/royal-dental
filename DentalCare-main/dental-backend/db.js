const fs = require('fs');
const path = require('path');
let engine = 'uninitialized';
let sqliteDb = null;

// Initialize SQLite
function initSqlite() {
  const { DatabaseSync } = require('node:sqlite');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'dental_clinic.db');
  sqliteDb = new DatabaseSync(dbPath);

  // Enable WAL mode for high performance and durability
  sqliteDb.exec('PRAGMA journal_mode = WAL;');
  sqliteDb.exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');

  // Create tables
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_reference TEXT UNIQUE NOT NULL,
      patient_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      service TEXT NOT NULL,
      branch TEXT DEFAULT 'Clinic I (Kannakurichi)',
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_name TEXT NOT NULL,
      rating REAL NOT NULL,
      comment TEXT NOT NULL,
      relative_time TEXT DEFAULT 'Recently',
      verified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Keep older local databases compatible with the current API.
  sqliteDb.exec(`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at);
    CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);`);

  engine = 'sqlite';
  console.log(`[DB] Robust SQLite database active at: ${dbPath}`);
}

// Initialize the single supported database when this module loads.
const initPromise = Promise.resolve().then(initSqlite);

module.exports = {
  ready: () => initPromise,
  getEngine: () => engine,
  query: async (sql, params = []) => {
    await initPromise;
    const isSelect = /^\s*SELECT/i.test(sql);
    const stmt = sqliteDb.prepare(sql);
    if (isSelect) return [stmt.all(...params), []];
    const info = stmt.run(...params);
    return [{ insertId: Number(info.lastInsertRowid), affectedRows: info.changes }, []];
  },
  execute: async (sql, params = []) => {
    await initPromise;
    const isSelect = /^\s*SELECT/i.test(sql);
    const stmt = sqliteDb.prepare(sql);
    if (isSelect) return [stmt.all(...params), []];
    const info = stmt.run(...params);
    return [{ insertId: Number(info.lastInsertRowid), affectedRows: info.changes }, []];
  }
};