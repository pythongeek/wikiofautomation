import React, { useState, useEffect } from 'react';

/* ─── Types ──────────────────────────────────────── */
interface MetricCard {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  icon: string;
}

interface AlertItem {
  id: string;
  message: string;
  type: 'warn' | 'error' | 'info';
  time: string;
}

interface ActivityItem {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  type: 'content' | 'user' | 'revenue' | 'system' | 'moderation';
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  href: string;
}

/* ─── Nav Items ──────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { id: 'overview', label: 'Overview', icon: 'dashboard', href: '/admin/overview' },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'wiki', label: 'Wiki', icon: 'menu_book', href: '/admin/content/wiki' },
      { id: 'news', label: 'News', icon: 'newspaper', href: '/admin/content/news' },
      { id: 'marketplace', label: 'Marketplace', icon: 'storefront', href: '/admin/content/marketplace' },
      { id: 'academy', label: 'Academy', icon: 'school', href: '/admin/content/academy' },
    ],
  },
  {
    label: 'People',
    items: [
      { id: 'users', label: 'Users', icon: 'group', href: '/admin/users' },
      { id: 'creators', label: 'Creators', icon: 'engineering', href: '/admin/creators' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { id: 'revenue', label: 'Revenue', icon: 'payments', href: '/admin/revenue' },
      { id: 'ada', label: 'Ada', icon: 'smart_toy', href: '/admin/ada' },
      { id: 'seo', label: 'SEO', icon: 'travel_explore', href: '/admin/seo' },
      { id: 'branding', label: 'Branding & Guidelines', icon: 'palette', href: '/admin/branding' },
      { id: 'moderation', label: 'Moderation', icon: 'shield', href: '/admin/moderation' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'analytics', label: 'Analytics', icon: 'analytics', href: '/admin/analytics' },
      { id: 'system', label: 'System', icon: 'dns', href: '/admin/system' },
      { id: 'logs', label: 'Logs', icon: 'receipt_long', href: '/admin/logs' },
    ],
  },
];

/* ─── Mock Data ──────────────────────────────────── */
const METRICS: MetricCard[] = [
  { id: 'm1', label: 'Online Now', value: '1,204', delta: '+18%', deltaUp: true, icon: 'visibility' },
  { id: 'm2', label: 'GMV Today', value: '$3,840', delta: '+12%', deltaUp: true, icon: 'payments' },
  { id: 'm3', label: 'New Listings', value: '12', delta: '+4', deltaUp: true, icon: 'add_box' },
  { id: 'm4', label: 'Pending Reviews', value: '3', delta: '-2', deltaUp: false, icon: 'rate_review' },
];

const ALERTS: AlertItem[] = [
  { id: 'a1', message: 'SSL certificate for cdn.wikiofautomation.com renews in 7 days', type: 'warn', time: '2m ago' },
  { id: 'a2', message: '3 marketplace listings flagged for duplicate content', type: 'warn', time: '14m ago' },
  { id: 'a3', message: 'Ada response latency spike (p95 > 2.4s) at 03:42 UTC', type: 'error', time: '38m ago' },
];

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'q1', label: 'New Wiki Entry', icon: 'edit_note', description: 'Draft & publish wiki content', href: '/admin/content/wiki?action=new' },
  { id: 'q2', label: 'Publish News', icon: 'campaign', description: 'Write & schedule an article', href: '/admin/content/news?action=new' },
  { id: 'q3', label: 'Review Listings', icon: 'fact_check', description: '3 pending approvals', href: '/admin/content/marketplace?filter=pending' },
  { id: 'q4', label: 'Ada Training', icon: 'model_training', description: 'Fine-tune Ada responses', href: '/admin/ada' },
  { id: 'q5', label: 'SEO Audit', icon: 'search_insights', description: 'Run schema gap analysis', href: '/admin/seo' },
  { id: 'q6', label: 'Export Data', icon: 'download', description: 'Download CSV reports', href: '/admin/analytics' },
];

