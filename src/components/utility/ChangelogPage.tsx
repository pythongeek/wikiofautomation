import React from 'react';

interface ChangelogEntry {
  id: string;
  month: string;
  version: string;
  date: string;
  items: {
    type: 'NEW' | 'FIX' | 'REMOVED';
    isMajor?: boolean;
    text: string;
  }[];
}

const CHANGELOG_HISTORY: ChangelogEntry[] = [
  {
    id: 'ch-aug-2026',
    month: 'Aug 2026',
    version: 'v4.2.0',
    date: 'August 10, 2026',
    items: [
      { type: 'NEW', isMajor: true, text: '★ Complete Admin Backend Suite with 10 high-density management pages (SEO, Ada AI Brain Config, Marketplace Moderation, Financial Analytics).' },
      { type: 'NEW', isMajor: true, text: '★ Reusable EmptyState component & Notification Center dropdown with unread badges.' },
      { type: 'NEW', text: 'Added page-specific context strings per route in Ada AI system prompt.' },
      { type: 'FIX', text: 'Resolved UserStatus type cast validation in UserManagement admin drawer.' },
    ],
  },
  {
    id: 'ch-jul-2026',
    month: 'Jul 2026',
    version: 'v3.8.0',
    date: 'July 24, 2026',
    items: [
      { type: 'NEW', isMajor: true, text: '★ Ada Floating AI Brain widget with pulse ring animation and streaming response logic.' },
      { type: 'NEW', text: 'Side-by-side Tool Comparison Engine (/compare/n8n-vs-make) with quick verdict boxes.' },
      { type: 'FIX', text: 'Fixed pagefind static search indexing for custom MDX frontmatter tags.' },
      { type: 'REMOVED', text: 'Deprecated legacy v1 API endpoints for plain webhook polling.' },
    ],
  },
  {
    id: 'ch-jun-2026',
    month: 'Jun 2026',
    version: 'v3.0.0',
    date: 'June 15, 2026',
    items: [
      { type: 'NEW', isMajor: true, text: '★ Marketplace Hub launch featuring Workflows, AI Swarm Agents, Autonomous AI-OS, and Prompts.' },
      { type: 'NEW', text: 'Creator Dashboard with payout queue breakdown and 10% platform fee calculation.' },
      { type: 'FIX', text: 'Improved dark mode contrast variables across all table rows.' },
    ],
  },
];

export const ChangelogPage: React.FC = () => {
  const getTagBadge = (type: 'NEW' | 'FIX' | 'REMOVED') => {
    switch (type) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00DAF3]/15 text-[#00DAF3] border border-[#00DAF3]/30">NEW</span>;
      case 'FIX':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30">FIX</span>;
      case 'REMOVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30">REMOVED</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 border-b border-[#232329] pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-[#E5E1E7]">Changelog</h1>
        <p className="text-[14px] font-mono text-[#8B8FA3]">
          New features, performance enhancements, and fix logs shipped to Wiki of Automation.
        </p>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#232329] space-y-12">
        {CHANGELOG_HISTORY.map(entry => (
          <div key={entry.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#131317] border-2 border-[#C0F500] group-hover:bg-[#C0F500] transition-colors" />

            <div className="space-y-4">
              {/* Release Header */}
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#E5E1E7]">{entry.month}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1E1E24] text-[#C0F500] font-mono text-[11px] font-semibold border border-[#232329]">
                  {entry.version}
                </span>
                <span className="text-[12px] font-mono text-[#5A5A68] hidden sm:inline">{entry.date}</span>
              </div>

              {/* Items Card */}
              <div className="bg-[#131317] border border-[#232329] rounded-2xl p-5 space-y-3 shadow-lg">
                {entry.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-[13px] leading-relaxed">
                    <div className="shrink-0 mt-0.5">
                      {getTagBadge(item.type)}
                    </div>
                    <span className={item.isMajor ? 'text-[#E5E1E7] font-medium' : 'text-[#8B8FA3]'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
