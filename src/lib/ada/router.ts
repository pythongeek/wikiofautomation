/**
 * src/lib/ada/router.ts — Intent classifier supporting Wiki, Notebooks, Local AI, Fine-Tuned Models, Marketplace, and News.
 */
import { adaChat } from './client.ts';

export type Intent = 'wiki' | 'marketplace' | 'news' | 'notebooks' | 'local-ai' | 'finetuned-models' | 'general';

const ROUTER_SYSTEM = `
You are the intent router for "Wiki of Automation".
Classify the user's message into one of these intents and return strict JSON:

- "notebooks" — if asking about Kaggle, Google Colab, Jupyter notebooks, T4/L4 GPUs, or synthetic training data pipelines
- "local-ai" — if asking about running AI locally for free, Ollama, llama.cpp, vLLM, VRAM requirements, quantization (GGUF, Q4_K_M), or local relays
- "finetuned-models" — if asking about fine-tuning, Unsloth, QLoRA, specialized/trained models for JSON, OCR, medical/legal, coding, or uncensored models
- "marketplace" — if looking for a free n8n workflow, free agent, or free plugin to download
- "news" — if asking about recent launches, releases, or industry news
- "wiki" — if asking about a general automation concept, framework, protocol (MCP), or comparison
- "general" — greetings, feedback, or off-topic

Return JSON only: {"intent": "wiki" | "marketplace" | "news" | "notebooks" | "local-ai" | "finetuned-models" | "general", "confidence": 0.0-1.0}.
`.trim();

export async function classifyIntent(message: string): Promise<{ intent: Intent; confidence: number; ms: number }> {
  const t0 = Date.now();
  const lower = message.toLowerCase();

  try {
    const res = await adaChat(
      [
        { role: 'system', content: ROUTER_SYSTEM },
        { role: 'user', content: message },
      ],
      { temperature: 0, maxTokens: 80 },
    );
    const raw = res.content.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    const obj = JSON.parse(raw) as { intent?: Intent; confidence?: number };
    if (
      obj.intent &&
      ['wiki', 'marketplace', 'news', 'notebooks', 'local-ai', 'finetuned-models', 'general'].includes(obj.intent)
    ) {
      return {
        intent: obj.intent,
        confidence: typeof obj.confidence === 'number' ? obj.confidence : 0.85,
        ms: Date.now() - t0,
      };
    }
  } catch {
    // Heuristic fallback when LLM API is unreachable or JSON parse fails
  }

  let intent: Intent = 'general';
  if (/(kaggle|colab|notebook|ipynb|dual t4|synthetic data|distillation)/.test(lower)) {
    intent = 'notebooks';
  } else if (/(local ai|ollama|llama\.cpp|vram|quantization|gguf|q4_k_m|offline|free method)/.test(lower)) {
    intent = 'local-ai';
  } else if (/(fine-tun|finetun|qlora|unsloth|abliterated|trained model|use case model)/.test(lower)) {
    intent = 'finetuned-models';
  } else if (/(workflow|template|download|n8n|agent|plugin)/.test(lower)) {
    intent = 'marketplace';
  } else if (/(news|launch|release|today|this week)/.test(lower)) {
    intent = 'news';
  } else if (/(what is|how does|explain|compare|vs|protocol|framework|mcp|aeo)/.test(lower)) {
    intent = 'wiki';
  }

  return { intent, confidence: 0.8, ms: Date.now() - t0 };
}
