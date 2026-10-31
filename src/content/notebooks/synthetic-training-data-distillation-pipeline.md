---
title: "Trained Data Pipeline: Magpie Synthetic Reasoning Distillation & MinHash Corpus Scrubber"
category: "training-data"
platform: "both"
gpu_required: "CPU High-RAM or Free T4 GPU"
vram_gb: 8
base_model: "Any Frontier Teacher -> Domain SLM Student"
method: "Magpie Zero-Seed Synthesis + MinHash LSH Dedup + LLM-as-Judge Quality Filter + DPO Pair Builder"
pricing: "free"
price_usd: 0
colab_url: "https://colab.research.google.com/#create=true"
kaggle_url: "https://www.kaggle.com/code"
keep_alive_included: true
summary: "Complete training-data curation notebook: builds high-signal instruction & reasoning trace datasets (ShareGPT/ChatML), removes near-duplicates via MinHash LSH, scrubs PII/secrets, and formats DPO/GRPO preference pairs."
tags: ["training-data", "synthetic-data", "distillation", "magpie", "dpo", "grpo", "dataset-curation"]
run_steps:
  - "Ingest raw domain documents (Markdown, PDFs, n8n workflows, or support tickets) in Cell 1."
  - "Run the Magpie / Teacher Synthesis pipeline in Cell 2 to generate multi-step <think> reasoning traces + verified JSON outputs."
  - "Run MinHash LSH (128 permutations, Jaccard threshold 0.82) in Cell 3 to eliminate near-duplicate samples."
  - "Run the Deterministic Validator + Rubric Scorer (1–5 scale) in Cell 4 to keep only top-quartile samples (score >= 4.2)."
  - "Export clean ShareGPT JSONL (for SFT) and Chosen/Rejected pairs (for DPO/GRPO) to HuggingFace Hub or Google Drive."
data_sources:
  - "https://huggingface.co/datasets"
updated: "2026-11-01"
---

## Why Data Curation Beats Model Size (The 2026 Nemotron & DeepSeek Lesson)

Modern benchmarks ( including the **NVIDIA Nemotron Reasoning Challenge** and **DeepSeek-R1 distillation studies**) prove that **10,000 rigorously deduplicated, rubric-filtered synthetic reasoning traces** outperform 500,000 noisy scraped examples when fine-tuning 7B–32B models.

### 4-Stage Data Curation Pipeline Included in This Notebook

1. **Stage 1 — Schema-Constrained Teacher Synthesis:** Generates diverse user prompts and pairs them with verified `<think>...</think>` reasoning chains and syntax-checked outputs (SQL, Python, n8n JSON, or clinical/legal triage).
2. **Stage 2 — MinHash LSH Semantic Deduplication:** Prevents mode collapse by stripping clusters of repetitive prompts.
3. **Stage 3 — Hard Secret & PII Scrubber:** Uses our 8-pattern regex engine (`sk-`, `eyJ`, `Bearer`, `AIza`, emails, phone numbers) so training corpora never memorize credentials.
4. **Stage 4 — DPO / GRPO Preference Pair Formatter:** Automatically pairs verified outputs (`chosen`) against syntax-failing or low-rubric outputs (`rejected`) for alignment tuning.

