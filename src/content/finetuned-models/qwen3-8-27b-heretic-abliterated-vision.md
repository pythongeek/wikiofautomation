---
title: "Qwen 3.8 27B Heretic (Abliterated + Vision GGUF)"
use_case: "uncensored-reasoning"
base_model: "Qwen/Qwen3.8-27B-VL-Instruct"
parameter_size: "27B (+ 800M mmproj Vision)"
tuning_method: "Orthogonal Refusal Direction Abliteration + Vision Projector Alignment"
quant_formats: ["Q4_K_M (16.8 GB)", "Q5_K_M (19.4 GB)", "Q8_0 (28.6 GB)"]
vram_required_gb: 15
benchmark_delta: "0.0% Refusal Rate on Red-Team Prompts · 99.4% Base MMLU-Pro Retention"
ollama_run_cmd: "ollama run hf.co/0bserverx/Qwen3.8-27B-Heretic-Abliterated-Uncensored-GGUF:Q4_K_M"
hf_repo: "https://huggingface.co/0bserverx/Qwen3.8-27B-Heretic-Abliterated-Uncensored-GGUF"
colab_notebook_slug: "qwen3-8-27b-vision-colab-server"
pricing: "free"
summary: "Uncensored 27B multimodal vision + reasoning model engineered via orthogonal weight abliteration. Delivers unrestricted technical analysis, security red-teaming, and high-precision image/document OCR."
tags: ["qwen-3.8", "abliterated", "uncensored", "vision", "gguf", "red-teaming"]
updated: "2026-11-01"
---

## Use-Case Architecture: Unrestricted Reasoning & Multimodal Vision

Standard safety-aligned models frequently reject cybersecurity analysis, competitive intelligence extraction, medical pathology images, and legal discovery documents due to false-positive refusal triggers.

**Qwen 3.8 27B Heretic** removes the refusal subspace via orthogonal activation projection while preserving 99.4% of the base model's coding, math, and multimodal vision capabilities (`mmproj-Q8_0.gguf`).

