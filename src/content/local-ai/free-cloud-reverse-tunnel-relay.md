---
title: "Free Cloud-to-Local Reverse Tunnel Relay — Turn Free Colab/Kaggle GPUs into a Local OpenAI Endpoint"
category: "free-tunnel"
runtime: "Cloudflare Durable Object WebSocket Relay + llama-server"
hardware_target: "0GB Local VRAM Required (Offloads to Free Colab T4 / Kaggle 2×T4)"
vram_min_gb: 0
quant_recommended: "Q4_K_M / Q6_K (Remote GPU)"
tokens_per_sec: "40–75 tok/s"
pricing: "free"
summary: "Don't have a 24GB GPU locally? Use a reverse WebSocket tunnel from free Google Colab or Kaggle GPUs to a Cloudflare Worker so your local n8n and agents call a permanent https://*/v1 endpoint for $0/month."
tags: ["cloudflare-tunnel", "colab", "kaggle", "free-llm-api", "websocket-relay", "zero-vram"]
install_command: "cloudflared tunnel --url http://127.0.0.1:8080"
updated: "2026-11-01"
---

## The Zero-Hardware Local AI Architecture

Not every builder has a 24GB RTX 4090 on their desk. By combining a **local orchestrator** (n8n, Agent Zero, or LangGraph running on a laptop or cheap VPS) with **free cloud GPU runtimes** (Google Colab T4 or Kaggle Dual-T4), you get 15GB–30GB of VRAM for **$0.00**.

### Why Outbound WebSocket Relays Beat Standard Tunnels

Standard `trycloudflare.com` quick tunnels frequently trigger Cloudflare `1016 / 1033` edge blocks when called from another Cloudflare Worker or automated webhook.
- **Method 1 (Direct Quick Tunnel):** Run `cloudflared tunnel --url http://127.0.0.1:8080` inside Colab/Kaggle and paste the generated `https://*.trycloudflare.com/v1` URL directly into your local n8n instance.
- **Method 2 (Durable Object Reverse WebSocket Relay):** The Colab/Kaggle runtime dials **outbound** via standard HTTPS WebSocket to `/connect` on your Cloudflare Worker (`ollama-relay`). Your agents always call the exact same permanent Worker URL (`/v1/chat/completions`), even when the underlying Colab session restarts!

