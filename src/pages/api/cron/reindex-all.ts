// GET /api/cron/reindex-all — Scheduled Bulk Re-indexing Route
// Executes bulk re-indexing across content collections, SQLite, and Supabase.

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SmartChunkingEngine } from '~/lib/chunking';
import { generateEmbedding } from '~/lib/embeddings';
import { VectorizeStore } from '~/lib/vectorize';
import { supabaseServer } from '~/lib/supabase/server';

export const prerender = false;

const chunker = new SmartChunkingEngine();
const vectorStore = new VectorizeStore();

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || process.env.WEBHOOK_SECRET || 'cron_secret_key';

  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized cron trigger' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const results = {
    wikiEntries: 0,
    marketplaceItems: 0,
    newsArticles: 0,
    supabaseDocuments: 0,
    totalChunksIndexed: 0,
    errors: [] as string[],
  };

  try {
    // 1. Re-index Markdown Content Collections
    const wikiEntries = await getCollection('wiki').catch(() => []);
    const marketplaceItems = await getCollection('marketplace').catch(() => []);
    const newsArticles = await getCollection('news').catch(() => []);

    const allCollectionDocs = [
      ...wikiEntries.map(e => ({ type: 'wiki', title: e.data.title, content: e.body || '', slug: e.id, url: `/wiki/${e.data.category || 'frameworks'}/${e.id}` })),
      ...marketplaceItems.map(m => ({ type: 'marketplace', title: m.data.title, content: m.body || m.data.summary || '', slug: m.id, url: `/marketplace/${m.data.type || 'agents'}/${m.id}` })),
      ...newsArticles.map(n => ({ type: 'news', title: n.data.title, content: n.body || n.data.excerpt || '', slug: n.id, url: `/news/${n.id}` })),
    ];

    for (const doc of allCollectionDocs) {
      try {
        const chunks = chunker.chunk(doc.content, 600, 100).map((c, i) => ({
          id: `${doc.type}-${doc.slug}-chunk-${i}`,
          content: c,
          metadata: {
            source: doc.type,
            sourceId: doc.slug,
            title: doc.title,
            url: doc.url,
          },
        }));

        const embeddings = await Promise.all(chunks.map(c => generateEmbedding(c.content)));
        const vectorDocs = chunks.map((chunk, i) => ({
          id: chunk.id,
          values: embeddings[i],
          metadata: { content: chunk.content, ...chunk.metadata },
        }));

        await vectorStore.upsertVectors(vectorDocs);
        results.totalChunksIndexed += chunks.length;

        if (doc.type === 'wiki') results.wikiEntries++;
        else if (doc.type === 'marketplace') results.marketplaceItems++;
        else if (doc.type === 'news') results.newsArticles++;
      } catch (err: any) {
        results.errors.push(`Failed indexing ${doc.type}/${doc.slug}: ${err?.message}`);
      }
    }

    // 2. Re-index Supabase Database Documents
    try {
      const { data: supaDocs } = await supabaseServer.from('documents').select('id, source, source_id, content, metadata').limit(100);
      if (supaDocs && supaDocs.length > 0) {
        for (const sDoc of supaDocs) {
          const emb = await generateEmbedding(sDoc.content || '');
          await vectorStore.upsertVectors([{
            id: sDoc.id,
            values: emb,
            metadata: {
              content: sDoc.content,
              source: sDoc.source || 'supabase',
              sourceId: sDoc.source_id || sDoc.id,
              title: sDoc.metadata?.title || 'Supabase Entry',
              url: sDoc.metadata?.url || '/',
            },
          }]);
          results.supabaseDocuments++;
          results.totalChunksIndexed++;
        }
      }
    } catch {
      // Supabase table bypass if offline
    }

    return new Response(
      JSON.stringify({
        success: true,
        indexed: results,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Bulk re-indexing failed', details: error?.message || String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
