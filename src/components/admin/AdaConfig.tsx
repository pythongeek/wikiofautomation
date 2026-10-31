import React, { useState } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
interface FAQOverride {
  id: string;
  question: string;
  answer: string;
}

interface UnansweredQuery {
  id: string;
  query: string;
  count: number;
  lastAsked: string;
}

/* ─── Mock Data ──────────────────────────────────── */
const TOP_QUERIES = [
  { rank: 1, query: 'How do I self-host n8n with Docker?', count: 1420 },
  { rank: 2, query: 'What is Model Context Protocol (MCP)?', count: 1180 },
  { rank: 3, query: 'LangGraph vs AutoGen comparison', count: 940 },
  { rank: 4, query: 'Best open-source AI agent framework 2026', count: 820 },
  { rank: 5, query: 'How to connect Claude Sonnet to PostgreSQL', count: 650 },
  { rank: 6, query: 'Where to find free n8n workflow templates', count: 590 },
  { rank: 7, query: 'Open Interpreter Docker sandbox setup', count: 480 },
  { rank: 8, query: 'Creator payout threshold & fees', count: 410 },
  { rank: 9, query: 'How to publish my workflow to WOA marketplace', count: 390 },
  { rank: 10, query: 'Ada AI assistant rate limits for free tier', count: 320 },
];

const UNANSWERED_QUERIES: UnansweredQuery[] = [
  { id: 'uq-1', query: 'How to configure WebMCP OAuth token refresh in Astro?', count: 48, lastAsked: '12m ago' },
  { id: 'uq-2', query: 'Does LangGraph support native Rust bindings?', count: 34, lastAsked: '45m ago' },
  { id: 'uq-3', query: 'Hostinger SSH port forwarding for Redis container', count: 29, lastAsked: '2h ago' },
  { id: 'uq-4', query: 'Custom MCP server deployment on AWS Lambda', count: 21, lastAsked: '4h ago' },
];

