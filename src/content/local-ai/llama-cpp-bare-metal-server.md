---
title: "llama.cpp & llama-server — Bare-Metal GGUF Quantization & GPU/CPU Layer Splitting"
category: "runtime"
runtime: "llama.cpp (llama-server)"
hardware_target: "NVIDIA CUDA, AMD ROCm, Apple Metal, Vulkan, CPU AVX-512"
vram_min_gb: 4
quant_recommended: "Q4_K_M / IQ4_XS"
tokens_per_sec: "50–135 tok/s"
pricing: "free"
summary: "Maximum tokens/sec and granular GPU layer offloading (-ngl) using llama.cpp's native C/C++ llama-server with speculative decoding, grammar-constrained JSON, and multimodal mmproj vision."
tags: ["llama-cpp", "gguf", "quantization", "cuda", "speculative-decoding", "vision"]
install_command: "llama-server -m model-Q4_K_M.gguf -ngl 99 -c 16384 --flash-attn --port 8080"
updated: "2026-11-01"
---

## When to Choose `llama-server` Over Ollama

While Ollama is great for quick model switching, **`llama-server` (`llama.cpp`)** gives you direct control over:
1. **Granular Layer Offloading (`-ngl N`):** Run a 27B/32B model on an 8GB or 15GB GPU by placing exact layer counts in VRAM and streaming the rest from dual-channel DDR5 RAM.
2. **Speculative Decoding (`-md draft-0.5B.gguf`):** Use a tiny 0.5B/1.5B draft model to achieve **1.8x–2.4x faster generation** on code and JSON tasks with mathematically identical output distribution.
3. **GBNF Grammar-Enforced JSON:** Guarantees 100% valid JSON schema compliance at the token-sampling level—even on 3B–7B models.
4. **Multimodal Vision (`--mmproj`):** Attach vision projectors (`mmproj-Q8_0.gguf`) for local OCR and image reasoning.

