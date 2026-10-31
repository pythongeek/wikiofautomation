---
title: Inbox Triage Agent
type: agent
pricing: free
price_label: FREE
icon: 📬
uses: 3100
rating: 4.8
tags: ["agents", "email", "claude", "n8n"]
license: MIT
original_author: Ada Labs
creator_handle: "@ada_labs"
creator_avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ada"
creator_tool_count: 12
original_url: "https://github.com/n8n-io/n8n"
summary: Autonomous AI agent that categorizes, drafts responses, and routes incoming team emails using Claude 3.7 Sonnet & n8n.
description: |
  Inbox Triage Agent is a production-grade autonomous agent pipeline engineered for team support inboxes, sales routing, and customer inquiries.
  
  Powered by Claude 3.7 Sonnet and n8n webhooks, it reads incoming emails, performs sentiment & priority classification, auto-drafts context-aware replies, and routes actionable items directly into Slack or Linear.
works_with: ["n8n", "Claude 3.7 Sonnet", "Gmail API", "Slack", "Linear"]
whats_included:
  - "n8n Production Workflow (JSON import file)"
  - "Claude 3.7 Sonnet Prompt & System Instructions"
  - "Slack & Linear Webhook Routing Modules"
  - "Full Setup Documentation & Environment Schema"
changelog:
  - version: "v1.3.0"
    date: "2026-08-05"
    notes: "Upgraded reasoning capabilities with Claude 3.7 Sonnet hybrid thinking mode."
  - version: "v1.1.0"
    date: "2026-07-20"
    notes: "Added Linear ticket auto-creation for high-severity user bug reports."
  - version: "v1.0.0"
    date: "2026-07-01"
    notes: "Initial public release on WikiOfAutomation marketplace."
reviews:
  - author: "Alex Rivera"
    handle: "@arivera_tech"
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    rating: 5
    date: "2026-08-06"
    comment: "Reduced our customer support email response time from 4 hours to under 3 minutes. Flawless n8n workflow!"
  - author: "Elena Rostova"
    handle: "@elena_dev"
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena"
    rating: 4.8
    date: "2026-07-29"
    comment: "The prompt templates included are super clean. Highly customizable for custom CRM integrations."
created: "2026-07-01"
updated: "2026-08-05"
status: live
---

## Overview

The **Inbox Triage Agent** resolves one of the biggest operational bottlenecks for engineering and operations teams: email overload.

By combining deterministic n8n triggers with the probabilistic intelligence of Claude 3.7 Sonnet, the agent handles high-volume inboxes autonomously while maintaining human-in-the-loop safeguards for edge cases.

### Key Capabilities:
- **Instant Classification**: Automatically tags messages into `Bug Report`, `Sales Lead`, `Billing Query`, or `General Support`.
- **Sentiment Analysis**: Detects frustrated or urgent customers and escalates priority instantly.
- **Smart Response Drafting**: Generates contextually accurate draft replies based on your internal documentation.
- **Slack & Linear Sync**: Pushes real-time alerts to designated Slack channels and creates structured Linear tickets for bug reports.
