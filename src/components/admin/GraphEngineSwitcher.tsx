// src/components/admin/GraphEngineSwitcher.tsx
import React, { useState } from 'react';
import { KnowledgeGraph } from './KnowledgeGraph';
import { CytoscapeGraph } from './CytoscapeGraph';

interface GraphEngineSwitcherProps {
  data: {
    nodes: any[];
    links: any[];
  };
}

export const GraphEngineSwitcher: React.FC<GraphEngineSwitcherProps> = ({ data }) => {
  const [engine, setEngine] = useState<'force' | 'cytoscape'>('force');

  return (
    <div className="flex flex-col h-full w-full space-y-3">
      {/* Switcher Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#131317] border-b border-[#232329]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#C0F500] text-sm">auto_graph</span>
          <span className="text-xs font-mono text-[#E5E1E7] font-bold">Graph Rendering Engine:</span>
        </div>

        <div className="flex bg-[#1A1A2E] border border-[#232329] rounded-lg p-0.5">
          <button
            onClick={() => setEngine('force')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              engine === 'force'
                ? 'bg-[#C0F500] text-black font-bold shadow'
                : 'text-[#8B8FA3] hover:text-white'
            }`}
          >
            2D Force Graph (Standard)
          </button>
          <button
            onClick={() => setEngine('cytoscape')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              engine === 'cytoscape'
                ? 'bg-[#00DAF3] text-black font-bold shadow'
                : 'text-[#8B8FA3] hover:text-white'
            }`}
          >
            Cytoscape.js (10k+ Large Graph)
          </button>
        </div>
      </div>

      {/* Render Active Engine */}
      <div className="flex-1 w-full h-[500px] relative">
        {engine === 'force' ? (
          <KnowledgeGraph data={data} width={1200} height={500} />
        ) : (
          <CytoscapeGraph data={data} width={1200} height={500} />
        )}
      </div>
    </div>
  );
};
