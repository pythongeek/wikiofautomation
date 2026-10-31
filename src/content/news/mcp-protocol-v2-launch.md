---
title: Model Context Protocol v2 Released with Streamed Webhooks
kind: tool
category: TOOL
published: "2026-08-04"
excerpt: Anthropic and open-source contributors publish MCP v2 specification with bidirectional SSE streaming and dynamic tool discovery.
author: Marcus
author_avatar: https://api.dicebear.com/7.x/avataaars/svg?seed=marcus
read_time: 4 min read
featured: false
hero_image: https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop
tags: ["mcp", "protocols", "webhooks", "tooling"]
toc:
  - id: "mcp-v2-features"
    title: "Key MCP v2 Features"
  - id: "sse-streaming"
    title: "Bidirectional SSE Streaming"
related_wiki:
  - title: "MCP Protocol Deep Dive"
    href: "/wiki/protocols/model-context-protocol"
---

The Model Context Protocol (MCP) working group has finalized the **v2.0 specification**, introducing nativeServer-Sent Events (SSE) streaming and background push notifications.

<h2 id="mcp-v2-features">Key MCP v2 Features</h2>

- **Bidirectional Webhooks**: Servers can push event updates to clients without polling.
- **Resource Subscription Channels**: Subscribe to real-time database schema changes.
