/**
 * src/lib/ada/rag.ts — Full-Site Free-Only Vault RAG over all content collections + SQLite Database.
 *
 * HARD SECURITY & ISOLATION RULE:
 * Free users querying Ada AI must NEVER receive information about paid tools, paid workflows,
 * or gated assets. `isFreeEligible(entry)` enforces a strict pre-retrieval wall before scoring.
 */
import { getCollection } from 'astro:content';
import { getDbKnowledgeChunks } from './knowledge';

export interface RagChunk {
  slug: string;
  category: string;
  kind: 'wiki' | 'marketplace' | 'news' | 'notebooks' | 'local-ai' | 'finetuned-models' | 'academy';
  title: string;
  snippet: string;
  url: string;
  score: number;
}

interface GenericEntry {
  slug: string;
  collection?: string;
  id?: string;
  body?: string;
  data: Record<string, unknown>;
}

const STOPWORDS = new Set([
  'the','a','an','and','or','but','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','can','could','will','would','should','may','might','must','to','of','in','on',
  'at','for','with','about','as','by','this','that','these','those','it','its','i','you','we',
  'they','them','us','me','my','your','our','their','what','which','who','how','why','when','where',
  'show','tell','give','find','use','using','please','want','need','like','best','top','good',
]);

const SYNONYMS: Record<string, string[]> = {
  workflow: ['automation', 'pipeline', 'flow', 'n8n'],
  agent: ['bot', 'assistant', 'autonomous', 'agentic'],
  bot: ['agent', 'assistant'],
  llm: ['model', 'language', 'ai', 'qwen', 'llama', 'ollama'],
  mcp: ['model', 'context', 'protocol', 'webmcp'],
  n8n: ['nodemation', 'workflow', 'automation'],
  kaggle: ['notebook', 'colab', 'gpu', 't4', 'dataset', 'competition'],
  colab: ['notebook', 'kaggle', 'gpu', 't4', 'l4'],
  notebook: ['kaggle', 'colab', 'jupyter', 'ipynb'],
  local: ['ollama', 'llamacpp', 'gguf', 'vram', 'offline', 'uncensored'],
  ollama: ['local', 'gguf', 'llamacpp', 'vram'],
  finetune: ['finetuned', 'qlora', 'lora', 'unsloth', 'training', 'distillation'],
  finetuned: ['finetune', 'qlora', 'lora', 'unsloth', 'gguf'],
  unsloth: ['qlora', 'lora', 'finetuned', 'gguf'],
  vram: ['gpu', 'quantization', 'gguf', 'q4', 'memory'],
  free: ['open', 'gratis', 'local'],
  seo: ['aeo', 'geo', 'schema', 'citation'],
};

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function bigrams(tokens: string[]): string[] {
  const bi: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bi.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bi;
}

function expandWithSynonyms(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const tok of tokens) {
    const syns = SYNONYMS[tok];
    if (syns) {
      for (const s of syns) {
        if (!s.includes(' ')) expanded.add(s);
      }
    }
  }
  return Array.from(expanded);
}

