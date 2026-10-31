import React, { useState } from 'react';

export interface TagItemResult {
  id: string;
  type: 'wiki' | 'marketplace' | 'news';
  title: string;
  excerpt: string;
  url: string;
  authorOrSource: string;
  dateOrInstalls: string;
  tags: string[];
}

export const TagPage: React.FC<{ tag?: string }> = ({ tag = 'n8n' }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'wiki' | 'marketplace' | 'news'>('all');

  const cleanTag = (tag || 'n8n').replace('#', '').toLowerCase();

  const tagFeed: TagItemResult[] = [
    {
      id: 'item-1',
      type: 'wiki',
      title: 'n8n Open-Source Workflow Automation Framework',
      excerpt:
        'Comprehensive architectural overview of n8n: fair-code license, self-hosted Docker deployment, custom node development, and LangChain AI integrations.',
      url: '/wiki/frameworks/n8n',
      authorOrSource: 'Wiki Encyclopedia',
      dateOrInstalls: 'Updated 2 days ago',
      tags: ['#n8n', '#workflows', '#open-source'],
    },
    {
      id: 'item-2',
      type: 'marketplace',
      title: 'n8n Stripe Drip & Webhook Engine',
      excerpt:
        'Production-ready n8n workflow for handling subscription lifecycle events, failed payment retries, and customer notifications.',
      url: '/marketplace/workflows/n8n-stripe-drip-workflow',
      authorOrSource: 'By Ada Lovelace',
      dateOrInstalls: '620 Installs · ★ 4.95',
      tags: ['#n8n', '#stripe', '#webhooks'],
    },
    {
      id: 'item-3',
      type: 'news',
      title: 'n8n Benchmark: Autonomous Agents Execute Multi-Step Webhooks at 340ms Latency',
      excerpt:
        'New performance benchmarks reveal n8n self-hosted instances achieve 3.4x faster execution speeds than cloud-based competitors.',
      url: '/news/n8n-autonomous-agent-benchmark',
      authorOrSource: 'By Ada',
      dateOrInstalls: '3 days ago · 5 min read',
      tags: ['#n8n', '#benchmarks', '#agents'],
    },
    {
      id: 'item-4',
      type: 'marketplace',
      title: 'Inbox Triage Agent (LangGraph + n8n Router)',
      excerpt:
        'Autonomous email triage agent that categorizes incoming messages, drafts response templates, and dispatches JSON webhooks to n8n.',
      url: '/marketplace/agents/inbox-triage-agent',
      authorOrSource: 'By Linus Torvalds',
      dateOrInstalls: '940 Installs · ★ 4.8',
      tags: ['#n8n', '#agents', '#email'],
    },
    {
      id: 'item-5',
      type: 'wiki',
      title: 'Model Context Protocol (MCP) Integration in n8n',
      excerpt:
        'How to connect MCP tool servers directly to n8n LLM nodes for real-time filesystem and database querying.',
      url: '/wiki/protocols/model-context-protocol',
      authorOrSource: 'Wiki Protocol Docs',
      dateOrInstalls: 'Updated 1 week ago',
      tags: ['#mcp', '#n8n', '#protocols'],
    },
  ];

  const filteredFeed = tagFeed.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const relatedTags = ['#workflows', '#automation', '#make', '#zapier', '#api', '#docker', '#langgraph'];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white">
      {/* Tag Header */}
      <div className="space-y-4 mb-10 pb-8 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase bg-[#00e3fd]/10 text-[#00e3fd] border border-[#00e3fd]/30">
          🏷️ Topic Tag Hub
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans">
          <span className="text-[#9ca3af]">#</span>
          <span className="text-white">{cleanTag}</span>
        </h1>

        <p className="text-sm sm:text-base text-[#9ca3af] font-mono">
          2,340 results across wiki encyclopedia, marketplace tools, and tech news.
        </p>

        {/* Related Tags Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-mono uppercase text-[#9ca3af] mr-1">Related Tags:</span>
          {relatedTags.map((rt) => (
            <a
              key={rt}
              href={`/tags/${rt.replace('#', '')}`}
              className="px-3 py-1 rounded-xl bg-[#1f1f23] hover:bg-[#c0f500] text-white hover:text-[#161f00] font-mono text-xs border border-white/10 transition-colors"
            >
              {rt}
            </a>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          All (2,340)
        </button>
        <button
          onClick={() => setActiveTab('wiki')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'wiki'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Wiki Entries (234)
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'marketplace'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Marketplace (892)
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'news'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          News (47)
        </button>
      </div>

      {/* Mixed Content Feed */}
      <div className="space-y-4 max-w-4xl">
        {filteredFeed.map((item) => {
          let borderStyle = 'border-l-purple-500 bg-purple-500/5';
          let badgeText = 'WIKI ENTRY';
          let badgeColor = 'text-purple-300 bg-purple-500/20 border-purple-500/30';
          let btnText = 'Read Wiki →';

          if (item.type === 'marketplace') {
            borderStyle = 'border-l-cyan-400 bg-cyan-500/5';
            badgeText = 'MARKETPLACE ITEM';
            badgeColor = 'text-[#00e3fd] bg-[#00e3fd]/20 border-[#00e3fd]/30';
            btnText = 'View Item →';
          } else if (item.type === 'news') {
            borderStyle = 'border-l-amber-500 bg-amber-500/5';
            badgeText = 'NEWS STORY';
            badgeColor = 'text-amber-300 bg-amber-500/20 border-amber-500/30';
            btnText = 'Read Story →';
          }

          return (
            <div
              key={item.id}
              className={`bg-[#131317] border-l-4 ${borderStyle} border-white/10 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 shadow-lg space-y-4 group`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${badgeColor}`}>
                  {badgeText}
                </span>
                <span className="text-xs font-mono text-[#9ca3af]">{item.dateOrInstalls}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#c0f500] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-[#9ca3af]">
                  <span>{item.authorOrSource}</span>
                </div>

                <a
                  href={item.url}
                  className="px-4 py-2 bg-[#1f1f23] group-hover:bg-[#c0f500] text-white group-hover:text-[#161f00] font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{btnText}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
