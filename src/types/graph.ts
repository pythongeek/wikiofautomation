// types/graph.ts
// Knowledge Graph type definitions for Obsidian Brain Dashboard

export interface GraphNode {
  id: string;
  type: 'product' | 'blog' | 'page' | 'user' | 'conversion' | 'category' | 'tag';
  label: string;
  val?: number;
  color?: string;
  x?: number;
  y?: number;
  z?: number;
  metadata: {
    url?: string;
    views?: number;
    conversions?: number;
    revenue?: number;
    lastActive?: string;
    [key: string]: any;
  };
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'related' | 'viewed' | 'purchased' | 'tagged' | 'navigated' | 'converted';
  value?: number;
  color?: string;
  metadata?: {
    count?: number;
    converted?: number;
    lastInteraction?: string;
    revenue?: number;
  };
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}
