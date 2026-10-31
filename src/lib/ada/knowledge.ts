/**
 * src/lib/ada/knowledge.ts — Dynamic Knowledge Engine for Ada AI with Strict Free-Only Isolation Wall.
 *
 * SECURITY RULE (HARD ENFORCED):
 * Free users querying Ada AI must NEVER receive information about paid tools, paid workflows,
 * or gated products. Only items with `pricing === 'free'` and `visibility !== 'paid'` are indexed here.
 */
import { db } from '~/lib/db';
import { listings, wiki_entries } from '~/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import n8nCatalog from '~/data/n8n-catalog.json';
import type { RagChunk } from './rag';

export interface SiteRouteInfo {
  path: string;
  title: string;
  description: string;
  category: string;
}

export const SITE_ROUTES: SiteRouteInfo[] = [
  { path: '/', title: 'Homepage', description: 'Central hub with Ada AI search, live stats, free automation spotlights, and daily news.', category: 'navigation' },
  { path: '/wiki', title: 'Encyclopedia of Automation', description: 'Reference entries on agent frameworks, n8n nodes, LLMs, protocols (MCP, A2A), Ollama, Unsloth, Qwen 3, and AEO/GEO.', category: 'wiki' },
  { path: '/wiki/compare', title: 'Automation Comparisons', description: 'Side-by-side comparison matrices for automation tools, protocols, and agent frameworks.', category: 'wiki' },
  { path: '/notebooks', title: 'Ready Kaggle & Colab GPU Notebooks', description: 'Free reproducible GPU notebooks for Qwen 3.8 27B Vision servers, Kaggle Dual-T4 30GB vLLM, Unsloth QLoRA fine-tuning, and synthetic training data distillation.', category: 'notebooks' },
  { path: '/local-ai', title: 'Local AI Free Methods Hub & VRAM Calculator', description: 'Run zero-cost local LLMs with Ollama, llama.cpp, Locally Uncensored, and free Cloudflare reverse tunnel relays. Includes interactive VRAM & GGUF quantization matrix.', category: 'local-ai' },
  { path: '/models/finetuned', title: 'Trained & Fine-Tuned AI Models Catalog', description: 'Domain-specialized fine-tuned models (GGUF/AWQ) for strict JSON/MCP calling, uncensored reasoning, AEO publishing, n8n workflow codegen, OCR extraction, and air-gapped medical/legal triage.', category: 'finetuned-models' },
  { path: '/marketplace', title: 'Automation Marketplace (Free Community Vault)', description: 'Discover free AI agents, 5,762 verified current community n8n workflows, free WordPress MCP Gateway plugin, and prompt packs.', category: 'marketplace' },
  { path: '/academy', title: 'Automation Academy', description: 'Free interactive courses and lessons on building autonomous agents, MCP servers, and n8n pipelines.', category: 'academy' },
  { path: '/seo-tools', title: 'Free SEO & AEO Schema Tools', description: 'Free JSON-LD schema generator, AEO answer-first auditor, and schema gap analyzer.', category: 'seo-tools' },
  { path: '/news', title: 'Automation Newsroom', description: 'Daily launches, model benchmarks, protocol releases, and deep dives.', category: 'news' },
];

/**
 * Fetches dynamic knowledge chunks from SQLite + Free n8n Workflow Catalog + Site Routes.
 * HARD FREE-ONLY WALL: Strictly filters out any paid or gated listings.
 */
export async function getDbKnowledgeChunks(): Promise<RagChunk[]> {
  const chunks: RagChunk[] = [];

  try {
    // 1. Fetch ONLY FREE published marketplace listings from SQLite DB
    const dbListings = await db
      .select()
      .from(listings)
      .where(eq(listings.status, 'published'))
      .orderBy(desc(listings.created_at))
      .limit(100);

    for (const item of dbListings) {
      const pricingLower = String(item.pricing || 'free').toLowerCase();
      const visibilityLower = String(item.visibility || 'free').toLowerCase();
      const numericPrice = Number(item.price || 0);

      // HARD SECURITY GATE: Never include paid or gated items in Ada's knowledge base
      if (
        pricingLower !== 'free' ||
        visibilityLower === 'paid' ||
        numericPrice > 0
      ) {
        continue;
      }

      const cat = item.category || 'general';
      const authorText = item.original_author ? `by ${item.original_author}` : '';

      chunks.push({
        slug: `db-listing-${item.id}`,
        category: cat,
        kind: 'marketplace',
        title: item.title,
        snippet: `[FREE] ${authorText} ${item.description || ''} (Attribution: ${item.attribution || 'Open'}).`.trim(),
        url: item.original_url || `/marketplace`,
        score: 0,
      });
    }
  } catch (err) {
    console.error('[knowledge] Failed to query SQLite listings:', err instanceof Error ? err.message : err);
  }

  try {
    // 2. Fetch database wiki entries (all wiki entries are free public knowledge)
    const dbWikiEntries = await db
      .select()
      .from(wiki_entries)
      .orderBy(desc(wiki_entries.last_updated))
      .limit(100);

    for (const entry of dbWikiEntries) {
      chunks.push({
        slug: entry.slug,
        category: entry.category || 'general',
        kind: 'wiki',
        title: entry.title,
        snippet: `Wiki entry on ${entry.title}. Category: ${entry.category || 'general'}.`,
        url: `/wiki/${entry.category || 'general'}/${entry.slug}`,
        score: 0,
      });
    }
  } catch (err) {
    console.error('[knowledge] Failed to query SQLite wiki entries:', err instanceof Error ? err.message : err);
  }

  // 3. Index ONLY the Curated Free n8n Workflows from n8n-catalog.json (NEVER enterprise_workflows)
  for (const wf of n8nCatalog.free_workflows) {
    if (wf.pricing !== 'free') continue;
    chunks.push({
      slug: wf.slug,
      category: wf.category,
      kind: 'marketplace',
      title: `${wf.title} (Free ${wf.total_nodes}-Node n8n Workflow)`,
      snippet: `[FREE N8N WORKFLOW] ${wf.title} in category ${wf.category}. Contains ${wf.total_nodes} nodes (${wf.node_types.join(', ')}). Verified current n8n JSON export available for free download.`,
      url: `/api/download/${wf.slug}`,
      score: 0,
    });
  }

  // 4. Add Site Route Knowledge Chunks
  for (const route of SITE_ROUTES) {
    chunks.push({
      slug: `route-${route.path.replace(/\//g, '-') || 'home'}`,
      category: route.category,
      kind: 'wiki',
      title: route.title,
      snippet: `Website section ${route.path}: ${route.description}`,
      url: route.path,
      score: 0,
    });
  }

  return chunks;
}