const ACTIVITIES: ActivityItem[] = [
  { id: 'ac1', action: 'Published wiki entry', actor: 'admin@woa', target: 'Claude 4.0 Opus Deep Dive', timestamp: '2026-08-10T03:58:00Z', type: 'content' },
  { id: 'ac2', action: 'Approved listing', actor: 'admin@woa', target: 'n8n Stripe Webhook Engine v2.1', timestamp: '2026-08-10T03:45:00Z', type: 'content' },
  { id: 'ac3', action: 'New creator signup', actor: 'system', target: '@neural_architect', timestamp: '2026-08-10T03:32:00Z', type: 'user' },
  { id: 'ac4', action: 'Payout processed', actor: 'stripe', target: '$1,240.00 → @dev_swarm', timestamp: '2026-08-10T03:18:00Z', type: 'revenue' },
  { id: 'ac5', action: 'Flagged review', actor: 'automod', target: 'Review #4821 — spam detected', timestamp: '2026-08-10T03:05:00Z', type: 'moderation' },
  { id: 'ac6', action: 'Wiki entry updated', actor: 'admin@woa', target: 'Model Context Protocol v2 spec', timestamp: '2026-08-10T02:48:00Z', type: 'content' },
  { id: 'ac7', action: 'SSL renewed', actor: 'system', target: 'wikiofautomation.com', timestamp: '2026-08-10T02:30:00Z', type: 'system' },
  { id: 'ac8', action: 'New listing submitted', actor: '@elena_r', target: 'LangGraph Multi-Agent Orchestrator', timestamp: '2026-08-10T02:15:00Z', type: 'content' },
  { id: 'ac9', action: 'Ada knowledge base synced', actor: 'system', target: '2,847 entries indexed', timestamp: '2026-08-10T01:55:00Z', type: 'system' },
  { id: 'ac10', action: 'User banned', actor: 'admin@woa', target: '@spam_bot_42', timestamp: '2026-08-10T01:30:00Z', type: 'moderation' },
  { id: 'ac11', action: 'Database backup completed', actor: 'cron', target: 'woa_prod_20260810.sql.gz (42MB)', timestamp: '2026-08-10T01:00:00Z', type: 'system' },
  { id: 'ac12', action: 'News article published', actor: 'admin@woa', target: 'Claude 5 Sonnet Public Preview Announcement', timestamp: '2026-08-10T00:42:00Z', type: 'content' },
];

/* ─── Sparkline SVG ──────────────────────────────── */
const CHART_DATA = [12, 18, 14, 22, 28, 24, 32, 38, 34, 42, 48, 52, 46, 58, 62, 56, 68, 72, 64, 78, 84, 88, 82, 94, 102, 96, 108, 112, 118, 124];
const CHART_SESSIONS = [320, 380, 340, 420, 480, 440, 520, 580, 540, 620, 680, 720, 660, 780, 820, 760, 880, 920, 840, 980, 1040, 1080, 1020, 1140, 1200, 1160, 1280, 1320, 1380, 1440];

function MiniChart({ data, color, height = 80 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / (max - min)) * (height - 8) - 4}`).join(' ');
  const areaPoints = `0,${height} ${points} ${w},${height}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Activity type color ────────────────────────── */
