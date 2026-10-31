import React, { useState } from 'react';

interface IssueCard {
  issueNumber: number;
  title: string;
  date: string;
  snippet: string;
  readTime: string;
  tags: string[];
}

const PAST_ISSUES: IssueCard[] = [
  {
    issueNumber: 42,
    title: 'MCP Protocol v2.0 Released: Multi-Agent Tool Swarms',
    date: 'Aug 04, 2026',
    snippet: 'Exploring the new MCP protocol specification update, WebMCP browser bridges, and why self-hosted n8n nodes are outperforming Zapier by 4x.',
    readTime: '5 min read',
    tags: ['MCP', 'n8n', 'Swarms'],
  },
  {
    issueNumber: 41,
    title: 'Claude Sonnet vs LangGraph: Benchmark Breakdown',
    date: 'Jul 28, 2026',
    snippet: 'Full benchmark testing of multi-step tool calls across complex SQL databases and browser automation tasks.',
    readTime: '7 min read',
    tags: ['Benchmarks', 'Claude', 'LangGraph'],
  },
  {
    issueNumber: 40,
    title: 'Open Interpreter Docker OS: Autonomous Dev Environments',
    date: 'Jul 21, 2026',
    snippet: 'How builders are setting up sandboxed Docker instances for AI code generation without risking root system access.',
    readTime: '6 min read',
    tags: ['Docker', 'OpenInterpreter', 'Security'],
  },
];

export const NewsletterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C0F500]/15 border border-[#C0F500]/30 text-[#C0F500] font-mono text-[11px] font-bold">
          ⚡ WEEKLY AUTOMATION DIGEST
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#E5E1E7]">
          The Automation Digest
        </h1>

        <p className="text-lg text-[#8B8FA3] leading-relaxed">
          Weekly signal for builders — launches, benchmarks, and the workflows worth knowing about.
        </p>

        {/* Subscription Form */}
        <div className="max-w-md mx-auto space-y-3">
          {subscribed ? (
            <div className="p-4 rounded-xl bg-[#C0F500]/15 border border-[#C0F500]/30 text-[#C0F500] font-semibold text-sm animate-in fade-in">
              ✓ Welcome to the Digest! Check your inbox every Monday morning.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="enter your email address..."
                className="flex-1 bg-[#131317] border border-[#232329] rounded-xl px-4 py-3 text-[14px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#C0F500] text-[#050508] text-[14px] font-bold hover:bg-[#D4FF33] transition-all transform hover:-translate-y-0.5 shadow-lg shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-[12px] font-mono text-[#5A5A68]">
            14,000+ builders. Every Monday. Free. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Past Issues Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#232329] pb-4">
          <h2 className="text-xl font-bold text-[#E5E1E7]">Recent Issues</h2>
          <span className="text-[12px] font-mono text-[#5A5A68]">Archive (42 Issues Published)</span>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAST_ISSUES.map(issue => (
            <article
              key={issue.issueNumber}
              className="bg-[#131317] border border-[#232329] rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#C0F500]/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#5A5A68]">
                  <span>Issue #{issue.issueNumber}</span>
                  <span>{issue.date}</span>
                </div>

                <h3 className="text-base font-semibold text-[#E5E1E7] group-hover:text-[#C0F500] transition-colors leading-snug">
                  {issue.title}
                </h3>

                <p className="text-[13px] text-[#8B8FA3] line-clamp-3 leading-relaxed">
                  {issue.snippet}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1E1E24] flex items-center justify-between text-[11px]">
                <div className="flex gap-1.5 font-mono">
                  {issue.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#1E1E24] text-[#00DAF3]">{t}</span>
                  ))}
                </div>
                <span className="text-[#5A5A68] font-mono">{issue.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

    </div>
  );
};
