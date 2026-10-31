import React, { useState } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
interface ReportItem {
  id: string;
  type: 'Copyright' | 'Malware / Spam' | 'Misleading Description' | 'Abusive Content';
  reporter: string;
  targetItem: string;
  creatorHandle: string;
  reason: string;
  reportedDate: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

/* ─── Mock Data ──────────────────────────────────── */
const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    type: 'Copyright',
    reporter: '@user_99',
    targetItem: 'Claude 3.7 Sonnet Master Prompt Suite',
    creatorHandle: '@sarah_ai',
    reason: 'Prompts match verbatim repository published on GitHub under MIT license without attribution.',
    reportedDate: '2026-08-10T11:00:00Z',
    status: 'pending',
  },
  {
    id: 'rep-2',
    type: 'Malware / Spam',
    reporter: '@security_bot',
    targetItem: 'Unverified Web Scraper Bot v4',
    creatorHandle: '@spam_bot_42',
    reason: 'Script includes unencrypted outbound POST to non-whitelisted IP endpoint.',
    reportedDate: '2026-08-09T20:15:00Z',
    status: 'pending',
  },
  {
    id: 'rep-3',
    type: 'Misleading Description',
    reporter: '@alex_m',
    targetItem: 'n8n Stripe Drip & Webhook Engine',
    creatorHandle: '@builder',
    reason: 'Description claims support for PayPal, but node structure only includes Stripe webhooks.',
    reportedDate: '2026-08-08T15:30:00Z',
    status: 'pending',
  },
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

export const ModerationPanel: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState<'reports' | 'flagged' | 'queue'>('reports');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  /* Modal State */
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'warn' | 'remove' | 'suspend' | 'dismiss';
    targetId: string;
  }>({ isOpen: false, title: '', description: '', actionType: 'warn', targetId: '' });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAction = (id: string, actionType: 'warn' | 'remove' | 'suspend' | 'dismiss') => {
    const rep = reports.find(r => r.id === id);
    let title = '';
    let description = '';

    if (actionType === 'warn') {
      title = `Warn Creator ${rep?.creatorHandle}`;
      description = `Send official platform warning email to ${rep?.creatorHandle}?`;
    } else if (actionType === 'remove') {
      title = `Remove Listing "${rep?.targetItem}"`;
      description = `Unpublish and remove this listing from the marketplace immediately?`;
    } else if (actionType === 'suspend') {
      title = `Suspend Account ${rep?.creatorHandle}`;
      description = `Immediately suspend ${rep?.creatorHandle} and revoke platform publishing rights?`;
    } else {
      title = `Dismiss Report ${id}`;
      description = `Dismiss this report as resolved / invalid?`;
    }

    setConfirmModal({ isOpen: true, title, description, actionType, targetId: id });
  };

  const confirmAction = () => {
    const { actionType, targetId } = confirmModal;
    setReports(prev => prev.map(r => r.id === targetId ? { ...r, status: actionType === 'dismiss' ? 'dismissed' : 'resolved' } : r));
    setConfirmModal({ ...confirmModal, isOpen: false });
    showToast(`Action executed: ${actionType.toUpperCase()} for report ${targetId}`);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="moderation" />
      <TopBar breadcrumbs={['Admin', 'Platform', 'Moderation & Reports']} />

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
              <h1 className="text-xl font-semibold text-[#E5E1E7]">Content Moderation & Report Desk</h1>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                {reports.filter(r => r.status === 'pending').length} pending reports requiring review · All actions logged to Audit Trail
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#232329] pb-3">
            {[
              { id: 'reports', label: 'User Reports', count: reports.filter(r => r.status === 'pending').length },
              { id: 'flagged', label: 'Automated Flagged Content' },
              { id: 'queue', label: 'Resolved History' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1E1E24] text-[#FF6B6B] border-l-2 border-[#FF6B6B]'
                    : 'text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#131317]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FF6B6B]/20 text-[#FF6B6B]">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Reports List */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports.filter(r => r.status === 'pending').map(rep => (
                <div key={rep.id} className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30">
                          {rep.type}
                        </span>
                        <h3 className="text-[15px] font-semibold text-[#E5E1E7]">{rep.targetItem}</h3>
                      </div>
                      <p className="text-[12px] text-[#8B8FA3] mt-1">Reason: "{rep.reason}"</p>
                      <div className="flex items-center gap-4 text-[11px] font-mono text-[#5A5A68] mt-2">
                        <span>Reported by: <strong className="text-[#00DAF3]">{rep.reporter}</strong></span>
                        <span>Creator: <strong className="text-[#C0F500]">{rep.creatorHandle}</strong></span>
                        <span>Date: {new Date(rep.reportedDate).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E1E24]">
                    <button onClick={() => showToast(`Previewing ${rep.targetItem}`)} className="px-3 py-1.5 rounded bg-[#1E1E24] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7]">
                      View Listing
                    </button>
                    <button onClick={() => handleAction(rep.id, 'warn')} className="px-3 py-1.5 rounded bg-[#F5A623]/15 text-[#F5A623] text-[12px] font-medium hover:bg-[#F5A623]/25">
                      Warn Creator
                    </button>
                    <button onClick={() => handleAction(rep.id, 'remove')} className="px-3 py-1.5 rounded bg-[#FF6B6B]/15 text-[#FF6B6B] text-[12px] font-medium hover:bg-[#FF6B6B]/25">
                      Remove Listing
                    </button>
                    <button onClick={() => handleAction(rep.id, 'suspend')} className="px-3 py-1.5 rounded bg-[#FF6B6B] text-white text-[12px] font-semibold">
                      Suspend Account
                    </button>
                    <button onClick={() => handleAction(rep.id, 'dismiss')} className="px-3 py-1.5 rounded bg-[#1E1E24] text-[12px] text-[#5A5A68] hover:text-[#8B8FA3]">
                      Dismiss Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Confirm Modal */}
          {confirmModal.isOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#131317] border border-[#FF6B6B]/30 rounded-xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center gap-3 text-[#FF6B6B]">
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>shield</span>
                  <h3 className="text-base font-bold">{confirmModal.title}</h3>
                </div>
                <p className="text-[13px] text-[#8B8FA3] leading-relaxed">{confirmModal.description}</p>
                <div className="flex justify-end gap-2 pt-3 border-t border-[#232329]">
                  <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-4 py-2 rounded-lg bg-[#1E1E24] text-[12px] text-[#8B8FA3]">Cancel</button>
                  <button onClick={confirmAction} className="px-4 py-2 rounded-lg bg-[#FF6B6B] text-white text-[12px] font-semibold">Confirm Action</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
