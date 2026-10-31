import React, { useState } from 'react';

interface DocArticle {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  toc: { id: string; text: string; level: number }[];
  content: React.ReactNode;
}

const DOCS_ARTICLES: Record<string, DocArticle> = {
  'getting-started': {
    id: 'getting-started',
    category: 'Getting Started',
    title: 'Platform Overview & Architecture',
    subtitle: 'Everything you need to know about publishing, buying, and running automation tools on Wiki of Automation.',
    toc: [
      { id: 'overview', text: '1. What is Wiki of Automation?', level: 2 },
      { id: 'ecosystem', text: '2. The 5 Core Asset Types', level: 2 },
      { id: 'ada-brain', text: '3. Ada AI Assistant Integration', level: 2 },
      { id: 'webmcp', text: '4. WebMCP Protocol Support', level: 2 },
    ],
    content: (
      <div className="space-y-6 text-[14px] text-[#8B8FA3] leading-relaxed">
        <section id="overview" className="space-y-3">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">1. What is Wiki of Automation?</h2>
          <p>
            Wiki of Automation is the open encyclopedia and verified marketplace for modern AI agents, workflow automation nodes, Model Context Protocol (MCP) servers, and autonomous execution environments.
          </p>
          <div className="p-4 rounded-xl bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-[#9B93FF] text-[13px]">
            <strong>Note:</strong> Every tool listed on the marketplace undergoes automated vulnerability scanning and copyright licensing checks before publication.
          </div>
        </section>

        <section id="ecosystem" className="space-y-3 pt-4 border-t border-[#1E1E24]">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">2. The 5 Core Asset Types</h2>
          <div className="grid grid-cols-2 gap-3 font-mono text-[12px] pt-2">
            <div className="p-3 rounded-lg bg-[#0E0E12] border border-[#232329]">
              <span className="text-[#C0F500] font-bold block">1. 🛰 AI Swarm Agents</span>
              Autonomous browser controllers, customer support agents, and code engineers.
            </div>
            <div className="p-3 rounded-lg bg-[#0E0E12] border border-[#232329]">
              <span className="text-[#00DAF3] font-bold block">2. ⚡ Workflows</span>
              JSON node definitions for n8n, Make, and Zapier pipelines.
            </div>
            <div className="p-3 rounded-lg bg-[#0E0E12] border border-[#232329]">
              <span className="text-[#9B93FF] font-bold block">3. 🧠 Skill Packs</span>
              CLI extensions and tool bindings for Hermes and Claude Code.
            </div>
            <div className="p-3 rounded-lg bg-[#0E0E12] border border-[#232329]">
              <span className="text-[#F5A623] font-bold block">4. 📝 Prompt Suites</span>
              Tested system prompt templates and structured output schemas.
            </div>
          </div>
        </section>

        <section id="ada-brain" className="space-y-3 pt-4 border-t border-[#1E1E24]">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">3. Ada AI Assistant Integration</h2>
          <p>
            Ada is integrated directly into every page of the platform. She reads all indexed documentation, marketplace JSON schemas, and comparative benchmarks in real-time.
          </p>
        </section>

        <section id="webmcp" className="space-y-3 pt-4 border-t border-[#1E1E24]">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">4. WebMCP Protocol Support</h2>
          <p>
            Creators can expose their tools as WebMCP endpoints using standard SSE (Server-Sent Events) or WebSocket bridges.
          </p>
          <pre className="p-4 rounded-xl bg-[#0E0E12] border border-[#232329] font-mono text-[12px] text-[#C0F500] overflow-x-auto">
{`// Example WebMCP Connection Spec
const client = new WebMcpClient({
  endpoint: "https://webmcp-nexus.wikiofautomation.com/v1/connect",
  apiKey: process.env.WOA_CREATOR_KEY
});`}
          </pre>
        </section>
      </div>
    ),
  },

  'publishing-guide': {
    id: 'publishing-guide',
    category: 'Publishing',
    title: 'Creator Publishing & Review Process',
    subtitle: 'Step-by-step guide to preparing, uploading, and listing your automation assets for maximum discovery.',
    toc: [
      { id: 'prep', text: '1. Preparing Asset Files', level: 2 },
      { id: 'metadata', text: '2. Crafting Rich Descriptions', level: 2 },
      { id: 'review-steps', text: '3. Security Scan & Approval', level: 2 },
    ],
    content: (
      <div className="space-y-6 text-[14px] text-[#8B8FA3] leading-relaxed">
        <section id="prep" className="space-y-3">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">1. Preparing Asset Files</h2>
          <p>
            Ensure your zip archive contains a valid `README.md` with environment variable specifications and installation commands.
          </p>
        </section>
        <section id="metadata" className="space-y-3 pt-4 border-t border-[#1E1E24]">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">2. Crafting Rich Descriptions</h2>
          <p>
            List all prerequisites clearly. For n8n workflows, specify exact node version dependencies (e.g. `n8n-nodes-base.httpRequest v4`).
          </p>
        </section>
        <section id="review-steps" className="space-y-3 pt-4 border-t border-[#1E1E24]">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">3. Security Scan & Approval</h2>
          <p>
            All submitted archives are scanned against automated malware signatures and hardcoded credential leaks.
          </p>
        </section>
      </div>
    ),
  },

  'pricing-payouts': {
    id: 'pricing-payouts',
    category: 'Pricing & Payouts',
    title: 'Creator Revenue & Payout Schedule',
    subtitle: 'Understand pricing models, platform revenue split (90% creator cut), and payout processing.',
    toc: [
      { id: 'split', text: '1. 90% Creator Revenue Split', level: 2 },
      { id: 'payout-methods', text: '2. Payout Methods & Thresholds', level: 2 },
    ],
    content: (
      <div className="space-y-6 text-[14px] text-[#8B8FA3] leading-relaxed">
        <section id="split" className="space-y-3">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">1. 90% Creator Revenue Split</h2>
          <p>
            Creators keep 90% of gross earnings on all one-time tool purchases and recurring subscriptions. Wiki of Automation retains a flat 10% platform fee to cover edge hosting, AI vector embeddings, and payment processing fees.
          </p>
        </section>
        <section id="payout-methods" className="space-y-3 pt-4 border-t border-[#1E1E24]">
          <h2 className="text-xl font-bold text-[#E5E1E7] tracking-tight">2. Payout Methods & Thresholds</h2>
          <p>
            Payouts are processed automatically every Monday via Stripe Connect Direct Deposit, Bank Wire Transfer, or USDC Crypto Transfer for balances exceeding $50.00.
          </p>
        </section>
      </div>
    ),
  },
};

