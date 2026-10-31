---
title: "Unsloth"
bangla_title: "আনস্লথ (Unsloth)"
category: "frameworks"
tags: ["fine-tuning", "qlora", "triton", "gguf", "colab", "kaggle"]
created: "2026-10-18"
updated: "2026-11-01"
summary: "Unsloth is an open-source LLM fine-tuning engine written in OpenAI Triton kernels that speeds up LoRA/QLoRA and GRPO training by 2x while reducing GPU VRAM usage by up to 68%."
bangla_summary: "আনস্লথ হলো ওপেনএআই ট্রাইটন কার্নেলে লেখা একটি এলএলএম ফাইন-টিউনিং ইঞ্জিন যা ২ গুণ দ্রুত কাজ করে এবং ৬৮% ভি-র‍্যাম সাশ্রয় করে।"
sources:
  - title: "Unsloth GitHub Repository"
    url: "https://github.com/unslothai/unsloth"
infobox:
  kind: "LLM Fine-Tuning & Quantization Framework"
  license: "Apache-2.0"
  first_release: "2023-11"
  language: "Python / OpenAI Triton"
  repo: "https://github.com/unslothai/unsloth"
  site: "https://unsloth.ai"
---

## Overview

**Unsloth** replaces standard PyTorch autograd passes for RoPE embeddings, RMSNorm, cross-entropy loss, and MLP layers with hand-written **OpenAI Triton** kernels. This allows developers to fine-tune 8B–14B models on a single free 15GB Google Colab T4 GPU and export quantized `Q4_K_M` GGUF files directly to Ollama.

