import React, { useState } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Sparkline SVG Charts ───────────────────────── */
const TRAFFIC_DATA = [4200, 5100, 4800, 6200, 7100, 6800, 8400, 9200, 8900, 10400, 11800, 12400];

function MiniChart({ data, color, height = 100 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / (max - min)) * (height - 8) - 4}`).join(' ');
  const areaPoints = `0,${height} ${points} ${w},${height}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`grad-ana-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-ana-${color.replace('#','')})`} />
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

export const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [chartTab, setChartTab] = useState<'traffic' | 'pages' | 'country' | 'device' | 'referrer'>('traffic');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="analytics" />
      <TopBar breadcrumbs={['Admin', 'System', 'Platform Analytics']} />

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C0F500] text-[#050508] font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
          {toastMsg}
        </div>
      )}

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-6 max-w-[1400px]">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#E5E1E7]">Traffic & Platform Analytics</h1>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                Real-time page views, visitor breakdown, referrer metrics, & Ada usage stats
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-[#131317] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7]">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Year to Date</option>
              </select>
              <button onClick={() => showToast('Exporting analytics CSV...')} className="px-3.5 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33]">
                Export CSV
              </button>
            </div>
          </div>

          {/* 6 Key Overview Metric Cards */}
          <div className="grid grid-cols-6 gap-3 font-mono">
            {[
              { label: 'Unique Visitors', val: '42,890', sub: '+14.2%' },
              { label: 'Page Views', val: '184,200', sub: '+18.9%' },
              { label: 'Avg Session', val: '4m 12s', sub: '+32s' },
              { label: 'Bounce Rate', val: '28.4%', sub: '-2.1%' },
              { label: 'New Users', val: '12,400', sub: '+8.1%' },
              { label: 'Returning', val: '71.1%', sub: '+3.4%' },
            ].map((m, i) => (
              <div key={i} className="bg-[#131317] border border-[#232329] p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-[#5A5A68] uppercase block">{m.label}</span>
                <span className="text-[20px] font-bold text-[#E5E1E7] block">{m.val}</span>
                <span className="text-[11px] text-[#C0F500]">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* Main Chart Section */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232329] pb-3">
              <div className="flex gap-2">
                {[
                  { id: 'traffic', label: 'Traffic Over Time' },
                  { id: 'pages', label: 'By Page Type' },
                  { id: 'country', label: 'By Country' },
                  { id: 'device', label: 'By Device' },
                  { id: 'referrer', label: 'By Referrer' },
                  { id: 'queries', label: 'Search Queries' },
                ].map(ct => (
                  <button
                    key={ct.id}
                    onClick={() => setChartTab(ct.id as any)}
                    className={`px-3 py-1 rounded text-[12px] font-mono transition-colors ${
                      chartTab === ct.id ? 'bg-[#C0F500]/15 text-[#C0F500] font-bold' : 'text-[#8B8FA3] hover:text-[#E5E1E7]'
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            {chartTab === 'traffic' && (
              <div>
                <MiniChart data={TRAFFIC_DATA} color="#00DAF3" height={140} />
                <div className="flex justify-between text-[10px] font-mono text-[#5A5A68] mt-2">
                  <span>Jul 11</span><span>Jul 20</span><span>Jul 30</span><span>Aug 10</span>
                </div>
              </div>
            )}

            {chartTab !== 'traffic' && (
              <div className="space-y-2 font-mono text-[12px]">
                <div className="flex justify-between"><span>1. United States / Google Organic</span><span className="text-[#C0F500]">42.1% (18,056)</span></div>
                <div className="flex justify-between"><span>2. Germany / Direct Bookmark</span><span className="text-[#00DAF3]">18.4% (7,891)</span></div>
                <div className="flex justify-between"><span>3. United Kingdom / GitHub Referrer</span><span className="text-[#6C63FF]">12.8% (5,489)</span></div>
              </div>
            )}
          </div>

          {/* Top Pages List */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#E5E1E7]">Top Performing Pages (30 Days)</h3>
            <div className="divide-y divide-[#1E1E24] font-mono text-[12px]">
              {[
                { path: '/wiki/frameworks/n8n', views: '34,120 views', time: '5m 14s' },
                { path: '/marketplace/workflows/n8n-stripe-drip-workflow', views: '21,800 views', time: '3m 45s' },
                { path: '/compare/n8n-vs-make', views: '18,400 views', time: '6m 20s' },
                { path: '/news/mcp-protocol-v2-launch', views: '14,290 views', time: '2m 50s' },
              ].map((page, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <span className="text-[#00DAF3] font-semibold">{page.path}</span>
                  <div className="flex gap-4 text-[#8B8FA3]">
                    <span className="text-[#C0F500] font-bold">{page.views}</span>
                    <span>Avg {page.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ada AI Analytics Box */}
          <div className="bg-[#131317] border border-[#6C63FF]/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6C63FF]" style={{ fontSize: 20 }}>smart_toy</span>
              <h3 className="text-sm font-semibold text-[#E5E1E7]">Ada AI Widget Performance Metrics</h3>
            </div>
            <div className="grid grid-cols-5 gap-3 font-mono text-[12px]">
              <div className="bg-[#0E0E12] p-3 rounded-lg border border-[#1E1E24]">
                <span className="text-[10px] text-[#5A5A68] block">Queries Today</span>
                <span className="text-[#C0F500] text-base font-bold">1,840</span>
              </div>
              <div className="bg-[#0E0E12] p-3 rounded-lg border border-[#1E1E24]">
                <span className="text-[10px] text-[#5A5A68] block">Avg Per Session</span>
                <span className="text-[#00DAF3] text-base font-bold">3.2</span>
              </div>
              <div className="bg-[#0E0E12] p-3 rounded-lg border border-[#1E1E24]">
                <span className="text-[10px] text-[#5A5A68] block">Top Mode</span>
                <span className="text-[#9B93FF] text-base font-bold">Discovery</span>
              </div>
              <div className="bg-[#0E0E12] p-3 rounded-lg border border-[#1E1E24]">
                <span className="text-[10px] text-[#5A5A68] block">Unanswered Rate</span>
                <span className="text-[#FF6B6B] text-base font-bold">2.1%</span>
              </div>
              <div className="bg-[#0E0E12] p-3 rounded-lg border border-[#1E1E24]">
                <span className="text-[10px] text-[#5A5A68] block">Sessions with Ada</span>
                <span className="text-[#F5A623] text-base font-bold">48.2%</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
