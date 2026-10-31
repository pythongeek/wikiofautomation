---
title: "Ollama Local Runtime — Zero-Cost Local LLM & Embedding Server for n8n & Agents"
category: "runtime"
runtime: "Ollama v0.40+"
hardware_target: "8GB–64GB VRAM / Apple Silicon M1–M4 / CPU+RAM Split"
vram_min_gb: 8
quant_recommended: "Q4_K_M / Q5_K_M"
tokens_per_sec: "45–110 tok/s"
pricing: "free"
summary: "Run open-weight LLMs (Qwen 3, Llama 3.3, DeepSeek-R1, Gemma 3) and embedding models locally on port 11434 with an OpenAI-compatible /v1 API and zero per-token cloud cost."
tags: ["ollama", "local-ai", "free", "openai-compatible", "n8n", "gguf"]
install_command: "ollama serve && ollama run qwen2.5:14b"
updated: "2026-11-01"
---

## Why Ollama Is the Default Local AI Engine

**Ollama** wraps `llama.cpp` inside a zero-configuration daemon exposing both native REST endpoints (`/api/generate`, `/api/chat`, `/api/embed`) and a drop-in **OpenAI-compatible `/v1/chat/completions` API** on `http://127.0.0.1:11434/v1`.

### Production Environment Variables for High-Concurrency Agents

When wiring Ollama to **n8n**, **LangGraph**, or **AutoGen**, default single-request settings cause bottlenecks. Set these environment variables before starting `ollama serve`:

| Variable | Recommended Value | Purpose |
| :--- | :--- | :--- |
| `OLLAMA_NUM_PARALLEL` | `4` | Allows 4 concurrent agent requests via continuous batching |
| `OLLAMA_FLASH_ATTENTION` | `1` | Enables Flash Attention 2 (faster prefill, lower KV cache memory) |
| `OLLAMA_KV_CACHE_TYPE` | `q8_0` | Cuts context window VRAM usage by ~45% with negligible quality loss |
| `OLLAMA_KEEP_ALIVE` | `24h` | Prevents unloading model weights from VRAM between n8n cron runs |
| `OLLAMA_HOST` | `0.0.0.0:11434` | Exposes Ollama to Docker containers (`host.docker.internal:11434`) |