function typeColor(type: ActivityItem['type']) {
  switch (type) {
    case 'content': return '#C0F500';
    case 'user': return '#00DAF3';
    case 'revenue': return '#F5A623';
    case 'system': return '#8B8FA3';
    case 'moderation': return '#FF6B6B';
    default: return '#8B8FA3';
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

/* ─── Admin Sidebar (shared) ─────────────────────── */
export function AdminSidebar({ activeId }: { activeId: string }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#131317] border-r border-[#232329] z-40 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center gap-2 border-b border-[#232329] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#C0F500] flex items-center justify-center">
          <span className="text-[#050508] font-bold text-xs">W</span>
        </div>
        <span className="font-semibold text-sm text-[#E5E1E7] tracking-tight">WOA Admin</span>
      </div>
      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#5A5A68]">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = item.id === activeId;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors ${
                        active
                          ? 'bg-[#1E1E24] text-[#C0F500] border-l-[3px] border-[#C0F500] pl-[7px]'
                          : 'text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#1A1A20]'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#232329] shrink-0">
        <p className="text-[10px] text-[#5A5A68] font-mono">v2.4.0 · Astro SSR</p>
      </div>
    </aside>
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
        <button className="w-8 h-8 rounded-lg bg-[#1E1E24] border border-[#232329] flex items-center justify-center text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications</span>
        </button>
        <button className="w-8 h-8 rounded-lg bg-[#1E1E24] border border-[#232329] flex items-center justify-center text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>settings</span>
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-[#232329]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C0F500] to-[#00DAF3] flex items-center justify-center text-[#050508] text-xs font-bold">A</div>
          <span className="text-[12px] text-[#8B8FA3] font-mono">@admin</span>
        </div>
      </div>
    </header>
  );
}

/* ─── Main Component ─────────────────────────────── */
export const AdminOverview: React.FC = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [refreshTimer, setRefreshTimer] = useState(30);
  const [visibleActivities, setVisibleActivities] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTimer(prev => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => new Set([...prev, id]));
  };

  const activeAlerts = ALERTS.filter(a => !dismissedAlerts.has(a.id));

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="overview" />
      <TopBar breadcrumbs={['Admin', 'Overview']} />

      {/* Main Content */}
      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-5 max-w-[1400px]">

          {/* Alerts Bar */}
          {activeAlerts.length > 0 && (
            <div className="space-y-2">
              {activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg border-l-[3px] ${
                    alert.type === 'error'
                      ? 'bg-[#FF6B6B]/8 border-[#FF6B6B] text-[#FF9B9B]'
                      : alert.type === 'warn'
                        ? 'bg-[#F5A623]/8 border-[#F5A623] text-[#F5C977]'
                        : 'bg-[#00DAF3]/8 border-[#00DAF3] text-[#7BE8F4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      {alert.type === 'error' ? 'error' : alert.type === 'warn' ? 'warning' : 'info'}
                    </span>
                    <span className="text-[13px]">{alert.message}</span>
                    <span className="text-[11px] font-mono opacity-60">{alert.time}</span>
                  </div>
                  <button onClick={() => dismissAlert(alert.id)} className="text-[#5A5A68] hover:text-[#E5E1E7] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Live Stats Row */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[#E5E1E7]">Overview</h1>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5A5A68]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C0F500] animate-pulse" />
              Auto-refresh in {refreshTimer}s
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {METRICS.map(m => (
              <div key={m.id} className="bg-[#131317] border border-[#232329] rounded-xl p-4 group hover:border-[#353539] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">{m.label}</span>
                  <span className="material-symbols-outlined text-[#5A5A68] group-hover:text-[#8B8FA3] transition-colors" style={{ fontSize: 18 }}>{m.icon}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold font-mono tracking-tight text-[#E5E1E7]">{m.value}</span>
                  <span className={`text-[12px] font-mono font-medium ${m.deltaUp ? 'text-[#C0F500]' : 'text-[#FF6B6B]'}`}>{m.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts + Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {/* Revenue Chart */}
            <div className="col-span-2 bg-[#131317] border border-[#232329] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#E5E1E7]">Revenue (30d)</h3>
                  <p className="text-[11px] text-[#5A5A68] font-mono mt-0.5">$38,420 total · $1,280/day avg</p>
                </div>
                <div className="flex gap-1">
                  {['7d', '30d', '90d'].map(range => (
                    <button key={range} className={`px-2.5 py-1 rounded text-[11px] font-mono ${range === '30d' ? 'bg-[#C0F500]/15 text-[#C0F500]' : 'text-[#5A5A68] hover:text-[#8B8FA3]'}`}>
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <MiniChart data={CHART_DATA} color="#C0F500" height={120} />
              <div className="flex justify-between mt-2 text-[10px] font-mono text-[#5A5A68]">
                <span>Jul 11</span><span>Jul 21</span><span>Aug 01</span><span>Aug 10</span>
              </div>
            </div>

            {/* Sessions Chart */}
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Sessions (30d)</h3>
                <p className="text-[11px] text-[#5A5A68] font-mono mt-0.5">24,800 total</p>
              </div>
              <MiniChart data={CHART_SESSIONS} color="#00DAF3" height={120} />
              <div className="flex justify-between mt-2 text-[10px] font-mono text-[#5A5A68]">
                <span>Jul 11</span><span>Aug 10</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-[#E5E1E7] mb-3">Quick Actions</h3>
            <div className="grid grid-cols-6 gap-3">
              {QUICK_ACTIONS.map(qa => (
                <a key={qa.id} href={qa.href} className="bg-[#131317] border border-[#232329] rounded-xl p-4 hover:border-[#C0F500]/30 hover:bg-[#131317]/80 transition-all group cursor-pointer block">
                  <span className="material-symbols-outlined text-[#5A5A68] group-hover:text-[#C0F500] transition-colors mb-2 block" style={{ fontSize: 22 }}>{qa.icon}</span>
                  <p className="text-[12px] font-semibold text-[#E5E1E7] mb-0.5">{qa.label}</p>
                  <p className="text-[10px] text-[#5A5A68] leading-tight">{qa.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#232329]">
              <h3 className="text-sm font-semibold text-[#E5E1E7]">Recent Activity</h3>
              <span className="text-[11px] font-mono text-[#5A5A68]">{ACTIVITIES.length} events</span>
            </div>
            <div className="divide-y divide-[#1E1E24]">
              {ACTIVITIES.slice(0, visibleActivities).map(act => (
                <div key={act.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#0E0E12] transition-colors">
                  <span className="font-mono text-[11px] text-[#5A5A68] w-[72px] shrink-0">{formatTime(act.timestamp)}</span>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: typeColor(act.type) }} />
                  <span className="text-[13px] text-[#8B8FA3] w-[180px] shrink-0 truncate">{act.action}</span>
                  <span className="text-[13px] text-[#E5E1E7] truncate flex-1">{act.target}</span>
                  <span className="text-[11px] font-mono text-[#5A5A68] shrink-0">{act.actor}</span>
                </div>
              ))}
            </div>
            {visibleActivities < ACTIVITIES.length && (
              <div className="px-5 py-3 border-t border-[#232329]">
                <button
                  onClick={() => setVisibleActivities(prev => Math.min(prev + 8, ACTIVITIES.length))}
                  className="text-[12px] text-[#C0F500] hover:underline font-medium"
                >
                  Load more ({ACTIVITIES.length - visibleActivities} remaining)
                </button>
              </div>
            )}
          </div>

          {/* System Status Footer */}
          <div className="flex items-center justify-between py-3 border-t border-[#232329] text-[10px] font-mono text-[#5A5A68]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C0F500]" />API: healthy</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C0F500]" />DB: 12ms</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C0F500]" />CDN: operational</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />Ada: p95 2.4s</span>
            </div>
            <span>Last deploy: 2026-08-10 03:14 UTC · Build #847</span>
          </div>
        </div>
      </main>
    </div>
  );
};
