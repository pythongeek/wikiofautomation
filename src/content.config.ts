// Content Collections — Astro 7 Content Layer Config (`src/content.config.ts`)
// - wiki: agents, frameworks, protocols, models, companies, concepts
// - marketplace: agent, workflow, enterprise-workflow, plugin, notebook-kit, turnkey-game, ai-os, app, prompt
// - notebooks: Kaggle & Colab ready notebooks + training-data pipelines
// - local-ai: Local AI free methods, runtimes, quantization & hardware guides
// - finetuned-models: Specialized & fine-tuned models by vertical use case
// - news: Daily automation & AI newsroom
// - academy: Courses & tracks

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ─── Wiki entries ──────────────────────────────────────────────────────────
const wikiCategories = ['agents', 'frameworks', 'protocols', 'models', 'companies', 'concepts'] as const;

const wiki = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/wiki' }),
  schema: z.object({
    title: z.string(),
    bangla_title: z.string().optional(),
    category: z.enum(wikiCategories),
    tags: z.array(z.string()).default([]),
    created: z.string(),
    updated: z.string(),
    summary: z.string().max(280).optional(),
    bangla_summary: z.string().optional(),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })).default([]),
    infobox: z.object({
      kind: z.string().optional(),
      license: z.string().optional(),
      first_release: z.string().optional(),
      language: z.string().optional(),
      repo: z.string().optional(),
      site: z.string().optional(),
    }).default({}),
  }),
});

// ─── Marketplace listings ──────────────────────────────────────────────────
const marketplaceTypes = [
  'agent',
  'workflow',
  'enterprise-workflow',
  'plugin',
  'notebook-kit',
  'turnkey-game',
  'ai-os',
  'app',
  'prompt',
] as const;
const marketplacePricing = ['free', 'paid', 'freemium'] as const;

const marketplace = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/marketplace' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(marketplaceTypes),
    pricing: z.enum(marketplacePricing),
    price_label: z.string().optional(),
    price_usd: z.number().nonnegative().optional().default(0),
    lemon_variant_id: z.string().optional(),
    lemon_checkout_url: z.string().optional(),
    vault_asset: z.string().optional(),
    node_count: z.number().int().optional(),
    icon: z.string().optional(),
    uses: z.number().int().nonnegative().default(0),
    rating: z.number().min(0).max(5).default(4.9),
    tags: z.array(z.string()).default([]),
    license: z.string().optional(),
    original_author: z.string(),
    creator_handle: z.string().optional(),
    creator_avatar: z.string().optional(),
    creator_tool_count: z.number().optional().default(1),
    original_url: z.string().optional(),
    attribution: z.string().optional(),
    summary: z.string().max(280).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    hero_image: z.string().optional(),
    works_with: z.array(z.string()).default(['n8n', 'Claude 3.7 Sonnet', 'OpenAI']),
    whats_included: z.array(z.string()).default([
      'Production Workflow JSON / Source Package',
      'Prompt Template & Model Settings',
      'API Key Integration Setup Guide',
      '24/7 Community Support'
    ]),
    changelog: z.array(z.object({
      version: z.string(),
      date: z.string(),
      notes: z.string(),
    })).default([
      { version: '2.0.0', date: '2026-11-01', notes: 'Upgraded to 2026 production specification with full AEO/MCP support.' },
      { version: '1.0.0', date: '2026-08-01', notes: 'Initial public production launch on WikiOfAutomation marketplace.' }
    ]),
    reviews: z.array(z.object({
      author: z.string(),
      handle: z.string().optional(),
      avatar: z.string().optional(),
      rating: z.number(),
      date: z.string(),
      comment: z.string(),
    })).default([
      {
        author: 'Sarah Chen',
        handle: '@schen_ai',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        rating: 5,
        date: '2026-10-24',
        comment: 'Extremely clean architecture. Cut our operational response latency by 85%.'
      },
      {
        author: 'Marcus Vance',
        handle: '@mvance_dev',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
        rating: 4.9,
        date: '2026-10-18',
        comment: 'Worked out of the box on our self-hosted instance. Highly recommended!'
      }
    ]),
    status: z.enum(['draft', 'queued', 'live', 'rejected']).default('live'),
    created: z.string(),
    updated: z.string(),
  }),
});

// ─── Kaggle & Colab Notebooks + Training Data Pipelines ────────────────────
const notebookCategories = [
  'colab-inference',
  'kaggle-competition',
  'fine-tuning',
  'training-data',
  'multimodal-vision',
  'agentic-rag',
] as const;

const notebooks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notebooks' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(notebookCategories),
    platform: z.enum(['colab', 'kaggle', 'both']).default('both'),
    gpu_required: z.string().default('Free T4 (16GB VRAM)'),
    vram_gb: z.number().default(15),
    base_model: z.string(),
    method: z.string(),
    pricing: z.enum(['free', 'paid']).default('free'),
    price_usd: z.number().default(0),
    colab_url: z.string().optional(),
    kaggle_url: z.string().optional(),
    download_ipynb: z.string().optional(),
    keep_alive_included: z.boolean().default(true),
    summary: z.string().max(280),
    tags: z.array(z.string()).default([]),
    run_steps: z.array(z.string()).default([]),
    data_sources: z.array(z.string()).default([]),
    updated: z.string(),
  }),
});

