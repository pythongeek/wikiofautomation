-- Supabase Database Webhooks for automatic vector indexing

-- Products table webhook
create trigger product_index_webhook
  after insert or update on products
  for each row
  execute function supabase_functions.http_request(
    'https://wikiofautomation.com/api/webhooks/index-document',
    'POST',
    '{"Content-Type":"application/json","Authorization":"Bearer YOUR_WEBHOOK_SECRET"}',
    '{"table":"products","id":"{{.id}}","action":"{{.event_type}}"}',
    '5000'
  );

-- Blog posts table webhook
create trigger blog_index_webhook
  after insert or update on blog_posts
  for each row
  execute function supabase_functions.http_request(
    'https://wikiofautomation.com/api/webhooks/index-document',
    'POST',
    '{"Content-Type":"application/json","Authorization":"Bearer YOUR_WEBHOOK_SECRET"}',
    '{"table":"blog_posts","id":"{{.id}}","action":"{{.event_type}}"}',
    '5000'
  );

-- Pages table webhook
create trigger page_index_webhook
  after insert or update on pages
  for each row
  execute function supabase_functions.http_request(
    'https://wikiofautomation.com/api/webhooks/index-document',
    'POST',
    '{"Content-Type":"application/json","Authorization":"Bearer YOUR_WEBHOOK_SECRET"}',
    '{"table":"pages","id":"{{.id}}","action":"{{.event_type}}"}',
    '5000'
  );
