import React, { useState, useMemo } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
interface LogEntry {
  id: string;
  timestamp: string;
  adminHandle: string;
  action: string;
  category: 'Content' | 'User' | 'System' | 'Moderation' | 'Financial';
  details: string;
  ipAddress: string;
}

/* ─── Mock Data ──────────────────────────────────── */
const LOG_ENTRIES: LogEntry[] = [
  { id: 'log-101', timestamp: '2026-08-10T17:42:00Z', adminHandle: '@admin', action: 'DEPLOY_STATIC_SITE', category: 'System', details: 'Deployed release zip v4 with 4 new admin pages to Hostinger CDN.', ipAddress: '192.168.1.1' },
  { id: 'log-102', timestamp: '2026-08-10T15:20:00Z', adminHandle: '@admin', action: 'UPDATE_FEATURE_FLAG', category: 'System', details: 'Toggled skillRegistry flag to ENABLED for all users.', ipAddress: '192.168.1.1' },
  { id: 'log-103', timestamp: '2026-08-10T12:05:00Z', adminHandle: '@admin', action: 'APPROVE_PAYOUT', category: 'Financial', details: 'Approved $1,640.00 payout to @dev_swarm via Stripe Direct (pay-1).', ipAddress: '192.168.1.1' },
  { id: 'log-104', timestamp: '2026-08-09T22:15:00Z', adminHandle: '@elena_r', action: 'WARN_CREATOR', category: 'Moderation', details: 'Issued formal copyright warning to @sarah_ai regarding prompt suite (rep-1).', ipAddress: '84.220.12.9' },
  { id: 'log-105', timestamp: '2026-08-09T18:30:00Z', adminHandle: '@admin', action: 'PUBLISH_WIKI_ENTRY', category: 'Content', details: 'Published new wiki entry "Claude 3.7 Sonnet" (/wiki/models/claude-3-7-sonnet).', ipAddress: '192.168.1.1' },
  { id: 'log-106', timestamp: '2026-08-09T14:10:00Z', adminHandle: '@admin', action: 'SUSPEND_USER', category: 'User', details: 'Suspended account @spam_bot_42 for unverified web scraper malware submission.', ipAddress: '192.168.1.1' },
  { id: 'log-107', timestamp: '2026-08-08T09:00:00Z', adminHandle: '@elena_r', action: 'PURGE_CACHE', category: 'System', details: 'Purged Cloudflare edge cache for Wiki detail pages.', ipAddress: '84.220.12.9' },
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

export const AuditLog: React.FC = () => {
  const [adminFilter, setAdminFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return LOG_ENTRIES.filter(l => {
      const matchesAdmin = adminFilter === 'All' || l.adminHandle === adminFilter;
      const matchesAction = actionFilter === 'All' || l.action === actionFilter;
      const matchesSearch = l.details.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
      return matchesAdmin && matchesAction && matchesSearch;
    });
  }, [adminFilter, actionFilter, search]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="logs" />
      <TopBar breadcrumbs={['Admin', 'System', 'Audit Trail Log']} />

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
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-[#E5E1E7]">Immutable Audit Trail</h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#C0F500]/15 text-[#C0F500] border border-[#C0F500]/30 font-bold">
                  2-YEAR RETENTION
                </span>
              </div>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                Append-only log of all admin operations, role promotions, code deployments, & moderation actions
              </p>
            </div>
            <button onClick={() => showToast('Exported audit_log.csv')} className="px-3.5 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33]">
              Export Audit CSV
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-3 font-mono text-[12px]">
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter action details..."
              className="bg-[#131317] border border-[#232329] rounded-lg px-3 py-1.5 text-[#E5E1E7] placeholder:text-[#5A5A68] w-[300px]"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-[#5A5A68]">Admin:</span>
              <select value={adminFilter} onChange={e => setAdminFilter(e.target.value)} className="bg-[#131317] border border-[#232329] rounded-lg px-2.5 py-1.5 text-[#E5E1E7]">
                <option value="All">All Admins</option>
                <option value="@admin">@admin</option>
                <option value="@elena_r">@elena_r</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#232329] text-[10px] uppercase tracking-wider text-[#5A5A68]">
                  <th className="py-3 px-4 text-left">Timestamp (UTC)</th>
                  <th className="py-3 px-4 text-left">Admin</th>
                  <th className="py-3 px-4 text-left">Action</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Details</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E24] font-mono">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#0E0E12] transition-colors">
                    <td className="py-3 px-4 text-[#8B8FA3]">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#C0F500] font-bold">{log.adminHandle}</td>
                    <td className="py-3 px-4 text-[#E5E1E7] font-semibold">{log.action}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#1E1E24] text-[#00DAF3]">{log.category}</span>
                    </td>
                    <td className="py-3 px-4 text-[#8B8FA3] font-sans text-[12px]">{log.details}</td>
                    <td className="py-3 px-4 text-right text-[#5A5A68]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
};
