import React, { useState } from 'react';

export interface ToolCompareData {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  rating: number;
  reviewsCount: number;
  url: string;
  pricing: string;
  hosting: string;
  integrations: string;
  aiNative: boolean;
  workflowLogic: string;
  easeOfUse: string;
  openSource: boolean;
  apiAccess: boolean;
  communitySize: string;
  woaListings: number;
}

export const CompareTool: React.FC<{ slug?: string }> = ({ slug = 'n8n-vs-make' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'integrations' | 'reviews' | 'community'>('overview');
  const [toolAInput, setToolAInput] = useState('n8n');
  const [toolBInput, setToolBInput] = useState('make');

  const toolA: ToolCompareData = {
    id: 'n8n',
    name: 'n8n',
    logo: '⚡',
    tagline: 'Fair-code self-hosted workflow automation platform built for developers.',
    rating: 4.9,
    reviewsCount: 1240,
    url: 'https://n8n.io',
    pricing: 'Free Self-Hosted / $20 Cloud',
    hosting: 'Self-Hosted Docker or Cloud',
    integrations: '400+ Nodes + Unlimited HTTP',
    aiNative: true,
    workflowLogic: 'JavaScript/Python Code Nodes',
    easeOfUse: 'Moderate (Developer Focused)',
    openSource: true,
    apiAccess: true,
    communitySize: '140k+ Active Builders',
    woaListings: 892,
  };

  const toolB: ToolCompareData = {
    id: 'make',
    name: 'Make (Integromat)',
    logo: '🧩',
    tagline: 'Visual automation platform for building & scaling complex workflows without code.',
    rating: 4.7,
    reviewsCount: 950,
    url: 'https://make.com',
    pricing: 'Operations Tier ($9 / $29 / $99)',
    hosting: 'Cloud SaaS Only',
    integrations: '1,500+ Pre-built Modules',
    aiNative: false,
    workflowLogic: 'Visual Formula Builder',
    easeOfUse: 'High (No-Code Drag & Drop)',
    openSource: false,
    apiAccess: true,
    communitySize: '85k Members',
    woaListings: 430,
  };

  const handleCustomCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolAInput.trim() || !toolBInput.trim()) return;
    const compareSlug = `${toolAInput.trim().toLowerCase()}-vs-${toolBInput.trim().toLowerCase()}`;
    window.location.href = `/compare/${compareSlug}`;
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-[#9ca3af] mb-8">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <span>/</span>
        <a href="/compare/n8n-vs-make" className="hover:text-white transition-colors">Compare</a>
        <span>/</span>
        <span className="text-[#c0f500] font-bold">n8n vs Make</span>
      </div>

      {/* Side-by-Side Versus Header */}
      <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Tool A */}
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1f1f23] border border-white/10 flex items-center justify-center text-4xl shadow-lg">
                {toolA.logo}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">{toolA.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 font-mono text-xs text-amber-300 mt-0.5">
                  <span>★ {toolA.rating}</span>
                  <span className="text-[#9ca3af]">({toolA.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">{toolA.tagline}</p>
            <div>
              <a
                href={toolA.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 h-11 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                <span>Try {toolA.name} →</span>
              </a>
            </div>
          </div>

          {/* Center VS Badge */}
          <div className="md:col-span-2 text-center my-4 md:my-0">
            <div className="w-16 h-16 rounded-full bg-[#1f1f23] border border-white/10 flex items-center justify-center mx-auto shadow-xl">
              <span className="font-sans font-extrabold text-2xl sm:text-3xl text-[#9ca3af] uppercase tracking-wider">
                VS
              </span>
            </div>
          </div>

          {/* Tool B */}
          <div className="md:col-span-5 space-y-4 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-4">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">{toolB.name}</h2>
                <div className="flex items-center justify-center md:justify-end gap-2 font-mono text-xs text-amber-300 mt-0.5">
                  <span>★ {toolB.rating}</span>
                  <span className="text-[#9ca3af]">({toolB.reviewsCount} reviews)</span>
                </div>
              </div>
              <div className="order-1 md:order-2 w-16 h-16 rounded-2xl bg-[#1f1f23] border border-white/10 flex items-center justify-center text-4xl shadow-lg">
                {toolB.logo}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">{toolB.tagline}</p>
            <div>
              <a
                href={toolB.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 h-11 bg-[#1f1f23] hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-xs sm:text-sm transition-all"
              >
                <span>Try {toolB.name} →</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Verdict Box */}
      <div className="bg-[#1f1f23] border-l-4 border-l-[#c0f500] border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 mb-12 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sans">
          <span>⚡</span> Quick Decision Verdict
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm font-sans">
          <div className="p-4 bg-[#131317] border border-white/5 rounded-xl space-y-1">
            <div className="font-bold text-[#c0f500]">For Self-Hosted Privacy</div>
            <div className="text-white font-bold">🏆 n8n Wins</div>
            <div className="text-[#9ca3af] text-xs">Run fully isolated on Docker with zero data leaving your server.</div>
          </div>
          <div className="p-4 bg-[#131317] border border-white/5 rounded-xl space-y-1">
            <div className="font-bold text-[#00e3fd]">For No-Code Visual Simplicity</div>
            <div className="text-white font-bold">🏆 Make Wins</div>
            <div className="text-[#9ca3af] text-xs">Drag-and-drop canvas with 1,500+ pre-built SaaS modules.</div>
          </div>
          <div className="p-4 bg-[#131317] border border-white/5 rounded-xl space-y-1">
            <div className="font-bold text-[#c0f500]">For AI Agent & MCP Nodes</div>
            <div className="text-white font-bold">🏆 n8n Wins</div>
            <div className="text-[#9ca3af] text-xs">Native LangChain nodes, memory checkpointers, and custom MCP tools.</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Full Comparison Table
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'pricing'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Pricing Breakdown
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'integrations'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Integrations & Ecosystem
        </button>
      </div>

      {/* TAB CONTENT: Full Comparison Table */}
      <div className="bg-[#131317] border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-white/10 bg-[#0e0e12] text-[#9ca3af] uppercase font-mono text-xs">
                <th className="py-4 px-6">Feature / Dimension</th>
                <th className="py-4 px-6 text-center text-white">{toolA.name}</th>
                <th className="py-4 px-6 text-center text-white">{toolB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              <tr className="bg-[#050508] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">Pricing Model</td>
                <td className="py-4 px-6 text-center font-mono text-[#c0f500] font-bold">{toolA.pricing}</td>
                <td className="py-4 px-6 text-center font-mono text-[#00e3fd] font-bold">{toolB.pricing}</td>
              </tr>
              <tr className="bg-[#131317] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">Hosting Options</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolA.hosting}</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolB.hosting}</td>
              </tr>
              <tr className="bg-[#050508] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">Integrations Count</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolA.integrations}</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolB.integrations}</td>
              </tr>
              <tr className="bg-[#131317] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">AI-Native & MCP Nodes</td>
                <td className="py-4 px-6 text-center font-mono text-[#00e3fd] font-bold">✓ Built-in LangChain & MCP</td>
                <td className="py-4 px-6 text-center font-mono text-red-400 font-bold">✕ Basic OpenAI Modules</td>
              </tr>
              <tr className="bg-[#050508] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">Workflow Logic & Code</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolA.workflowLogic}</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolB.workflowLogic}</td>
              </tr>
              <tr className="bg-[#131317] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">Ease of Use</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolA.easeOfUse}</td>
                <td className="py-4 px-6 text-center font-mono text-[#00e3fd] font-bold">{toolB.easeOfUse}</td>
              </tr>
              <tr className="bg-[#050508] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">Open Source / Fair Code</td>
                <td className="py-4 px-6 text-center font-mono text-[#00e3fd] font-bold">✓ Fair-Code Source Available</td>
                <td className="py-4 px-6 text-center font-mono text-red-400 font-bold">✕ Proprietary Closed Source</td>
              </tr>
              <tr className="bg-[#131317] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">API & Custom Node Dev</td>
                <td className="py-4 px-6 text-center font-mono text-white">✓ Unlimited Custom Nodes</td>
                <td className="py-4 px-6 text-center font-mono text-white">✓ Custom App Builder</td>
              </tr>
              <tr className="bg-[#050508] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">Community Size</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolA.communitySize}</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolB.communitySize}</td>
              </tr>
              <tr className="bg-[#131317] hover:bg-[#1f1f23] transition-colors">
                <td className="py-4 px-6 font-bold text-white">WOA Marketplace Listings</td>
                <td className="py-4 px-6 text-center font-mono text-[#c0f500] font-bold">{toolA.woaListings} Workflows</td>
                <td className="py-4 px-6 text-center font-mono text-white">{toolB.woaListings} Workflows</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* "Compare Something Else" Bottom Section */}
      <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white font-sans">Compare Something Else</h3>
        <p className="text-xs text-[#9ca3af]">Enter any two automation tools or AI platforms to generate an instant side-by-side decision matrix.</p>

        <form onSubmit={handleCustomCompareSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={toolAInput}
            onChange={(e) => setToolAInput(e.target.value)}
            placeholder="e.g. n8n"
            required
            className="w-full sm:w-1/3 h-12 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-xs font-mono text-white focus:outline-none"
          />
          <span className="font-mono text-xs text-[#9ca3af] font-bold">vs</span>
          <input
            type="text"
            value={toolBInput}
            onChange={(e) => setToolBInput(e.target.value)}
            placeholder="e.g. zapier"
            required
            className="w-full sm:w-1/3 h-12 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-xs font-mono text-white focus:outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto h-12 px-6 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
          >
            Compare Now →
          </button>
        </form>
      </div>
    </div>
  );
};