function collapse(s: string): string {
  return s.replace(/\s+/g, ' ').slice(0, 420);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makeSnippet(body: string | undefined, summary: string, queryTokens: string[]): string {
  const raw = `${summary ? summary + ' — ' : ''}${body || ''}`;
  const text = raw.replace(/```[^`]*```/g, ' ').replace(/[#*_]/g, ' ');
  for (const tok of queryTokens) {
    const idx = text.toLowerCase().indexOf(tok);
    if (idx >= 0) {
      const start = Math.max(0, idx - 80);
      const end = Math.min(text.length, idx + 320);
      let snip = text.slice(start, end).trim();
      if (start > 0) snip = '… ' + snip;
      if (end < text.length) snip = snip + ' …';
      return collapse(snip);
    }
  }
  return collapse(text.slice(0, 400));
}

/**
 * HARD PRE-RETRIEVAL FREE-ONLY ISOLATION FILTER:
 * Returns true ONLY if the content item is 100% free and public.
 * Any item with `pricing !== 'free'`, `visibility === 'paid'`, `price_usd > 0`, or `gated === true` is rejected.
 */
export function isFreeEligible(entry: GenericEntry): boolean {
  const d = entry.data;
  if (typeof d.pricing === 'string' && d.pricing.toLowerCase() !== 'free') {
    return false;
  }
  if (typeof d.visibility === 'string' && d.visibility.toLowerCase() === 'paid') {
    return false;
  }
  if (typeof d.price_usd === 'number' && d.price_usd > 0) {
    return false;
  }
  if (d.gated === true) {
    return false;
  }
  if (typeof d.type === 'string' && (d.type === 'enterprise-workflow' || d.type === 'turnkey-game' || d.type === 'notebook-kit')) {
    return false;
  }
  return true;
}

function urlFor(entry: GenericEntry, kind: RagChunk['kind']): string {
  const d = entry.data;
  if (kind === 'wiki') {
    const cat = typeof d.category === 'string' ? d.category : 'concepts';
    return `/wiki/${cat}/${entry.slug}`;
  }
  if (kind === 'notebooks') {
    return `/notebooks/${entry.slug}`;
  }
  if (kind === 'local-ai') {
    return `/local-ai/${entry.slug}`;
  }
  if (kind === 'finetuned-models') {
    return `/models/finetuned/${entry.slug}`;
  }
  if (kind === 'news') {
    return `/news/${entry.slug}`;
  }
  if (kind === 'academy') {
    return `/academy`;
  }
  // Marketplace free items: use pluralized type route
  const rawType = typeof d.type === 'string' ? d.type : 'workflow';
  const typeParam = rawType === 'ai-os' ? 'ai-os' : `${rawType}s`;
  return `/marketplace/${typeParam}/${entry.slug}`;
}

function scoreText(
  haystack: string,
  title: string,
  summary: string,
  qTokens: string[],
  qBigrams: string[],
): number {
  let score = 0;
  const haystackLower = haystack.toLowerCase();
  const titleLower = title.toLowerCase();
  const summaryLower = summary.toLowerCase();

  for (const tok of qTokens) {
    if (!tok) continue;
    if (titleLower.includes(tok)) score += 6;
    if (summaryLower.includes(tok)) score += 3;
    const matches = haystackLower.match(new RegExp(`\\b${escapeRe(tok)}\\b`, 'g'));
    score += Math.min(matches ? matches.length : 0, 5);
  }

  for (const bi of qBigrams) {
    if (titleLower.includes(bi)) score += 12;
    if (summaryLower.includes(bi)) score += 8;
    if (haystackLower.includes(bi)) score += 4;
  }

  for (const tok of qTokens) {
    if (titleLower === tok || titleLower.replace(/[^a-z0-9]/g, '') === tok.replace(/[^a-z0-9]/g, '')) {
      score += 15;
    }
  }

  return score;
}

async function safeGetCollection(name: string): Promise<GenericEntry[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = await getCollection(name as any);
    return items as unknown as GenericEntry[];
  } catch {
    return [];
  }
}

export async function retrieve(query: string, limit = 6): Promise<RagChunk[]> {
  const rawTokens = tokenize(query);
  if (rawTokens.length === 0) return [];

  const qTokens = expandWithSynonyms(rawTokens);
  const qBigrams = bigrams(rawTokens);

  const [wiki, mkt, news, notebooks, localAi, finetuned, academy] = await Promise.all([
    safeGetCollection('wiki'),
    safeGetCollection('marketplace'),
    safeGetCollection('news'),
    safeGetCollection('notebooks'),
    safeGetCollection('local-ai'),
    safeGetCollection('finetuned-models'),
    safeGetCollection('academy'),
  ]);

  const bucketed: Array<{ kind: RagChunk['kind']; entries: GenericEntry[] }> = [
    { kind: 'wiki', entries: wiki },
    { kind: 'notebooks', entries: notebooks },
    { kind: 'local-ai', entries: localAi },
    { kind: 'finetuned-models', entries: finetuned },
    { kind: 'marketplace', entries: mkt },
    { kind: 'news', entries: news },
    { kind: 'academy', entries: academy },
  ];

  const scored: RagChunk[] = [];

  // 1. Score Free-Eligible Content Collection Entries
  for (const bucket of bucketed) {
    for (const e of bucket.entries) {
      // HARD SECURITY GATE: Skip any paid/gated item before scoring
      if (!isFreeEligible(e)) continue;

      const d = e.data;
      const title = typeof d.title === 'string' ? d.title : e.slug;
      const summary =
        typeof d.summary === 'string'
          ? d.summary
          : typeof d.description === 'string'
          ? d.description
          : '';
      const body = typeof e.body === 'string' ? e.body : '';
      const tags = Array.isArray(d.tags) ? d.tags.join(' ') : '';
      const extraMeta = [
        d.base_model,
        d.runtime,
        d.use_case,
        d.hardware_target,
        d.ollama_run_cmd,
        d.benchmark_delta,
      ]
        .filter(Boolean)
        .join(' ');

      const haystack = `${title} ${summary} ${body} ${tags} ${extraMeta}`;
      const score = scoreText(haystack, title, summary, qTokens, qBigrams);
      if (score <= 0) continue;

      const category =
        typeof d.category === 'string'
          ? d.category
          : typeof d.use_case === 'string'
          ? d.use_case
          : typeof d.runtime === 'string'
          ? d.runtime
          : bucket.kind;

      scored.push({
        slug: e.slug,
        category,
        kind: bucket.kind,
        title,
        snippet: makeSnippet(body, summary, rawTokens),
        url: urlFor(e, bucket.kind),
        score,
      });
    }
  }

  // 2. Score SQLite Free Listings, Free n8n Workflows & Site Routes
  try {
    const dbChunks = await getDbKnowledgeChunks();
    for (const chunk of dbChunks) {
      const score = scoreText(
        `${chunk.title} ${chunk.snippet}`,
        chunk.title,
        chunk.snippet,
        qTokens,
        qBigrams,
      );
      if (score > 0) {
        scored.push({ ...chunk, score });
      }
    }
  } catch (err) {
    console.error('[rag] DB Knowledge Retrieval Error:', err instanceof Error ? err.message : err);
  }

  scored.sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const uniqueScored: RagChunk[] = [];
  for (const item of scored) {
    if (!seen.has(item.url)) {
      seen.add(item.url);
      uniqueScored.push(item);
    }
  }

  return uniqueScored.slice(0, limit);
}
