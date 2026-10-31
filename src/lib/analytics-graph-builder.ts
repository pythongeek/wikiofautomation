// lib/analytics-graph-builder.ts
// Build knowledge graph data from analytics, content, and conversions

import type { KnowledgeGraph, GraphNode, GraphLink } from '../types/graph';

export async function buildBusinessGraph(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<KnowledgeGraph> {
  const nodes: GraphNode[] = [
    // Product Nodes
    { id: 'prod-1', type: 'product', label: 'n8n Stripe Drip & Webhook Engine', val: 8, color: '#10b981', metadata: { url: '/marketplace/workflows/n8n-stripe-drip-workflow', views: 21800, conversions: 420, revenue: 20580 } },
    { id: 'prod-2', type: 'product', label: 'Claude 3.7 Sonnet Master Prompt Suite', val: 6, color: '#10b981', metadata: { url: '/marketplace/prompts/claude-prompt-engineer', views: 14200, conversions: 310, revenue: 12090 } },
    { id: 'prod-3', type: 'product', label: 'Autonomous AI OS Sandbox', val: 9, color: '#10b981', metadata: { url: '/marketplace/ai-os/autonomous-dev-os', views: 34100, conversions: 190, revenue: 18810 } },
    
    // Blog / News Nodes
    { id: 'blog-1', type: 'blog', label: 'MCP Protocol v2.0 Launch Announcement', val: 5, color: '#3b82f6', metadata: { url: '/news/mcp-protocol-v2-launch', views: 18400 } },
    { id: 'blog-2', type: 'blog', label: 'LangGraph vs AutoGen Agent Swarms 2026', val: 7, color: '#3b82f6', metadata: { url: '/news/langgraph-vs-autogen-agent-swarms', views: 24900 } },

    // Wiki Page Nodes
    { id: 'page-1', type: 'page', label: 'n8n Framework Entry', val: 10, color: '#f59e0b', metadata: { url: '/wiki/frameworks/n8n', views: 42100 } },
    { id: 'page-2', type: 'page', label: 'Model Context Protocol (MCP) Entry', val: 9, color: '#f59e0b', metadata: { url: '/wiki/protocols/model-context-protocol', views: 38200 } },

    // Category Nodes
    { id: 'cat-workflows', type: 'category', label: 'Workflows', val: 4, color: '#6366f1', metadata: {} },
    { id: 'cat-prompts', type: 'category', label: 'Prompts', val: 3, color: '#6366f1', metadata: {} },
    { id: 'cat-agents', type: 'category', label: 'AI Swarm Agents', val: 5, color: '#6366f1', metadata: {} },

    // Conversion Nodes
    { id: 'conv-1', type: 'conversion', label: 'Stripe Purchase ($49)', val: 4, color: '#ec4899', metadata: { revenue: 49, status: 'completed' } },
    { id: 'conv-2', type: 'conversion', label: 'Crypto Subscription ($19/mo)', val: 3, color: '#ec4899', metadata: { revenue: 19, status: 'completed' } },
  ];

  const links: GraphLink[] = [
    { source: 'prod-1', target: 'cat-workflows', type: 'tagged', value: 0.8 },
    { source: 'prod-2', target: 'cat-prompts', type: 'tagged', value: 0.8 },
    { source: 'prod-3', target: 'cat-agents', type: 'tagged', value: 0.8 },
    { source: 'blog-1', target: 'page-2', type: 'related', value: 0.9 },
    { source: 'blog-2', target: 'prod-3', type: 'navigated', value: 0.7, metadata: { count: 142, converted: 18 } },
    { source: 'page-1', target: 'prod-1', type: 'navigated', value: 0.9, metadata: { count: 520, converted: 64 } },
    { source: 'prod-1', target: 'conv-1', type: 'converted', value: 1.0, metadata: { revenue: 20580 } },
    { source: 'prod-2', target: 'conv-2', type: 'converted', value: 1.0, metadata: { revenue: 12090 } },
  ];

  return { nodes, links };
}
