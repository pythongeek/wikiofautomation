import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const DB_PATH = process.env.DB_PATH || join(process.cwd(), 'data/admin.db');

let _sqlite: Database.Database | null = null;
let _db: BetterSQLite3Database<typeof schema> | null = null;

function ensureDataDir() {
  try {
    mkdirSync(dirname(DB_PATH), { recursive: true });
  } catch {}
}

function safeAddColumn(sqlite: Database.Database, table: string, colDef: string) {
  try {
    sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${colDef};`);
  } catch {
    // Column already exists
  }
}

function getRawConnection(): Database.Database {
  if (_sqlite) return _sqlite;
  ensureDataDir();
  _sqlite = new Database(DB_PATH);
  _sqlite.pragma('journal_mode = WAL');
  _sqlite.pragma('foreign_keys = ON');
  _sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      tier TEXT DEFAULT 'free',
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      session_token TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS wiki_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT,
      status TEXT DEFAULT 'draft',
      last_updated INTEGER,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      type TEXT,
      pricing TEXT DEFAULT 'free',
      visibility TEXT DEFAULT 'free',
      node_count INTEGER,
      lemon_variant_id TEXT,
      lemon_checkout_url TEXT,
      vault_asset TEXT,
      original_author TEXT,
      original_url TEXT,
      attribution TEXT,
      price INTEGER DEFAULT 0,
      creator_email TEXT,
      status TEXT DEFAULT 'pending',
      published_at INTEGER,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lemon_order_id TEXT NOT NULL UNIQUE,
      buyer_email TEXT NOT NULL,
      item_slug TEXT NOT NULL,
      variant_id TEXT,
      amount_cents INTEGER DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'paid',
      license_key TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS entitlements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_email TEXT NOT NULL,
      item_slug TEXT NOT NULL,
      license_key TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      download_count INTEGER DEFAULT 0,
      max_downloads INTEGER DEFAULT 25,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS listings_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL REFERENCES listings(id),
      submitted_by TEXT NOT NULL,
      submitted_at INTEGER,
      reviewed_at INTEGER,
      reviewer_email TEXT,
      action TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS ada_queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      intent TEXT,
      response TEXT,
      cost_cents INTEGER,
      latency_ms INTEGER,
      user_email TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at INTEGER
    );
  `);

  // Ensure existing DBs have the new columns
  safeAddColumn(_sqlite, 'users', "tier TEXT DEFAULT 'free'");
  safeAddColumn(_sqlite, 'listings', 'slug TEXT');
  safeAddColumn(_sqlite, 'listings', "visibility TEXT DEFAULT 'free'");
  safeAddColumn(_sqlite, 'listings', 'node_count INTEGER');
  safeAddColumn(_sqlite, 'listings', 'lemon_variant_id TEXT');
  safeAddColumn(_sqlite, 'listings', 'lemon_checkout_url TEXT');
  safeAddColumn(_sqlite, 'listings', 'vault_asset TEXT');

  return _sqlite;
}

export function getDb(): BetterSQLite3Database<typeof schema> {
  if (_db) return _db;
  _db = drizzle(getRawConnection(), { schema });
  return _db;
}

export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

export { schema };
