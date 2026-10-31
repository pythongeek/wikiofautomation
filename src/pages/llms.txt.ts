/**
 * GET /llms.txt — 20-Year Agentic & Generative Engine Discovery Index (AEO/GEO)
 * Exposes all free Wiki entries, Kaggle/Colab Notebooks, Local AI guides, Fine-Tuned Models,
 * and Free Community Workflows in standard llms.txt markdown format.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const [wiki, notebooks, localAi, finetuned, mkt] = await Promise.all([
    getCollection('wiki'),
    getCollection('notebooks'),
    getCollection('local-ai'),
    getCollection('finetuned-models'),
    getCollection('marketplace', (e) => e.data.pricing === 'free' && e.data.status === 'live'),
  ]);

  const lines: string[] = [
    '# Wiki of Automation (wikiofautomation.com)',
    '',
    '> The living encyclopedia and sovereign compute hub for AI agents, reproducible Kaggle & Colab GPU notebooks, zero-cost Local AI inference (Ollama, llama.cpp, vLLM), domain-specific fine-tuned models (Unsloth QLoRA / GGUF), and 9,812 verified n8n workflows.',
    '',
    '## Core Knowledge & Compute Hubs',
    '- [Encyclopedia of Automation](https://wikiofautomation.com/wiki): Reference entries on MCP, LangGraph, AutoGen, n8n, Ollama, Unsloth, Qwen 3, and AEO/GEO.',
    '- [Ready Kaggle & Colab Notebooks](https://wikiofautomation.com/notebooks): One-click reproducible GPU notebooks and synthetic training data distillation pipelines.',
    '- [Local AI Free Methods Hub](https://wikiofautomation.com/local-ai): Hardware VRAM quantization matrix and zero-cost local LLM inference guides.',
    '- [Trained & Fine-Tuned AI Models](https://wikiofautomation.com/models/finetuned): Specialized open-weight GGUF/AWQ fine-tunes with Unsloth recipes and benchmark deltas.',
    '- [Neural Discovery Marketplace & n8n Vault](https://wikiofautomation.com/marketplace): 5,762 verified current community n8n workflows and first-party automation plugins.',
    '',
    '## Ready Kaggle & Colab Notebooks (/notebooks)',
    ...notebooks.map(
      (n) => `- [${n.data.title}](https://wikiofautomation.com/notebooks/${n.id}): ${n.data.summary}`,
    ),
    '',
    '## Local AI Free Methods (/local-ai)',
    ...localAi.map(
      (g) => `- [${g.data.title}](https://wikiofautomation.com/local-ai/${g.id}): ${g.data.summary}`,
    ),
    '',
    '## Trained & Fine-Tuned Models (/models/finetuned)',
    ...finetuned.map(
      (m) =>
        `- [${m.data.title}](https://wikiofautomation.com/models/finetuned/${m.id}): ${m.data.summary} (${m.data.benchmark_delta})`,
    ),
    '',
    '## Encyclopedia Entries (/wiki)',
    ...wiki.map(
      (w) =>
        `- [${w.data.title}](https://wikiofautomation.com/wiki/${w.data.category}/${w.id}): ${w.data.summary}`,
    ),
    '',
    '## Free Community Marketplace Tools (/marketplace)',
    ...mkt.map((item) => {
      const typeParam = item.data.type === 'ai-os' ? 'ai-os' : `${item.data.type}s`;
      return `- [${item.data.title}](https://wikiofautomation.com/marketplace/${typeParam}/${item.id}): ${item.data.summary || ''}`;
    }),
    '',
  ];

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

