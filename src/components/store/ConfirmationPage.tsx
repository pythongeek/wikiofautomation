import React from 'react';

const ORDER_ITEMS = [
  {
    id: '1',
    title: 'Inbox Triage Agent',
    type: 'Agent (n8n + Claude)',
    icon: '📬',
    downloadUrl: '#',
    installCmd: 'n8n import:workflow inbox-triage-v1.json'
  },
  {
    id: '2',
    title: 'Customer Support Bot',
    type: 'Workflow (Pinecone + GPT-4o)',
    icon: '🤖',
    downloadUrl: '#',
    installCmd: 'n8n import:workflow customer-support-v2.json'
  },
  {
    id: '3',
    title: 'Neural Web Scraper',
    type: 'Python Microservice',
    icon: '🕸️',
    downloadUrl: '#',
    installCmd: 'git clone https://github.com/wikiofautomation/neural-web-scraper'
  }
];

export const ConfirmationPage: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-12 sm:py-16 font-sans text-white">
      {/* Header Banner & Animated Checkmark */}
      <div className="bg-[#131317] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c0f500]/10 via-transparent to-transparent pointer-events-none"></div>

        {/* Animated Checkmark SVG */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#c0f500]/20 border border-[#c0f500]/40 flex items-center justify-center shadow-[0_0_30px_rgba(192,245,0,0.4)]">
          <svg
            className="w-10 h-10 text-[#c0f500] stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" className="animate-[dash_1s_ease-in-out_forwards]" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Purchase Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-[#c0f500] font-mono">
            Your tools are ready to download & deploy immediately.
          </p>
        </div>

        {/* Order Details Metadata */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-2xl bg-[#1f1f23] border border-white/10 font-mono text-xs text-[#9ca3af]">
          <span>Order Number: <strong className="text-white">WOA-20261104-8821</strong></span>
          <span>·</span>
          <span>Confirmation sent to: <strong className="text-[#c0f500]">alex@company.com</strong></span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="/marketplace"
            className="px-6 h-11 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-sm shadow-[0_0_20px_rgba(192,245,0,0.3)] hover:scale-105 transition-all flex items-center gap-2 no-underline cursor-pointer min-h-[44px]"
          >
            Go to Dashboard →
          </a>
          <a
            href="/marketplace"
            className="px-6 h-11 bg-[#1f1f23] hover:bg-white/10 text-white font-mono text-xs font-bold rounded-xl border border-white/10 transition-colors flex items-center gap-2 no-underline cursor-pointer min-h-[44px]"
          >
            Continue Shopping
          </a>
        </div>
      </div>

      {/* Purchased Tools List */}
      <div className="mt-12 space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight border-b border-white/10 pb-4">
          Your Purchased Products ({ORDER_ITEMS.length})
        </h2>

        <div className="space-y-4">
          {ORDER_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-[#131317] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1f1f23] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs font-mono text-[#9ca3af]">{item.type}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => alert(`Downloading production package for ${item.title}...`)}
                  className="flex-1 sm:flex-none px-4 h-10 bg-[#1f1f23] hover:bg-[#c0f500] hover:text-[#161f00] text-white font-mono text-xs font-bold rounded-xl border border-white/10 hover:border-[#c0f500] transition-colors cursor-pointer min-h-[44px]"
                >
                  ⬇ Download Package
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(item.installCmd)}
                  className="flex-1 sm:flex-none px-4 h-10 bg-[#1f1f23] hover:bg-white/10 text-[#00e3fd] font-mono text-xs font-bold rounded-xl border border-white/10 transition-colors cursor-pointer min-h-[44px]"
                >
                  ⚡ Copy Install Command
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="border-t border-white/10 pt-12 mt-16 space-y-6">
        <h2 className="text-lg font-bold text-white tracking-tight">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#131317] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xl">🖥️</span>
              <h3 className="text-sm font-bold text-white mt-1">Autonomous Dev OS</h3>
              <p className="text-xs font-mono text-[#9ca3af]">$49/mo Pro</p>
            </div>
            <a href="/marketplace/ai-os/autonomous-dev-os" className="no-underline">
              <button className="px-3.5 h-9 bg-[#1f1f23] hover:bg-[#c0f500] hover:text-[#161f00] text-white font-mono text-xs font-bold rounded-lg border border-white/10 transition-colors cursor-pointer min-h-[36px]">
                View →
              </button>
            </a>
          </div>

          <div className="bg-[#131317] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xl">✍️</span>
              <h3 className="text-sm font-bold text-white mt-1">Claude Prompt Engineer</h3>
              <p className="text-xs font-mono text-[#c0f500]">FREE</p>
            </div>
            <a href="/marketplace/prompts/claude-prompt-engineer" className="no-underline">
              <button className="px-3.5 h-9 bg-[#1f1f23] hover:bg-[#c0f500] hover:text-[#161f00] text-white font-mono text-xs font-bold rounded-lg border border-white/10 transition-colors cursor-pointer min-h-[36px]">
                View →
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
