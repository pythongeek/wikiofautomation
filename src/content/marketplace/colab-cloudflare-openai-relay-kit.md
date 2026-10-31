---
title: "Colab/Kaggle → Permanent Cloudflare OpenAI API Bridge Kit (Durable Object Relay)"
type: "notebook-kit"
pricing: "paid"
price_label: "$19 One-Time"
price_usd: 19
lemon_variant_id: "ls-var-colab-relay-kit"
vault_asset: "paid/kits/ollama-relay-bundle.json"
icon: "🛰️"
uses: 1420
rating: 5.0
tags: ["colab", "kaggle", "cloudflare-worker", "durable-objects", "ollama-relay", "openai-api"]
license: "MIT / Commercial Starter Kit"
original_author: "Wiki of Automation Core"
creator_handle: "@wikiofautomation"
summary: "Bypass trycloudflare 1016/1033 edge blocks forever. Uses a Cloudflare Durable Object WebSocket Reverse-Tunnel (`ollama-relay`) so any free Colab or Kaggle GPU dials outbound and serves a permanent https://api.yourdomain.com/v1 OpenAI endpoint."
works_with: ["Google Colab", "Kaggle Notebooks", "Cloudflare Workers", "Ollama / llama-server", "n8n / Cursor"]
whats_included:
  - "Cloudflare Durable Object WebSocket Relay Worker (`worker.js` + `wrangler.toml`)"
  - "Colab & Kaggle Outbound WebSocket Dialer Client Cell + Keep-Alive"
  - "Bearer Token Auth (`ADMIN_KEY` & `PROXY_KEY`) + Streaming SSE Support"
  - "1-Click Deploy Script & n8n Connection Template"
status: "live"
created: "2026-10-06"
updated: "2026-11-01"
---

## Why Standard `trycloudflare.com` Tunnels Fail in Production

When you expose a free Colab or Kaggle GPU using `trycloudflare.com`, two things break your automation:
1. Every session restart generates a **new random URL**, forcing you to manually update every n8n node and agent config.
2. Calling a `trycloudflare.com` tunnel from another Cloudflare Worker or edge proxy fails with **Cloudflare Error 1016 / 1033** edge routing blocks.

### How the Durable Object Reverse-Tunnel (`ollama-relay`) Solves Both

Instead of proxying *into* an ephemeral tunnel, your Colab/Kaggle notebook runs a lightweight WebSocket client that dials **outbound** over plain HTTPS to `/connect` on your Cloudflare Durable Object. Your agents, n8n workflows, and Cursor IDE hit your permanent `https://relay.yourdomain.com/v1/chat/completions` URL—and the Durable Object streams tokens back over the persistent WebSocket with zero edge blocks.

