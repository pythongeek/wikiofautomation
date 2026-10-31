-- Supabase/pgvector Setup for Wiki of Automation
-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Documents table with vector column (768 dimensions for bge-base-en-v1.5)
create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  embedding vector(768),
  metadata jsonb default '{}',
  source text not null,
  source_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(source, source_id)
);

-- 3. Similarity search function
create or replace function match_documents(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_source text default null
)
returns table(
  id uuid,
  content text,
  metadata jsonb,
  similarity float
) language plpgsql as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where documents.embedding <=> query_embedding < 1 - match_threshold
    and (filter_source is null or documents.source = filter_source)
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 4. Auto-update timestamp trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_documents_updated_at
  before update on documents
  for each row
  execute function update_updated_at_column();

-- 5. Sync log table
create table if not exists sync_log (
  id uuid default gen_random_uuid() primary key,
  document_id text not null,
  action text not null,
  status text not null,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Navigation events tracking
create table if not exists navigation_events (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  from_page text not null,
  to_page text not null,
  converted boolean default false,
  timestamp timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Form submissions / conversions
create table if not exists form_submissions (
  id uuid default gen_random_uuid() primary key,
  page_id text,
  product_id text,
  value numeric,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes
create index if not exists idx_documents_source on documents(source, source_id);
create index if not exists idx_sync_log_status on sync_log(status);
create index if not exists idx_navigation_events_timestamp on navigation_events(timestamp);
