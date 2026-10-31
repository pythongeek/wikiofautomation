---
title: "Ollama"
bangla_title: "ওলামা (Ollama)"
category: "frameworks"
tags: ["local-ai", "gguf", "llama-cpp", "openai-api", "open-source"]
created: "2026-10-15"
updated: "2026-11-01"
summary: "Ollama is an open-source local LLM runtime and model package manager that wraps llama.cpp into a zero-config daemon exposing an OpenAI-compatible /v1 API on port 11434."
bangla_summary: "ওলামা হলো একটি ওপেন-সোর্স লোকাল এলএলএম রানটাইম যা পোর্ট ১১৪৩৪-এ ওপেনএআই-কম্প্যাটিবল এপিআই প্রদান করে।"
sources:
  - title: "Ollama Official Repository"
    url: "https://github.com/ollama/ollama"
  - title: "Ollama OpenAI Compatibility Docs"
    url: "https://ollama.com/blog/openai-compatibility"
infobox:
  kind: "Local LLM Runtime & Model Manager"
  license: "MIT"
  first_release: "2023-07"
  language: "Go / C++ (llama.cpp)"
  repo: "https://github.com/ollama/ollama"
  site: "https://ollama.com"
---

## Overview

**Ollama** packages GGUF model weights, chat templates, and system parameters into Docker-style `Modelfile` bundles. By exposing `http://localhost:11434/v1/chat/completions` and `/v1/embeddings`, it acts as a zero-cost local drop-in replacement for OpenAI and Anthropic APIs inside **n8n**, **LangGraph**, **AutoGen**, and **Cursor**.

