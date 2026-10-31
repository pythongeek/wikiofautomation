// lib/supabase-vector.ts
// Supabase pgvector client for vector storage and similarity search.
// Connects to actual Supabase project slpmciqgzcwwnqebuhqe.supabase.co

import { supabaseServer } from './supabase/server';

export async function searchDocuments(queryEmbedding: number[], options: { threshold?: number; count?: number; source?: string } = {}) {
  const { threshold = 0.7, count = 5, source } = options;
  try {
    const { data, error } = await supabaseServer.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: count,
      filter_source: source || null,
    });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[supabase-vector] Search error:', err);
    return [];
  }
}

export async function upsertDocument(content: string, embedding: number[], metadata: Record<string, any>, source: string, sourceId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('documents')
      .upsert({ content, embedding, metadata, source, source_id: sourceId }, { onConflict: 'source,source_id' })
      .select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[supabase-vector] Upsert error:', err);
    return null;
  }
}

export async function deleteDocumentBySource(source: string, sourceId: string) {
  try {
    const { error } = await supabaseServer.from('documents').delete().eq('source', source).eq('source_id', sourceId);
    if (error) throw error;
  } catch (err) {
    console.error(`[supabase-vector] Delete failed for ${source}/${sourceId}:`, err);
  }
}
