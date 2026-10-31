---
title: "MedLegal-Triage-8B (HIPAA/GDPR Air-Gapped Clinical & Contract Reviewer)"
use_case: "medical-legal-finance"
base_model: "Llama-3.1-8B-Instruct"
parameter_size: "8.0B"
tuning_method: "Unsloth QLoRA + Direct Preference Optimization on Clinical Triage & MSA Clauses"
quant_formats: ["Q4_K_M (4.9 GB)", "Q8_0 (8.5 GB)"]
vram_required_gb: 6
benchmark_delta: "+24.8% Clause Risk Recall & Zero External Data Egress (100% On-Prem)"
ollama_run_cmd: "ollama run llama3.1:8b-instruct-q8_0"
colab_notebook_slug: "unsloth-qlora-gguf-export-pipeline"
pricing: "free"
summary: "Compact 8B domain specialist designed for air-gapped 6GB–8GB workstations. Performs patient intake symptom routing, ICD-10 coding assistance, and NDA/MSA liability clause flagging."
tags: ["medical-ai", "legal-ai", "hipaa", "gdpr", "air-gapped", "8b-slm"]
updated: "2026-11-01"
---

## Built for Regulated Verticals Where Cloud APIs Are Prohibited

Law firms, clinics, and compliance teams often cannot transmit client records to external LLM providers. At just **4.9 GB (`Q4_K_M`)** or **8.5 GB (`Q8_0`)**, this model runs entirely in local memory on standard office hardware or MacBooks.

