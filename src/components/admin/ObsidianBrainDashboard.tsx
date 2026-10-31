import React, { useState, useEffect } from 'react';
import { KnowledgeGraph } from './KnowledgeGraph';
import { buildBusinessGraph } from '../../lib/analytics-graph-builder';
import type { KnowledgeGraph as KnowledgeGraphType } from '../../types/graph';

export const ObsidianBrainDashboard: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [graphData, setGraphData] = useState<KnowledgeGraphType | null>(null);

  useEffect(() => {
    buildBusinessGraph(range).then(data => setGraphData(data));
  }, [range]);

  if (!graphData) {
    return <div className="p-8 text-center text-[#5A5A68] font-mono">Loading Obsidian Brain Knowledge Graph...</div>;
  }

  const totalRevenue = graphData.nodes
    .filter(n => n.type === 'conversion')
    .reduce((sum, n) => sum + (n.metadata.revenue || 0), 0);

  const totalViews = graphData.nodes
    .filter(n => ['product', 'blog', 'page'].includes(n.type))
    .reduce((sum, n) => sum + (n.metadata.views || 0), 0);

  const conversionPaths = graphData.links.filter(l => l.type === 'converted').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232329] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E5E1E7] tracking-tight">Obsidian Brain Dashboard</h1>
          <p className="text-[12px] font-mono text-[#8B8FA3]">
            Visualize content relationships, vector embeddings, user navigation paths, and conversion flows.
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex gap-2 bg-[#131317] p-1 rounded-xl border border-[#232329]">
          {(['7d', '30d', '90d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-mono font-medium transition-colors ${
                range === r ? 'bg-[#C0F500] text-[#050508] font-bold' : 'text-[#8B8FA3] hover:text-[#E5E1E7]'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131317] border border-[#232329] rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#8B8FA3]">Total Revenue</span>
          <p className="text-2xl font-bold text-[#C0F500] font-mono">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#131317] border border-[#232329] rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#8B8FA3]">Total Views</span>
          <p className="text-2xl font-bold text-[#00DAF3] font-mono">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-[#131317] border border-[#232329] rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#8B8FA3]">Content Nodes</span>
          <p className="text-2xl font-bold text-[#9B93FF] font-mono">{graphData.nodes.length}</p>
        </div>
        <div className="bg-[#131317] border border-[#232329] rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#8B8FA3]">Conversion Paths</span>
          <p className="text-2xl font-bold text-[#FF6B6B] font-mono">{conversionPaths}</p>
        </div>
      </div>

      {/* Graph Canvas Box */}
      <div className="bg-[#131317] border border-[#232329] rounded-2xl p-4 shadow-2xl" style={{ height: '620px' }}>
        <KnowledgeGraph data={graphData} width={1100} height={590} />
      </div>
    </div>
  );
};
