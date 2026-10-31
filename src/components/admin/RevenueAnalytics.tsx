import React, { useState, useMemo } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
interface Transaction {
  id: string;
  date: string;
  buyerHandle: string;
  itemTitle: string;
  amount: string;
  amountNum: number;
  method: 'Stripe' | 'Crypto' | 'PayPal';
  status: 'completed' | 'refunded' | 'failed';
}

/* ─── Mock Data ──────────────────────────────────── */
const TRANSACTIONS: Transaction[] = [
  { id: 'tx-1001', date: '2026-08-10T14:32:00Z', buyerHandle: '@john_doe', itemTitle: 'n8n Stripe Drip & Webhook Engine', amount: '$29.00', amountNum: 29, method: 'Stripe', status: 'completed' },
  { id: 'tx-1002', date: '2026-08-10T12:15:00Z', buyerHandle: '@dev_mark', itemTitle: 'Autonomous Dev OS (Docker + Open Interpreter)', amount: '$49.00', amountNum: 49, method: 'Crypto', status: 'completed' },
  { id: 'tx-1003', date: '2026-08-10T09:40:00Z', buyerHandle: '@sarah_k', itemTitle: 'Claude 3.7 Sonnet Master Prompt Suite', amount: '$19.00', amountNum: 19, method: 'Stripe', status: 'completed' },
  { id: 'tx-1004', date: '2026-08-09T22:10:00Z', buyerHandle: '@alex_m', itemTitle: 'LangGraph Autonomous Customer Support Agent', amount: '$79.00', amountNum: 79, method: 'Stripe', status: 'completed' },
  { id: 'tx-1005', date: '2026-08-09T18:05:00Z', buyerHandle: '@code_craft', itemTitle: 'n8n Enterprise Salesforce & Hubspot Sync', amount: '$39.00', amountNum: 39, method: 'PayPal', status: 'completed' },
  { id: 'tx-1006', date: '2026-08-09T14:20:00Z', buyerHandle: '@buyer_88', itemTitle: 'Unverified Web Scraper Bot', amount: '$99.00', amountNum: 99, method: 'Stripe', status: 'refunded' },
  { id: 'tx-1007', date: '2026-08-09T10:00:00Z', buyerHandle: '@crypto_ninja', itemTitle: 'Auto-Scraper & Vector DB Indexer', amount: '$49.00', amountNum: 49, method: 'Crypto', status: 'completed' },
  { id: 'tx-1008', date: '2026-08-08T20:30:00Z', buyerHandle: '@startup_ceo', itemTitle: 'n8n Stripe Drip & Webhook Engine', amount: '$29.00', amountNum: 29, method: 'Stripe', status: 'completed' },
];

/* ─── Sparkline SVG Charts ───────────────────────── */
const GMV_90D = [22, 28, 24, 32, 38, 34, 42, 48, 52, 46, 58, 62, 56, 68, 72, 64, 78, 84, 88, 82, 94, 102, 96, 108, 112, 118, 124];

