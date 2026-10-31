import React, { useState } from 'react';

export const NotFound: React.FC = () => {
  const [adaQuery, setAdaQuery] = useState('');
  const [adaResponse, setAdaResponse] = useState<string | null>(null);

  const handleAdaAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adaQuery.trim()) return;
    setAdaResponse(`I searched the platform index for "${adaQuery}". Check out /wiki/frameworks/n8n or /marketplace for top matching tools!`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Large 404 */}
        <div className="space-y-2">
          <h1 className="text-[120px] font-mono font-bold leading-none text-[#5A5A68] tracking-tighter select-none">
            404
          </h1>
          <h2 className="text-2xl font-bold text-[#E5E1E7] tracking-tight">
            This page isn't in the index.
          </h2>
          <p className="text-[14px] text-[#8B8FA3]">
            The route you requested may have moved or doesn't exist in the automation wiki registry.
          </p>
        </div>

        {/* Ada Suggestion Card */}
        <div className="bg-[#131317] border border-[#6C63FF]/30 rounded-2xl p-6 text-left space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 flex items-center justify-center text-[#9B93FF]">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>smart_toy</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E5E1E7]">Ask Ada AI Assistant</h3>
              <p className="text-[12px] text-[#8B8FA3]">Want me to find what you were looking for? Tell me what you need.</p>
            </div>
          </div>

          <form onSubmit={handleAdaAsk} className="flex gap-2">
            <input
              type="text"
              value={adaQuery}
              onChange={e => setAdaQuery(e.target.value)}
              placeholder="e.g. n8n webhook drip workflow or MCP server setup..."
              className="flex-1 bg-[#0E0E12] border border-[#232329] rounded-lg px-4 py-2.5 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#6C63FF]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#6C63FF] text-white text-[13px] font-semibold hover:bg-[#5B52E0] transition-colors shrink-0"
            >
              Ask Ada →
            </button>
          </form>

          {adaResponse && (
            <div className="p-3 rounded-lg bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-[12px] font-mono text-[#9B93FF] animate-in fade-in">
              {adaResponse}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="/"
            className="px-6 py-3 rounded-lg bg-[#1E1E24] border border-[#232329] text-[#E5E1E7] text-[13px] font-semibold hover:border-[#C0F500]/40 transition-colors"
          >
            ← Go home
          </a>
          <a
            href="/marketplace"
            className="px-6 py-3 rounded-lg bg-[#C0F500] text-[#050508] text-[13px] font-semibold hover:bg-[#D4FF33] transition-all transform hover:-translate-y-0.5"
          >
            Browse marketplace
          </a>
        </div>

      </div>
    </div>
  );
};