/* ─── Top Bar ────────────────────────────────────── */
function TopBar({ breadcrumbs }: { breadcrumbs: string[] }) {
  return (
    <header className="fixed top-0 left-[240px] right-0 h-14 bg-[#131317]/95 backdrop-blur-md border-b border-[#232329] z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-[13px]">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#5A5A68]">/</span>}
            <span className={i === breadcrumbs.length - 1 ? 'text-[#E5E1E7]' : 'text-[#5A5A68]'}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pl-2 border-l border-[#232329]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C0F500] to-[#00DAF3] flex items-center justify-center text-[#050508] text-xs font-bold">A</div>
          <span className="text-[12px] text-[#8B8FA3] font-mono">@admin</span>
        </div>
      </div>
    </header>
  );
}

/* ─── Main Component ─────────────────────────────── */
export const AdaConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'queries' | 'limits' | 'sandbox'>('knowledge');
  const [faqs, setFaqs] = useState<FAQOverride[]>([
    { id: 'faq-1', question: 'What is Ada AI?', answer: 'Ada is the site’s AI brain — a floating intelligence widget with full platform knowledge.' },
    { id: 'faq-2', question: 'Are n8n workflows free?', answer: 'Many community workflows are free. Premium tools have creator-defined pricing.' },
  ]);
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /* Sandbox State */
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxLog, setSandboxLog] = useState<{ role: 'user' | 'ada'; text: string }[]>([
    { role: 'ada', text: 'Hello Admin! I am Ada in Sandbox Mode. Queries entered here are not logged in public analytics. How can I assist you?' }
  ]);

  /* Rate Limits State */
  const [rateLimits, setRateLimits] = useState({ guest: 10, free: 50, pro: 'Unlimited' });
  const [modes, setModes] = useState({
    lookup: true,
    discovery: true,
    comparison: true,
    navigation: true,
    seoAssist: true,
    languageSwitch: true,
    courseRec: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSync = (type: 'force' | 'incremental') => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast(`Ada Knowledge Base ${type === 'force' ? 'Full Re-sync' : 'Incremental Sync'} completed! 2,847 entries indexed.`);
    }, 1500);
  };

  const handleSandboxSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;
    const userMsg = sandboxInput;
    setSandboxLog(prev => [...prev, { role: 'user', text: userMsg }]);
    setSandboxInput('');
    setTimeout(() => {
      setSandboxLog(prev => [...prev, { role: 'ada', text: `[SANDBOX RESPONSE] I found 3 relevant matches for "${userMsg}" across the Wiki and Marketplace.` }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="ada" />
      <TopBar breadcrumbs={['Admin', 'Platform', 'Ada AI Configuration']} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C0F500] text-[#050508] font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
          {toastMessage}
        </div>
      )}

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-6 max-w-[1400px]">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-[#E5E1E7]">Ada AI Brain Control Center</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#6C63FF]/20 text-[#9B93FF] border border-[#6C63FF]/40">
                  v3.8 VECTOR BRAIN
                </span>
              </div>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                Knowledge indexing, unanswered query triage, rate limiting, and sandbox testing
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleSync('incremental')} disabled={syncing} className="px-3.5 py-2 rounded-lg bg-[#1E1E24] border border-[#232329] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7]">
                {syncing ? 'Syncing...' : 'Incremental Sync'}
              </button>
              <button onClick={() => handleSync('force')} disabled={syncing} className="px-3.5 py-2 rounded-lg bg-[#6C63FF] text-white text-[12px] font-semibold hover:bg-[#5B52E0]">
                Force Full Re-Sync
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#232329] pb-3">
            {[
              { id: 'knowledge', label: 'Knowledge Base', icon: 'menu_book' },
              { id: 'queries', label: 'Queries & Unanswered', icon: 'question_answer' },
              { id: 'limits', label: 'Rate Limits & Modes', icon: 'tune' },
              { id: 'sandbox', label: 'Test Ada Sandbox', icon: 'terminal' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1E1E24] text-[#6C63FF] border-l-2 border-[#6C63FF]'
                    : 'text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#131317]'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Knowledge Base Sync */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              {/* Sync Status Grid */}
              <div className="grid grid-cols-4 gap-4 font-mono text-[12px]">
                <div className="bg-[#131317] border border-[#232329] p-4 rounded-xl">
                  <span className="text-[10px] text-[#5A5A68] uppercase block mb-1">Last Index Sync</span>
                  <span className="text-[#C0F500] font-bold text-[14px]">Today at 01:55 UTC</span>
                  <span className="text-[10px] text-[#8B8FA3] block mt-1">Automatic cron sync</span>
                </div>
                <div className="bg-[#131317] border border-[#232329] p-4 rounded-xl">
                  <span className="text-[10px] text-[#5A5A68] uppercase block mb-1">Indexed Vector Entries</span>
                  <span className="text-[#00DAF3] font-bold text-[14px]">2,847 Documents</span>
                  <span className="text-[10px] text-[#8B8FA3] block mt-1">100% embeddings ready</span>
                </div>
                <div className="bg-[#131317] border border-[#232329] p-4 rounded-xl">
                  <span className="text-[10px] text-[#5A5A68] uppercase block mb-1">Sync Schedule</span>
                  <select className="bg-[#0E0E12] border border-[#232329] text-[11px] text-[#E5E1E7] rounded px-2 py-1 mt-1 w-full">
                    <option>Every 6 Hours (Default)</option>
                    <option>Hourly</option>
                    <option>Daily at Midnight</option>
                  </select>
                </div>
                <div className="bg-[#131317] border border-[#232329] p-4 rounded-xl">
                  <span className="text-[10px] text-[#5A5A68] uppercase block mb-1">Custom FAQ Overrides</span>
                  <span className="text-[#F5A623] font-bold text-[14px]">{faqs.length} Custom Pairs</span>
                  <span className="text-[10px] text-[#8B8FA3] block mt-1">Overrides vector search</span>
                </div>
              </div>

              {/* Custom FAQ Overrides */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#E5E1E7]">Custom FAQ Overrides (Priority Match)</h3>
                  <button
                    onClick={() => setFaqs([...faqs, { id: `faq-${Date.now()}`, question: '', answer: '' }])}
                    className="px-3 py-1 rounded bg-[#6C63FF]/20 text-[#9B93FF] text-[11px] font-mono hover:bg-[#6C63FF]/30"
                  >
                    + Add FAQ Pair
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={faq.id} className="bg-[#0E0E12] border border-[#1E1E24] p-3.5 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#5A5A68]">Q{idx + 1}:</span>
                        <input
                          type="text" value={faq.question}
                          onChange={e => { const copy = [...faqs]; copy[idx].question = e.target.value; setFaqs(copy); }}
                          placeholder="Question..."
                          className="flex-1 bg-transparent border-b border-[#232329] text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#6C63FF]"
                        />
                        <button onClick={() => setFaqs(faqs.filter(f => f.id !== faq.id))} className="text-[#FF6B6B]">
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        </button>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[11px] font-mono text-[#5A5A68] mt-1">A{idx + 1}:</span>
                        <textarea
                          value={faq.answer}
                          onChange={e => { const copy = [...faqs]; copy[idx].answer = e.target.value; setFaqs(copy); }}
                          placeholder="Answer override..."
                          rows={2}
                          className="flex-1 bg-transparent border-b border-[#232329] text-[12px] text-[#8B8FA3] focus:outline-none focus:border-[#6C63FF] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page-Specific Context Strings */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Page-Specific System Prompt Context Strings</h3>
                <p className="text-[11px] text-[#8B8FA3]">Injected into Ada's context window depending on the current user route.</p>
                <div className="grid grid-cols-3 gap-4 font-mono text-[12px]">
                  <div className="bg-[#0E0E12] border border-[#1E1E24] p-3 rounded-lg space-y-1">
                    <span className="text-[10px] text-[#C0F500]">Route: /wiki/*</span>
                    <textarea
                      defaultValue="Focus on technical accuracy, installation prerequisites, and architecture diagrams."
                      rows={2} className="w-full bg-transparent text-[11px] text-[#E5E1E7] focus:outline-none resize-none"
                    />
                  </div>
                  <div className="bg-[#0E0E12] border border-[#1E1E24] p-3 rounded-lg space-y-1">
                    <span className="text-[10px] text-[#00DAF3]">Route: /marketplace/*</span>
                    <textarea
                      defaultValue="Emphasize tool licenses, creator ratings, pricing comparison, and one-click deployment."
                      rows={2} className="w-full bg-transparent text-[11px] text-[#E5E1E7] focus:outline-none resize-none"
                    />
                  </div>
                  <div className="bg-[#0E0E12] border border-[#1E1E24] p-3 rounded-lg space-y-1">
                    <span className="text-[10px] text-[#9B93FF]">Route: /compare/*</span>
                    <textarea
                      defaultValue="Provide neutral side-by-side feature matrix evaluations and self-hosting trade-offs."
                      rows={2} className="w-full bg-transparent text-[11px] text-[#E5E1E7] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Queries & Unanswered */}
          {activeTab === 'queries' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Top Queries */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Top 10 Queries (Last 7 Days)</h3>
                <div className="divide-y divide-[#1E1E24]">
                  {TOP_QUERIES.map(q => (
                    <div key={q.rank} className="py-2.5 flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-[10px] font-mono text-[#5A5A68] w-4">{q.rank}.</span>
                        <span className="text-[#E5E1E7] truncate">{q.query}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#C0F500] font-bold">{q.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unanswered Queries Triage */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#E5E1E7]">Unanswered Query Triage</h3>
                  <span className="text-[10px] font-mono text-[#FF6B6B]">4 queries need entries</span>
                </div>
                <div className="space-y-3">
                  {UNANSWERED_QUERIES.map(uq => (
                    <div key={uq.id} className="bg-[#0E0E12] border border-[#1E1E24] p-3 rounded-lg space-y-2">
                      <p className="text-[13px] font-medium text-[#E5E1E7]">"{uq.query}"</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#5A5A68]">
                        <span>Asked {uq.count} times · Last {uq.lastAsked}</span>
                        <div className="flex gap-1.5">
                          <button onClick={() => showToast('Redirecting to Wiki editor...')} className="px-2 py-0.5 rounded bg-[#C0F500]/15 text-[#C0F500] hover:bg-[#C0F500]/25">
                            + Add Wiki Entry
                          </button>
                          <button onClick={() => showToast('Added to FAQ overrides!')} className="px-2 py-0.5 rounded bg-[#6C63FF]/15 text-[#9B93FF] hover:bg-[#6C63FF]/25">
                            + Add FAQ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Limits & Enabled Modes */}
          {activeTab === 'limits' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Rate Limits */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Daily Query Rate Limits</h3>
                <div className="space-y-3 font-mono text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B8FA3]">Guest Users:</span>
                    <input
                      type="number" value={rateLimits.guest}
                      onChange={e => setRateLimits({ ...rateLimits, guest: Number(e.target.value) })}
                      className="w-20 bg-[#0E0E12] border border-[#232329] rounded px-2 py-1 text-right text-[#C0F500]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B8FA3]">Free Registered Users:</span>
                    <input
                      type="number" value={rateLimits.free}
                      onChange={e => setRateLimits({ ...rateLimits, free: Number(e.target.value) })}
                      className="w-20 bg-[#0E0E12] border border-[#232329] rounded px-2 py-1 text-right text-[#00DAF3]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B8FA3]">Pro Creator Subscribers:</span>
                    <span className="text-[#F5A623] font-bold">Unlimited</span>
                  </div>
                </div>

                {/* Rate Limit Exceeded Message Editor */}
                <div>
                  <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Rate Limit Exceeded Message</label>
                  <textarea
                    defaultValue="You have reached your daily limit of Ada AI queries. Upgrade to Pro Creator for unlimited access!"
                    rows={2} className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] resize-none focus:outline-none focus:border-[#C0F500]"
                  />
                </div>

                <button onClick={() => showToast('Rate limits saved!')} className="w-full py-2 rounded bg-[#C0F500] text-[#050508] text-[12px] font-semibold">
                  Save Rate Limit Config
                </button>
              </div>

              {/* Enabled Modes Toggles */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Enabled Ada Intelligence Modes</h3>
                <div className="space-y-2 text-[12px]">
                  {Object.entries(modes).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-1 border-b border-[#1E1E24]">
                      <span className="text-[#E5E1E7] capitalize">{key.replace(/([A-Z])/g, ' $1')} Mode</span>
                      <button
                        onClick={() => setModes({ ...modes, [key]: !val })}
                        className={`w-9 h-5 rounded-full relative transition-colors ${val ? 'bg-[#6C63FF]' : 'bg-[#232329]'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${val ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Sandbox */}
          {activeTab === 'sandbox' && (
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#232329] pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#E5E1E7]">Ada Live Test Sandbox</h3>
                  <p className="text-[11px] text-[#5A5A68] font-mono">Test prompt responses without recording to public analytics</p>
                </div>
                <button onClick={() => setSandboxLog([])} className="text-[11px] font-mono text-[#FF6B6B]">Clear Log</button>
              </div>

              <div className="bg-[#0E0E12] border border-[#1E1E24] rounded-lg p-4 h-[300px] overflow-y-auto space-y-3 font-mono text-[12px]">
                {sandboxLog.map((msg, i) => (
                  <div key={i} className={`p-2.5 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'ml-auto bg-[#1E1E24] text-[#E5E1E7]' : 'bg-[#6C63FF]/15 text-[#9B93FF] border border-[#6C63FF]/30'}`}>
                    <span className="text-[10px] opacity-60 block mb-0.5">{msg.role === 'user' ? 'You (Admin)' : 'Ada AI'}</span>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSandboxSend} className="flex gap-2">
                <input
                  type="text" value={sandboxInput} onChange={e => setSandboxInput(e.target.value)}
                  placeholder="Ask Ada anything to test response logic..."
                  className="flex-1 bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#6C63FF]"
                />
                <button type="submit" className="px-4 py-2 bg-[#6C63FF] text-white rounded-lg text-[12px] font-semibold">Send</button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
