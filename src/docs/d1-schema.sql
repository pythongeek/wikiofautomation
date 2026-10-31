-- Cloudflare D1 Schema for document metadata and sync tracking

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  content_hash TEXT,
  vector_id TEXT,
  chunk_count INTEGER DEFAULT 0,
  last_indexed DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id TEXT,
  action TEXT,
  status TEXT,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE INDEX IF NOT EXISTS idx_documents_source ON documents(source, source_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON sync_log(status);