// ─── Local AI Free Methods & Hardware Guides ───────────────────────────────
const localAi = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/local-ai' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['runtime', 'quantization', 'hardware', 'free-tunnel', 'desktop-suite']).default('runtime'),
    runtime: z.string(),
    hardware_target: z.string(),
    vram_min_gb: z.number().default(8),
    quant_recommended: z.string().default('Q4_K_M'),
    tokens_per_sec: z.string().default('35–85 tok/s'),
    pricing: z.enum(['free', 'paid']).default('free'),
    summary: z.string().max(280),
    tags: z.array(z.string()).default([]),
    install_command: z.string().optional(),
    updated: z.string(),
  }),
});

// ─── Trained & Fine-Tuned AI Models for Specific Use Cases ─────────────────
const finetunedModels = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/finetuned-models' }),
  schema: z.object({
    title: z.string(),
    use_case: z.enum([
      'uncensored-reasoning',
      'structured-json-agents',
      'seo-aeo-publishing',
      'code-n8n-generation',
      'vision-ocr-extraction',
      'medical-legal-finance',
    ]),
    base_model: z.string(),
    parameter_size: z.string(),
    tuning_method: z.string(),
    quant_formats: z.array(z.string()).default(['Q4_K_M', 'Q5_K_M', 'Q8_0', 'FP16']),
    vram_required_gb: z.number().default(16),
    benchmark_delta: z.string(),
    ollama_run_cmd: z.string(),
    hf_repo: z.string().optional(),
    colab_notebook_slug: z.string().optional(),
    pricing: z.enum(['free', 'paid']).default('free'),
    summary: z.string().max(280),
    tags: z.array(z.string()).default([]),
    updated: z.string(),
  }),
});

// ─── News posts ────────────────────────────────────────────────────────────
const newsKinds = ['launch', 'deep-dive', 'benchmark', 'digest', 'industry', 'tool', 'opinion'] as const;

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(newsKinds),
    category: z.string().default('LAUNCH'),
    published: z.string(),
    excerpt: z.string().optional(),
    sources: z.array(z.string()).default([]),
    hero_image: z.string().optional(),
    author: z.string().default('Ada'),
    author_avatar: z.string().default('https://api.dicebear.com/7.x/bottts/svg?seed=ada'),
    read_time: z.string().default('4 min read'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    toc: z.array(z.object({
      id: z.string(),
      title: z.string(),
    })).default([]),
    related_wiki: z.array(z.object({
      title: z.string(),
      href: z.string(),
    })).default([
      { title: 'Claude 3.7 Sonnet Model Reference', href: '/wiki/models/claude-3-7-sonnet' },
      { title: 'Model Context Protocol (MCP) Guide', href: '/wiki/protocols/model-context-protocol' }
    ]),
  }),
});

const academy = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/academy' }),
  schema: z.object({
    title: z.string(),
    instructor: z.string().default('Ada Lovelace'),
    instructor_avatar: z.string().default('https://api.dicebear.com/7.x/bottts/svg?seed=ada'),
    rating: z.number().default(4.9),
    enrolled_count: z.string().default('1.4k'),
    price_label: z.string().default('FREE'),
    level: z.string().default('Beginner'),
    duration: z.string().default('2h 30m'),
    lessons_count: z.number().default(8),
    tool_tag: z.string().default('n8n'),
    tags: z.array(z.string()).default(['FREE', 'n8n', 'claude']),
    thumbnail: z.string().default('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'),
    what_youll_learn: z.array(z.string()).default([
      'Build end-to-end autonomous agent workflows in n8n',
      'Integrate Model Context Protocol (MCP) tool servers',
      'Configure error fallback and self-healing nodes',
      'Deploy production-ready Docker microservices'
    ]),
    lessons: z.array(z.object({
      number: z.number(),
      title: z.string(),
      duration: z.string(),
      gated: z.boolean().default(false),
      completed: z.boolean().default(false)
    })).default([
      { number: 1, title: 'Course Orientation & Architecture Overview', duration: '12m', gated: false, completed: true },
      { number: 2, title: 'Setting Up Your Self-Hosted n8n Instance', duration: '25m', gated: false, completed: true },
      { number: 3, title: 'Connecting Claude 3.7 Sonnet LLM Reasoning Nodes', duration: '18m', gated: false, completed: false },
      { number: 4, title: 'Building Custom MCP Server Tools', duration: '30m', gated: true, completed: false },
      { number: 5, title: 'Error Recovery & Human-in-the-Loop Triggers', duration: '22m', gated: true, completed: false }
    ])
  })
});

export const collections = {
  wiki,
  marketplace,
  notebooks,
  'local-ai': localAi,
  'finetuned-models': finetunedModels,
  news,
  academy,
};

