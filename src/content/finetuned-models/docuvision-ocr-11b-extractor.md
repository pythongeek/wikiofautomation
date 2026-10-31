---
title: "DocuVision-OCR-11B (Invoice, KYC & Financial Table Extraction SLM)"
use_case: "vision-ocr-extraction"
base_model: "Llama-3.2-11B-Vision-Instruct / Qwen2.5-VL-7B"
parameter_size: "7B / 11B Vision"
tuning_method: "Multimodal LoRA on 60k Multi-Page Invoices, Receipts, and KYC ID Documents"
quant_formats: ["Q4_K_M + mmproj-Q8_0 (6.2 GB)", "Q8_0 (9.8 GB)"]
vram_required_gb: 8
benchmark_delta: "98.9% Line-Item Table & Bounding-Box Extraction Accuracy on Skewed Scans"
ollama_run_cmd: "ollama run qwen2.5vl:7b"
colab_notebook_slug: "qwen3-8-27b-vision-colab-server"
pricing: "free"
summary: "High-speed local vision-language model tuned for line-item invoice extraction, bank statement reconciliation, handwritten note digitization, and automated KYC document verification."
tags: ["vision", "ocr", "invoices", "kyc", "document-ai", "multimodal"]
updated: "2026-11-01"
---

## Local, Privacy-Preserving Document Intelligence

Instead of sending sensitive financial invoices or customer KYC identity documents to third-party cloud APIs, run **DocuVision-OCR** locally on an 8GB GPU and pipe structured line-item JSON straight into QuickBooks, Airtable, or PostgreSQL.