export const DocsViewer: React.FC = () => {
  const [activeDocId, setActiveDocId] = useState<string>('getting-started');
  const [activeHeading, setActiveHeading] = useState<string>('');

  const currentDoc = DOCS_ARTICLES[activeDocId] || DOCS_ARTICLES['getting-started'];

  const navTree = [
    {
      group: 'Getting Started',
      items: [
        { id: 'getting-started', label: 'Platform Architecture' },
      ],
    },
    {
      group: 'Creator Guide',
      items: [
        { id: 'publishing-guide', label: 'Publishing & Review' },
        { id: 'pricing-payouts', label: 'Pricing & Payouts' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* 3-Panel Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT NAV PANEL (3 cols) */}
        <aside className="md:col-span-3 bg-[#131317] border border-[#232329] rounded-2xl p-5 space-y-6 sticky top-20">
          <div className="flex items-center gap-2 pb-3 border-b border-[#232329]">
            <span className="material-symbols-outlined text-[#C0F500]" style={{ fontSize: 20 }}>menu_book</span>
            <span className="text-sm font-bold text-[#E5E1E7]">Documentation</span>
          </div>

          <nav className="space-y-5 text-[13px]">
            {navTree.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A5A68] block px-2">
                  {group.group}
                </span>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveDocId(item.id); setActiveHeading(''); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        activeDocId === item.id
                          ? 'bg-[#1E1E24] text-[#C0F500] font-semibold border-l-2 border-[#C0F500]'
                          : 'text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#0E0E12]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* CENTER CONTENT PANEL (6 cols) */}
        <main className="md:col-span-6 bg-[#131317] border border-[#232329] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Header */}
          <div className="space-y-2 pb-6 border-b border-[#232329]">
            <span className="text-[11px] font-mono text-[#00DAF3] uppercase tracking-wider block">
              {currentDoc.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E5E1E7]">
              {currentDoc.title}
            </h1>
            <p className="text-[13px] text-[#8B8FA3] leading-relaxed">
              {currentDoc.subtitle}
            </p>
          </div>

          {/* Render Content Body */}
          <div className="prose prose-invert max-w-none">
            {currentDoc.content}
          </div>
        </main>

        {/* RIGHT IN-PAGE TOC PANEL (3 cols) */}
        <aside className="md:col-span-3 bg-[#131317] border border-[#232329] rounded-2xl p-5 space-y-4 sticky top-20 hidden md:block">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A5A68] block pb-2 border-b border-[#232329]">
            On This Page
          </span>
          <nav className="space-y-2 text-[12px] font-mono">
            {currentDoc.toc.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveHeading(item.id)}
                className={`block transition-colors hover:text-[#C0F500] ${
                  activeHeading === item.id ? 'text-[#C0F500] font-bold' : 'text-[#8B8FA3]'
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </aside>

      </div>
    </div>
  );
};
