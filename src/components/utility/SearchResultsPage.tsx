import React, { useState } from 'react';

export interface SearchResultItem {
  id: string;
  type: 'wiki' | 'marketplace' | 'news' | 'creator' | 'academy';
  title: string;
  excerpt: string;
  url: string;
  meta: string;
}

export const SearchResultsPage: React.FC = () => {
  const [queryInput, setQueryInput] = useState('n8n email workflow');
  const [activeTab, setActiveTab] = useState<'all' | 'wiki' | 'marketplace' | 'news' | 'creators' | 'academy'>('all');

  const searchResults: SearchResultItem[] = [
    {
      id: 'res-1',
      type: 'marketplace',
      title: 'n8n Stripe Drip & Email Webhook Engine',
      excerpt:
        'Automated n8n workflow for handling customer email sequences, transactional updates, and webhook retries.',
      url: '/marketplace/workflows/n8n-stripe-drip-workflow',
      meta: 'By Ada Lovelace · 620 Installs · $29',
    },
    {
      id: 'res-2',
      type: 'agent',
      title: 'Inbox Triage Agent (LangGraph + n8n)',
      excerpt:
        'AI email management agent that parses incoming emails, extracts action items, and triggers automated n8n workflows.',
      url: '/marketplace/agents/inbox-triage-agent',
      meta: 'By Linus Torvalds · 940 Installs · FREE',
    } as any,
    {
      id: 'res-3',
      type: 'wiki',
      title: 'n8n Workflow Framework & Webhook Architecture',
      excerpt:
        'Encyclopedia entry covering n8n node execution order, custom HTTP request headers, and email trigger nodes.',
      url: '/wiki/frameworks/n8n',
      meta: 'Wiki Entry · 14.3k Views',
    },
    {
      id: 'res-4',
      type: 'news',
      title: 'n8n Benchmark: Automated Email Workflows Scale to 10k Messages/Min',
      excerpt:
        'Performance testing results for self-hosted n8n container clusters executing high-volume email workflows.',
      url: '/news/n8n-autonomous-agent-benchmark',
      meta: 'Tech News · 5 min read',
    },
    {
      id: 'res-5',
      type: 'academy',
      title: 'n8n Automation Masterclass: From Webhooks to AI Agents',
      excerpt:
        'Comprehensive 14-module course covering n8n email automation, custom node creation, and LangGraph integration.',
      url: '/academy/courses/n8n-automation-masterclass',
      meta: 'Academy Course · 4.9★ (320 students)',
    },
    {
      id: 'res-6',
      type: 'creator',
      title: 'Ada Lovelace (@ada_lovelace)',
      excerpt:
        'Autonomous Swarm Architect & creator of 12 published n8n workflows and AI agents.',
      url: '/profile/ada_lovelace',
      meta: 'Verified Builder · 12 Published Tools',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(queryInput.trim())}`;
  };

  const filteredResults = searchResults.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'wiki') return item.type === 'wiki';
    if (activeTab === 'marketplace') return item.type === 'marketplace' || (item.type as any) === 'agent';
    if (activeTab === 'news') return item.type === 'news';
    if (activeTab === 'creators') return item.type === 'creator';
    if (activeTab === 'academy') return item.type === 'academy';
    return true;
  });

  const isEmpty = queryInput.trim().toLowerCase() === 'xyz123empty';

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white">
      {/* Header Bar */}
      <div className="space-y-6 mb-10 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase bg-[#c0f500]/10 text-[#c0f500] border border-[#c0f500]/30">
            🔍 Ecosystem Search Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            Search Results for <span className="text-[#c0f500]">"{queryInput}"</span>
          </h1>
        </div>

        {/* Search Bar Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search wiki, marketplace, news, creators..."
              className="w-full h-12 bg-[#131317] border border-white/10 focus:border-[#c0f500] rounded-xl pl-11 pr-4 text-sm font-mono text-white focus:outline-none"
            />
            <span className="absolute left-4 top-3.5 text-[#9ca3af] text-sm">🔍</span>
          </div>

          <button
            type="submit"
            className="h-12 px-6 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm shadow-[0_0_15px_rgba(192,245,0,0.3)] transition-all cursor-pointer shrink-0"
          >
            Search →
          </button>
        </form>

        {/* Result Count Badge */}
        {!isEmpty && (
          <div className="text-xs font-mono text-[#9ca3af]">
            Found <strong className="text-white">2,104</strong> total matches across all categories.
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-1 sm:pb-0">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          All (2,104)
        </button>
        <button
          onClick={() => setActiveTab('wiki')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wiki' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Wiki (234)
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'marketplace' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Marketplace (892)
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'news' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          News (47)
        </button>
        <button
          onClick={() => setActiveTab('creators')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'creators' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Creators (12)
        </button>
        <button
          onClick={() => setActiveTab('academy')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'academy' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Academy (8)
        </button>
      </div>

      {/* Main 2-Column Grid */}
      {isEmpty ? (
        /* Empty State */
        <div className="p-12 text-center bg-[#131317] border border-white/10 rounded-2xl max-w-2xl mx-auto space-y-4 shadow-xl">
          <div className="text-4xl">🔍</div>
          <h3 className="text-xl font-bold text-white">No results found for "{queryInput}"</h3>
          <p className="text-xs text-[#9ca3af]">
            Try searching for <button onClick={() => setQueryInput('n8n automation')} className="text-[#00e3fd] hover:underline">n8n automation</button>, <button onClick={() => setQueryInput('claude 3.7')} className="text-[#00e3fd] hover:underline">claude 3.7</button>, or Ask Ada AI Assistant below.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Search Feed */}
          <div className="lg:col-span-8 space-y-4">
            {filteredResults.map((res) => {
              let borderStyle = 'border-l-purple-500 bg-purple-500/5';
              let badgeText = 'WIKI ENTRY';
              let badgeColor = 'text-purple-300 bg-purple-500/20 border-purple-500/30';

              if (res.type === 'marketplace' || (res.type as any) === 'agent') {
                borderStyle = 'border-l-cyan-400 bg-cyan-500/5';
                badgeText = 'MARKETPLACE TOOL';
                badgeColor = 'text-[#00e3fd] bg-[#00e3fd]/20 border-[#00e3fd]/30';
              } else if (res.type === 'news') {
                borderStyle = 'border-l-amber-500 bg-amber-500/5';
                badgeText = 'NEWS STORY';
                badgeColor = 'text-amber-300 bg-amber-500/20 border-amber-500/30';
              } else if (res.type === 'creator') {
                borderStyle = 'border-l-[#c0f500] bg-[#c0f500]/5';
                badgeText = 'VERIFIED CREATOR';
                badgeColor = 'text-[#c0f500] bg-[#c0f500]/20 border-[#c0f500]/30';
              } else if (res.type === 'academy') {
                borderStyle = 'border-l-teal-400 bg-teal-500/5';
                badgeText = 'ACADEMY COURSE';
                badgeColor = 'text-teal-300 bg-teal-500/20 border-teal-500/30';
              }

              return (
                <a
                  key={res.id}
                  href={res.url}
                  className={`block bg-[#131317] border-l-4 ${borderStyle} border-white/10 rounded-2xl p-5 hover:border-white/30 transition-all group shadow-md space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${badgeColor}`}>
                      {badgeText}
                    </span>
                    <span className="text-xs font-mono text-[#9ca3af]">{res.meta}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#c0f500] transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9ca3af] line-clamp-2 leading-relaxed">
                    {res.excerpt}
                  </p>
                </a>
              );
            })}
          </div>

          {/* RIGHT SIDEBAR: Ada Assist Panel (280px Sticky Widget) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#131317] border border-[#c0f500]/30 rounded-2xl p-6 space-y-5 sticky top-24 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c0f500]/20 border border-[#c0f500]/40 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">Ada AI Search Assistant</h3>
                  <span className="text-[10px] font-mono text-[#c0f500]">⚡ Online · Query Synthesis</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-[#9ca3af] leading-relaxed font-sans">
                "Searching for <strong>n8n email workflows</strong>? I found 3 highly-rated marketplace templates with verified webhook logic."
              </div>

              {/* Inline Recommended Listing Cards */}
              <div className="space-y-2.5">
                <a
                  href="/marketplace/workflows/n8n-stripe-drip-workflow"
                  className="block p-3 bg-[#1f1f23] hover:border-[#c0f500] border border-white/5 rounded-xl text-xs space-y-1 transition-colors group"
                >
                  <div className="font-bold text-white group-hover:text-[#c0f500]">💳 n8n Stripe Drip & Email Webhooks</div>
                  <div className="text-[10px] font-mono text-[#9ca3af]">$29 · ★ 4.95 (620 installs)</div>
                </a>

                <a
                  href="/marketplace/agents/inbox-triage-agent"
                  className="block p-3 bg-[#1f1f23] hover:border-[#c0f500] border border-white/5 rounded-xl text-xs space-y-1 transition-colors group"
                >
                  <div className="font-bold text-white group-hover:text-[#c0f500]">⚡ Inbox Triage Agent</div>
                  <div className="text-[10px] font-mono text-[#00e3fd]">FREE · ★ 4.8 (940 installs)</div>
                </a>
              </div>

              <button
                onClick={() => alert(`Asking Ada about '${queryInput}'... Ada AI session initialized!`)}
                className="w-full py-2.5 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] text-xs font-bold rounded-xl text-center shadow-md transition-all cursor-pointer"
              >
                Ask Ada More →
              </button>

              <div className="pt-3 border-t border-white/10">
                <div className="text-[10px] font-mono uppercase text-[#9ca3af] mb-2">Query Top Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#1f1f23] text-white">#n8n</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#1f1f23] text-white">#email</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#1f1f23] text-white">#webhooks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
