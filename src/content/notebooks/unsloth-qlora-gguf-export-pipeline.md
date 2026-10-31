---
title: "Unsloth 2x Faster QLoRA Fine-Tuning → Automated GGUF Export & Ollama Modelfile"
category: "fine-tuning"
platform: "both"
gpu_required: "Free T4 (15GB VRAM)"
vram_gb: 12
base_model: "Qwen2.5-14B / Llama-3.1-8B / Mistral-Nemo-12B"
method: "Unsloth 4-bit QLoRA (Rank 16, Triton Kernels) + Direct GGUF Q4_K_M Quantizer"
pricing: "free"
price_usd: 0
colab_url: "https://colab.research.google.com/#create=true"
kaggle_url: "https://www.kaggle.com/code"
keep_alive_included: true
summary: "End-to-end fine-tuning notebook using Unsloth custom Triton kernels (2.2x faster, 68% less VRAM). Trains on ShareGPT/Alpaca JSONL, merges LoRA adapters, exports Q4_K_M GGUF, and generates an Ollama Modelfile."
tags: ["unsloth", "qlora", "fine-tuning", "gguf", "ollama", "colab", "kaggle"]
run_steps:
  - "Load your custom ShareGPT or Alpaca JSONL dataset (or pull from HuggingFace Datasets in Cell 2)."
  - "Configure LoRA hyperparameters (r=16, lora_alpha=16, target_modules=['q_proj','k_proj','v_proj','o_proj','gate_proj','up_proj','down_proj'])."
  - "Run SFTTrainer with Unsloth 8-bit AdamW optimizer and cosine learning rate schedule (lr=2e-4)."
  - "Run the sanity-check inference cell to compare before/after structured outputs."
  - "Execute Cell 6 (`model.save_pretrained_gguf(..., quantization_method='q4_k_m')`) to export a ready-to-run GGUF + Ollama Modelfile."
data_sources:
  - "https://github.com/unslothai/unsloth"
updated: "2026-11-01"
---

## From Raw Dataset to Local `ollama run` in 45 Minutes

Standard HuggingFace `peft` + `bitsandbytes` fine-tuning of a 14B model runs out of memory on a 15GB T4 GPU when context length exceeds 2,048 tokens. By rewriting the RoPE, cross-entropy loss, and MLP backpropagation kernels in **OpenAI Triton**, **Unsloth** cuts VRAM usage by **68%** and doubles training throughput with **zero accuracy degradation** (exact math, no approximations).

### Hyperparameter Reference Matrix

| Model Size | Max Context on Free T4 | Recommended `r` (Rank) | Batch Size × Grad Accum | Peak VRAM |
| :--- | :--- | :--- | :--- | :--- |
| **7B / 8B** | `8,192` tokens | `r = 16` or `32` | `2 × 4` (effective 8) | `7.4 GB` |
| **12B / 14B** | `4,096` tokens | `r = 16` | `2 × 4` (effective 8) | `11.8 GB` |
| **27B / 32B (Kaggle 2×T4)** | `4,096` tokens | `r = 16` | `1 × 8` (effective 8) | `22.5 GB` |

