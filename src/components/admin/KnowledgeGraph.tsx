import React, { useRef, useCallback, useState, useEffect } from 'react';

interface KnowledgeGraphProps {
  data: { nodes: any[]; links: any[] };
  onNodeClick?: (node: any) => void;
  width?: number;
  height?: number;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  data,
  onNodeClick,
  width = 800,
  height = 600,
}) => {
  const fgRef = useRef<any>(null);
  const [ForceGraph2DComponent, setForceGraph2DComponent] = useState<any>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [hoverNode, setHoverNode] = useState<any>(null);

  useEffect(() => {
    import('react-force-graph-2d').then(mod => {
      setForceGraph2DComponent(() => mod.default);
    });
  }, []);

  const nodeColors: Record<string, string> = {
    product: '#10b981',
    blog: '#3b82f6',
    page: '#f59e0b',
    user: '#8b5cf6',
    conversion: '#ec4899',
    category: '#6366f1',
    tag: '#14b8a6',
  };

  const handleNodeHover = useCallback(
    (node: any) => {
      if (node) {
        const neighbors = new Set<string>();
        neighbors.add(node.id);
        data.links.forEach((link: any) => {
          if (link.source.id === node.id || link.target.id === node.id) {
            neighbors.add(link.source.id);
            neighbors.add(link.target.id);
          }
        });
        setHighlightNodes(neighbors);
      } else {
        setHighlightNodes(new Set());
      }
      setHoverNode(node || null);
    },
    [data]
  );

  const handleNodeClick = useCallback(
    (node: any) => {
      fgRef.current?.centerAt(node.x, node.y, 1000);
      fgRef.current?.zoom(2, 1000);
      onNodeClick?.(node);
    },
    [onNodeClick]
  );

  if (!ForceGraph2DComponent) {
    return (
      <div className="flex items-center justify-center h-full text-[#5A5A68] font-mono text-sm">
        Initializing 2D Force Graph Engine...
      </div>
    );
  }

  const GraphComp = ForceGraph2DComponent;

  return (
    <div className="relative w-full h-full bg-[#050508] rounded-xl overflow-hidden border border-[#232329]">
      {/* Top Left Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => fgRef.current?.zoomToFit(400)}
          className="px-3 py-1.5 bg-[#131317] border border-[#232329] rounded-lg text-xs font-mono text-[#E5E1E7] hover:border-[#C0F500]"
        >
          Fit View
        </button>
        <button
          onClick={() => fgRef.current?.zoom(1, 400)}
          className="px-3 py-1.5 bg-[#131317] border border-[#232329] rounded-lg text-xs font-mono text-[#E5E1E7] hover:border-[#C0F500]"
        >
          Reset Zoom
        </button>
      </div>

      {/* Bottom Right Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-[#131317]/90 backdrop-blur rounded-xl p-3 border border-[#232329]">
        <h4 className="text-[11px] font-mono font-semibold text-[#8B8FA3] mb-2 uppercase">Node Types</h4>
        {Object.entries(nodeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs font-mono text-[#E5E1E7] capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Top Right Tooltip */}
      {hoverNode && (
        <div className="absolute top-4 right-4 z-10 bg-[#131317]/95 border border-[#232329] backdrop-blur rounded-xl p-4 shadow-xl max-w-xs space-y-1">
          <h3 className="font-bold text-sm text-[#E5E1E7]">{hoverNode.label}</h3>
          <p className="text-xs font-mono text-[#00DAF3] capitalize">{hoverNode.type}</p>
          {hoverNode.metadata?.views && (
            <p className="text-xs text-[#8B8FA3] font-mono pt-1">Views: {hoverNode.metadata.views.toLocaleString()}</p>
          )}
          {hoverNode.metadata?.revenue && (
            <p className="text-xs text-[#C0F500] font-mono font-bold">Revenue: ${hoverNode.metadata.revenue.toLocaleString()}</p>
          )}
        </div>
      )}

      <GraphComp
        ref={fgRef}
        graphData={data}
        width={width}
        height={height}
        backgroundColor="transparent"
        nodeRelSize={6}
        nodeVal={(node: any) => node.val || 1}
        nodeColor={(node: any) => nodeColors[node.type] || '#94a3b8'}
        nodeLabel={(node: any) => `${node.label} (${node.type})`}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const isHighlighted = highlightNodes.has(node.id);
          const isHovered = hoverNode?.id === node.id;
          const size = (node.val || 1) * 4;
          if (isHighlighted || isHovered) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 3, 0, 2 * Math.PI);
            ctx.fillStyle = nodeColors[node.type] || '#94a3b8';
            ctx.globalAlpha = 0.2;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
          ctx.fillStyle = nodeColors[node.type] || '#94a3b8';
          ctx.fill();
          ctx.strokeStyle = isHovered ? '#ffffff' : '#131317';
          ctx.lineWidth = isHovered ? 2 : 1.5;
          ctx.stroke();
          if (globalScale > 1.2 || isHovered) {
            ctx.font = `${isHovered ? 'bold' : 'normal'} ${Math.max(10, 12 / globalScale)}px Sans-Serif`;
            ctx.fillStyle = '#E5E1E7';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + size + 12);
          }
        }}
        linkWidth={(link: any) => {
          const isHighlighted = highlightNodes.has(link.source.id) && highlightNodes.has(link.target.id);
          return isHighlighted ? 2 : 0.5;
        }}
        linkColor={(link: any) => {
          const isHighlighted = highlightNodes.has(link.source.id) && highlightNodes.has(link.target.id);
          return isHighlighted ? '#C0F500' : '#232329';
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        warmupTicks={100}
        cooldownTicks={50}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
};
