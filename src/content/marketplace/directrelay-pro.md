---
title: "DirectRelay Pro — 4-Tier Monster WordPress Automation Bridge for n8n & Make"
type: "plugin"
pricing: "paid"
price_label: "$69 / Fleet"
price_usd: 69
lemon_variant_id: "ls-var-directrelay-pro"
vault_asset: "paid/plugins/directrelay-pro.zip"
icon: "🚀"
uses: 1680
rating: 5.0
tags: ["wordpress-plugin", "n8n", "seo-automation", "google-indexing-api", "woocommerce", "acf-pro"]
license: "Commercial Pro License (v1.0.0)"
original_author: "Wiki of Automation Core"
creator_handle: "@n4nion"
summary: "The definitive 4-tier WordPress automation bridge for n8n, Make, and Python agents: atomic 1-shot post+media+SEO publishing, bidirectional 4-plugin SEO engine (RankMath/Yoast/AIOSEO/SEOPress), native RS256 Google Indexing API, and Multi-Site Fleet Command."
works_with: ["WordPress 6.3–7.1+", "n8n", "Make", "Rank Math / Yoast / AIOSEO / SEOPress", "WooCommerce", "ACF Pro"]
whats_included:
  - "DirectRelay Pro v1.0.0 Standalone WordPress Plugin (.zip)"
  - "Bidirectional 4-Plugin SEO Engine + Full JSON-LD Graph Builder"
  - "Native OpenSSL RS256 Google Indexing API + Cloudflare/LiteSpeed Cache Purge"
  - "Multi-Site Fleet Command, Dead-Letter Queue (DLQ) & Time-Travel Payload Debugger"
status: "live"
created: "2026-10-16"
updated: "2026-11-01"
---

## Stop Fighting the Default WordPress REST API in n8n

Standard `/wp-json/wp/v2/posts` calls require 6 separate HTTP requests to upload a featured image, sideload inline images, set Rank Math / Yoast meta fields, populate ACF Pro repeaters, inject FAQ JSON-LD, and ping Google Indexing API—and if step 4 fails, you're left with half-published broken posts.

**DirectRelay Pro** replaces that entire mess with a **single atomic transaction**:
- **Tier 1 (Core Pro Publishing & SEO):** One-shot & 50-item bulk atomic publishing with automatic rollback on failure, bidirectional Rank Math / Yoast / AIOSEO / SEOPress sync, signed Magic Review URLs for human-in-the-loop approval, and Time-Travel Execution Debugger.
- **Tier 2 (AI, GEO/AEO & Instant Indexing):** Semantic internal silo linker, `/llms.txt` + `/llms-full.txt` generator, inline `<img>` WebP converter + 1200×630 OpenGraph generator, and native RS256 Google Indexing API client.
- **Tier 3 (CPT, WooCommerce & Multilingual):** Full CRUD for ACF Pro repeaters/flex fields, Meta Box, JetEngine, Pods, WooCommerce products/variations, and WPML/Polylang/TranslatePress translation groups.
- **Tier 4 (Fleet Command & Webhooks 2.0):** Manage dozens of child WordPress sites from one hub with HMAC-signed Dead-Letter Queue (DLQ) webhook redrive.

