---
title: "AEO-Citation-Writer-14B (Generative Engine Optimization & Schema.org SLM)"
use_case: "seo-aeo-publishing"
base_model: "Qwen/Qwen2.5-14B-Instruct"
parameter_size: "14.8B"
tuning_method: "DPO Alignment on 22,000 Top-Cited Perplexity, ChatGPT & AI Overview Passages"
quant_formats: ["Q4_K_M (8.9 GB)", "Q6_K (12.1 GB)"]
vram_required_gb: 10
benchmark_delta: "+340% Verbatim Citation Extraction Rate in Perplexity & SearchGPT Evaluations"
ollama_run_cmd: "ollama run qwen2.5:14b"
colab_notebook_slug: "synthetic-training-data-distillation-pipeline"
pricing: "free"
summary: "Specialized editorial & schema SLM trained to write 40-word answer-first H2 blocks, quantitative comparison tables, and valid TechArticle + FAQPage JSON-LD graphs for WordPress and DirectRelay Pro."
tags: ["aeo", "geo", "seo", "json-ld", "perplexity", "content-generation"]
updated: "2026-11-01"
---

## Engineered for AI Answer Engines (AEO / GEO)

Generic LLMs write fluffy introductions ("In today's fast-paced digital world...") that AI search crawlers skip. This fine-tune enforces the exact structural patterns cited by Perplexity, Claude, and Google AI Overviews:
- **Answer-First H2 Leads:** 35–50 word high-density factual summaries immediately following every heading.
- **Entity-Linked JSON-LD:** Emits sanitized `@graph` blocks (`TechArticle`, `FAQPage`, `SoftwareApplication`).

