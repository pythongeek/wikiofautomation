import React, { useState, useMemo } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
interface ToolEarning {
  toolName: string;
  subscribers: number;
  priceNum: number;
  gross: number;
  fee: number;
  net: number;
}

interface PayoutRequest {
  id: string;
  creatorHandle: string;
  creatorName: string;
  amount: string;
  amountNum: number;
  method: 'Stripe Direct' | 'Bank Wire' | 'Crypto (USDC)';
  methodDetail: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'on_hold' | 'rejected';
  minPayoutMet: boolean;
  idVerified: boolean;
  toolEarnings: ToolEarning[];
}

/* ─── Mock Data ──────────────────────────────────── */
const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: 'pay-1',
    creatorHandle: '@dev_swarm',
    creatorName: 'Alex Rivera',
    amount: '$1,640.00',
    amountNum: 1640,
    method: 'Stripe Direct',
    methodDetail: 'acct_1N9z4242 (Stripe Connect)',
    requestedDate: '2026-08-09T18:30:00Z',
    status: 'pending',
    minPayoutMet: true,
    idVerified: true,
    toolEarnings: [
      { toolName: 'n8n Stripe Drip & Webhook Engine', subscribers: 50, priceNum: 29, gross: 1450, fee: 145, net: 1305 },
      { toolName: 'Inbox Triage Agent (LangGraph)', subscribers: 10, priceNum: 35, gross: 350, fee: 35, net: 315 },
    ],
  },
  {
    id: 'pay-2',
    creatorHandle: '@sarah_ai',
    creatorName: 'Sarah Chen',
    amount: '$2,840.00',
    amountNum: 2840,
    method: 'Stripe Direct',
    methodDetail: 'acct_1M8x9911 (Stripe Connect)',
    requestedDate: '2026-08-09T12:00:00Z',
    status: 'pending',
    minPayoutMet: true,
    idVerified: true,
    toolEarnings: [
      { toolName: 'Claude 3.7 Sonnet Master Prompt Suite', subscribers: 100, priceNum: 19, gross: 1900, fee: 190, net: 1710 },
      { toolName: 'Prompt Engineering Framework', subscribers: 25, priceNum: 49, gross: 1225, fee: 122.5, net: 1102.5 },
    ],
  },
  {
    id: 'pay-3',
    creatorHandle: '@elena_r',
    creatorName: 'Elena Rostova',
    amount: '$1,200.00',
    amountNum: 1200,
    method: 'Bank Wire',
    methodDetail: 'IBAN: DE89 3704 0044 0532 ****',
    requestedDate: '2026-08-08T09:15:00Z',
    status: 'on_hold',
    minPayoutMet: true,
    idVerified: false,
    toolEarnings: [
      { toolName: 'Autonomous Dev OS (Docker)', subscribers: 25, priceNum: 49, gross: 1225, fee: 122.5, net: 1102.5 },
    ],
  },
  {
    id: 'pay-4',
    creatorHandle: '@marcus_dev',
    creatorName: 'Marcus Vance',
    amount: '$980.00',
    amountNum: 980,
    method: 'Crypto (USDC)',
    methodDetail: '0x71C765...3921 (Polygon Network)',
    requestedDate: '2026-08-07T16:00:00Z',
    status: 'approved',
    minPayoutMet: true,
    idVerified: true,
    toolEarnings: [
      { toolName: 'LangGraph Multi-Agent Orchestrator', subscribers: 20, priceNum: 49, gross: 980, fee: 98, net: 882 },
    ],
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

/* ─── Main Component ─────────────────────────────── */
export const CreatorManagement: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>(INITIAL_PAYOUTS);
  const [activeTab, setActiveTab] = useState<'overview' | 'payouts' | 'analytics'>('payouts');
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);

  /* Confirm Modal */
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'approve_one' | 'approve_all_stripe' | 'hold';
    targetId?: string;
  }>({ isOpen: false, title: '', description: '', actionType: 'approve_one' });

  const pendingCount = payouts.filter(p => p.status === 'pending').length;
  const pendingTotal = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amountNum, 0);

  const handleApproveOne = (id: string) => {
    const p = payouts.find(x => x.id === id);
    setConfirmModal({
      isOpen: true,
      title: `Approve Payout ${p?.amount}`,
      description: `Transfer ${p?.amount} to ${p?.creatorHandle} via ${p?.method}?`,
      actionType: 'approve_one',
      targetId: id,
    });
  };

  const handleApproveAllStripe = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Approve All Stripe Payouts',
      description: 'Automatically process all pending Stripe Connect payouts in the queue?',
      actionType: 'approve_all_stripe',
    });
  };

  const handleHold = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Place Payout on Hold',
      description: 'Place this payout request on hold pending ID or tax verification?',
      actionType: 'hold',
      targetId: id,
    });
  };

  const confirmAction = () => {
    const { actionType, targetId } = confirmModal;
    if (actionType === 'approve_one' && targetId) {
      setPayouts(prev => prev.map(p => p.id === targetId ? { ...p, status: 'approved' } : p));
    } else if (actionType === 'approve_all_stripe') {
      setPayouts(prev => prev.map(p => p.method === 'Stripe Direct' && p.status === 'pending' ? { ...p, status: 'approved' } : p));
    } else if (actionType === 'hold' && targetId) {
      setPayouts(prev => prev.map(p => p.id === targetId ? { ...p, status: 'on_hold' } : p));
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
    if (selectedPayout && selectedPayout.id === targetId) setSelectedPayout(null);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="creators" />
      <TopBar breadcrumbs={['Admin', 'People', 'Creator Management & Payouts']} />

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-5 max-w-[1400px]">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#E5E1E7]">Creator Payout Queue & Earnings</h1>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                {pendingCount} pending payouts · ${pendingTotal.toLocaleString()} total pending disbursement
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleApproveAllStripe} className="px-3.5 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>bolt</span>
                Approve All Stripe ({payouts.filter(p => p.method === 'Stripe Direct' && p.status === 'pending').length})
              </button>
              <button className="px-3.5 py-2 rounded-lg bg-[#1E1E24] border border-[#232329] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                Export CSV for Bank
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#232329] pb-3">
            {[
              { id: 'payouts', label: 'Payout Requests Queue', count: pendingCount },
              { id: 'overview', label: 'Creator Performance' },
              { id: 'analytics', label: 'Platform Fees Analytics' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1E1E24] text-[#C0F500] border-l-2 border-[#C0F500]'
                    : 'text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#131317]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#C0F500]/15 text-[#C0F500]">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Payout Queue Table */}
          {activeTab === 'payouts' && (
            <div className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#232329] text-[11px] uppercase tracking-wider text-[#5A5A68]">
                    <th className="py-3 px-4 text-left">Creator</th>
                    <th className="py-3 px-4 text-left">Requested Amount</th>
                    <th className="py-3 px-4 text-left">Payment Method</th>
                    <th className="py-3 px-4 text-left">Requested Date</th>
                    <th className="py-3 px-4 text-left">ID Verification</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E24]">
                  {payouts.map(payout => (
                    <tr key={payout.id} className="hover:bg-[#0E0E12] transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-[13px] font-semibold text-[#E5E1E7] block">{payout.creatorName}</span>
                        <span className="text-[11px] font-mono text-[#C0F500]">{payout.creatorHandle}</span>
                      </td>
                      <td className="py-3 px-4 text-[13px] font-mono font-bold text-[#C0F500]">{payout.amount}</td>
                      <td className="py-3 px-4">
                        <span className="text-[12px] text-[#E5E1E7] block">{payout.method}</span>
                        <span className="text-[10px] font-mono text-[#5A5A68] truncate max-w-[160px] block">{payout.methodDetail}</span>
                      </td>
                      <td className="py-3 px-4 text-[12px] text-[#8B8FA3]">{new Date(payout.requestedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${payout.idVerified ? 'bg-[#C0F500]/10 text-[#C0F500]' : 'bg-[#F5A623]/10 text-[#F5A623]'}`}>
                          {payout.idVerified ? '✓ Verified' : '⚠ ID Required'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          payout.status === 'approved' ? 'bg-[#C0F500]/20 text-[#C0F500]' :
                          payout.status === 'on_hold' ? 'bg-[#F5A623]/20 text-[#F5A623]' : 'bg-[#00DAF3]/20 text-[#00DAF3]'
                        }`}>
                          {payout.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setSelectedPayout(payout)} className="px-2.5 py-1 rounded text-[11px] bg-[#1E1E24] text-[#8B8FA3] hover:text-[#E5E1E7]">
                            Breakdown
                          </button>
                          {payout.status === 'pending' && (
                            <>
                              <button onClick={() => handleHold(payout.id)} className="px-2.5 py-1 rounded text-[11px] bg-[#F5A623]/15 text-[#F5A623] hover:bg-[#F5A623]/25">
                                Hold
                              </button>
                              <button onClick={() => handleApproveOne(payout.id)} className="px-2.5 py-1 rounded text-[11px] bg-[#C0F500] text-[#050508] font-semibold hover:bg-[#D4FF33]">
                                Approve
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payout Breakdown Modal */}
          {selectedPayout && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-6 max-w-xl w-full space-y-4">
                <div className="flex items-center justify-between border-b border-[#232329] pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#E5E1E7]">Payout Breakdown</h3>
                    <p className="text-[11px] font-mono text-[#C0F500]">{selectedPayout.creatorName} ({selectedPayout.creatorHandle})</p>
                  </div>
                  <button onClick={() => setSelectedPayout(null)} className="text-[#5A5A68] hover:text-[#E5E1E7]">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                  </button>
                </div>

                {/* Earnings Table */}
                <div className="bg-[#0E0E12] border border-[#1E1E24] rounded-lg overflow-hidden">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-[#1E1E24] text-[10px] uppercase text-[#5A5A68]">
                        <th className="py-2 px-3 text-left">Tool Name</th>
                        <th className="py-2 px-3 text-right">Gross</th>
                        <th className="py-2 px-3 text-right">WOA 10% Fee</th>
                        <th className="py-2 px-3 text-right">Net Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E24]">
                      {selectedPayout.toolEarnings.map((earn, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 text-[#E5E1E7] font-medium">{earn.toolName}</td>
                          <td className="py-2 px-3 text-right font-mono text-[#8B8FA3]">${earn.gross.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono text-[#FF6B6B]">-${earn.fee.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono text-[#C0F500] font-bold">${earn.net.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 pt-1 font-mono text-[12px]">
                  <div className="flex justify-between"><span className="text-[#8B8FA3]">Payment Method:</span><span className="text-[#E5E1E7]">{selectedPayout.method}</span></div>
                  <div className="flex justify-between"><span className="text-[#8B8FA3]">Minimum Payout ($50):</span><span className="text-[#C0F500]">✓ Met</span></div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#232329]">
                  <button onClick={() => setSelectedPayout(null)} className="px-4 py-2 rounded-lg bg-[#1E1E24] text-[12px] text-[#8B8FA3]">Close</button>
                  {selectedPayout.status === 'pending' && (
                    <button onClick={() => handleApproveOne(selectedPayout.id)} className="px-4 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold">
                      Approve {selectedPayout.amount}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {confirmModal.isOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#131317] border border-[#C0F500]/30 rounded-xl p-6 max-w-md w-full space-y-4">
                <h3 className="text-base font-bold text-[#E5E1E7]">{confirmModal.title}</h3>
                <p className="text-[13px] text-[#8B8FA3] leading-relaxed">{confirmModal.description}</p>
                <div className="flex justify-end gap-2 pt-3 border-t border-[#232329]">
                  <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-4 py-2 rounded-lg bg-[#1E1E24] text-[12px] text-[#8B8FA3]">Cancel</button>
                  <button onClick={confirmAction} className="px-4 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold">Confirm</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