function MiniChart({ data, color, height = 90 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / (max - min)) * (height - 8) - 4}`).join(' ');
  const areaPoints = `0,${height} ${points} ${w},${height}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`grad-rev-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-rev-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

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
export const RevenueAnalytics: React.FC = () => {
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filteredTxs = useMemo(() => {
    return TRANSACTIONS.filter(t => {
      const matchesMethod = methodFilter === 'All' || t.method === methodFilter;
      const matchesSearch = t.buyerHandle.toLowerCase().includes(search.toLowerCase()) ||
                            t.itemTitle.toLowerCase().includes(search.toLowerCase());
      return matchesMethod && matchesSearch;
    });
  }, [methodFilter, search]);

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="revenue" />
      <TopBar breadcrumbs={['Admin', 'Platform', 'Revenue & Transactions']} />

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-6 max-w-[1400px]">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#E5E1E7]">Revenue & Financial Analytics</h1>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                GMV volume, platform net cut (10%), subscription MRR, and transaction ledger
              </p>
            </div>
            <button className="px-3.5 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
              Export Full Financial Report (.csv)
            </button>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-4 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">This Month GMV</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-bold font-mono text-[#E5E1E7]">$38,420</span>
                <span className="text-[12px] font-mono text-[#C0F500]">+18.4%</span>
              </div>
              <p className="text-[10px] text-[#5A5A68]">Gross merchandise volume across all tool sales</p>
            </div>

            <div className="bg-[#131317] border border-[#232329] rounded-xl p-4 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">Platform Net Cut (10%)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-bold font-mono text-[#C0F500]">$3,842</span>
                <span className="text-[12px] font-mono text-[#C0F500]">+18.4%</span>
              </div>
              <p className="text-[10px] text-[#5A5A68]">Net platform revenue after creator payouts</p>
            </div>

            <div className="bg-[#131317] border border-[#232329] rounded-xl p-4 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">Subscription MRR</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-bold font-mono text-[#00DAF3]">$24,100</span>
                <span className="text-[12px] font-mono text-[#00DAF3]">+12.0%</span>
              </div>
              <p className="text-[10px] text-[#5A5A68]">Recurring tool & Pro creator subscriptions (62.7%)</p>
            </div>

            <div className="bg-[#131317] border border-[#232329] rounded-xl p-4 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">One-Time Purchases</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-bold font-mono text-[#F5A623]">$14,320</span>
                <span className="text-[12px] font-mono text-[#F5A623]">+8.5%</span>
              </div>
              <p className="text-[10px] text-[#5A5A68]">Direct single workflow license sales (37.3%)</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* GMV Over Time Line Chart */}
            <div className="col-span-2 bg-[#131317] border border-[#232329] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#E5E1E7]">GMV Growth Trajectory (90 Days)</h3>
                  <p className="text-[11px] text-[#5A5A68] font-mono">Daily transaction volume trends</p>
                </div>
                <div className="flex gap-1">
                  {['30d', '90d', '1y'].map(range => (
                    <button key={range} className={`px-2.5 py-1 rounded text-[11px] font-mono ${range === '90d' ? 'bg-[#C0F500]/15 text-[#C0F500]' : 'text-[#5A5A68]'}`}>
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <MiniChart data={GMV_90D} color="#C0F500" height={130} />
              <div className="flex justify-between mt-2 text-[10px] font-mono text-[#5A5A68]">
                <span>May 2026</span><span>Jun 2026</span><span>Jul 2026</span><span>Aug 2026</span>
              </div>
            </div>

            {/* Revenue Split Donut */}
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Revenue by Category</h3>
                <p className="text-[11px] text-[#5A5A68] font-mono">Gross distribution</p>
              </div>

              <div className="space-y-3 font-mono text-[12px]">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#E5E1E7]">Workflows (n8n)</span>
                    <span className="text-[#C0F500]">45% ($17,289)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1E1E24] overflow-hidden">
                    <div className="h-full bg-[#C0F500] w-[45%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#E5E1E7]">AI Swarm Agents</span>
                    <span className="text-[#00DAF3]">30% ($11,526)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1E1E24] overflow-hidden">
                    <div className="h-full bg-[#00DAF3] w-[30%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#E5E1E7]">Autonomous AI-OS</span>
                    <span className="text-[#6C63FF]">15% ($5,763)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1E1E24] overflow-hidden">
                    <div className="h-full bg-[#6C63FF] w-[15%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#E5E1E7]">Prompt Suites</span>
                    <span className="text-[#F5A623]">10% ($3,842)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1E1E24] overflow-hidden">
                    <div className="h-full bg-[#F5A623] w-[10%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#E5E1E7]">Live Transaction Ledger</h3>
              <div className="flex items-center gap-3">
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter buyer, item..."
                  className="bg-[#131317] border border-[#232329] rounded-lg px-3 py-1.5 text-[12px] text-[#E5E1E7] placeholder:text-[#5A5A68]"
                />
                <div className="flex items-center gap-1">
                  {['All', 'Stripe', 'Crypto', 'PayPal'].map(m => (
                    <button
                      key={m} onClick={() => setMethodFilter(m)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono ${methodFilter === m ? 'bg-[#C0F500]/15 text-[#C0F500]' : 'text-[#5A5A68]'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#232329] text-[11px] uppercase tracking-wider text-[#5A5A68]">
                    <th className="py-3 px-4 text-left">Transaction ID</th>
                    <th className="py-3 px-4 text-left">Date & Time</th>
                    <th className="py-3 px-4 text-left">Buyer Handle</th>
                    <th className="py-3 px-4 text-left">Item Purchased</th>
                    <th className="py-3 px-4 text-left">Method</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E24]">
                  {filteredTxs.map(tx => (
                    <tr key={tx.id} className="hover:bg-[#0E0E12] transition-colors">
                      <td className="py-3 px-4 text-[12px] font-mono text-[#C0F500]">{tx.id}</td>
                      <td className="py-3 px-4 text-[12px] text-[#8B8FA3]">{new Date(tx.date).toLocaleString()}</td>
                      <td className="py-3 px-4 text-[12px] font-mono text-[#E5E1E7]">{tx.buyerHandle}</td>
                      <td className="py-3 px-4 text-[13px] text-[#E5E1E7] font-medium">{tx.itemTitle}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E1E24] text-[#00DAF3]">{tx.method}</span>
                      </td>
                      <td className="py-3 px-4 text-[13px] font-mono font-bold text-[#E5E1E7]">{tx.amount}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          tx.status === 'completed' ? 'bg-[#C0F500]/15 text-[#C0F500]' : 'bg-[#FF6B6B]/15 text-[#FF6B6B]'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
