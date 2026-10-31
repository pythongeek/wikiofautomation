import React, { useState, useMemo } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
interface ListingItem {
  id: string;
  name: string;
  creatorHandle: string;
  type: 'Workflow' | 'Agent' | 'AI-OS' | 'Prompt';
  platform: 'n8n' | 'LangGraph' | 'Docker' | 'Claude' | 'Auto-GPT';
  price: string;
  submittedTime: string;
  status: 'pending' | 'live' | 'rejected' | 'flagged';
  description: string;
  version: string;
  fileSize: string;
  copyrightScore: number; // 0-100% match
  featured: boolean;
  sponsored: boolean;
  adminNotes?: string;
  flagReason?: string;
}

type TabType = 'pending' | 'live' | 'rejected' | 'flagged';

/* ─── Mock Data ──────────────────────────────────── */
const INITIAL_LISTINGS: ListingItem[] = [
  {
    id: 'lst-101',
    name: 'n8n Enterprise Salesforce & Hubspot Sync',
    creatorHandle: '@dev_swarm',
    type: 'Workflow',
    platform: 'n8n',
    price: '$39',
    submittedTime: '2026-08-10T15:20:00Z',
    status: 'pending',
    description: 'Bi-directional real-time customer data synchronization workflow with error fallback hooks.',
    version: '1.2.0',
    fileSize: '420 KB (.json)',
    copyrightScore: 2,
    featured: false,
    sponsored: false,
    adminNotes: 'Clean node structure. Verified webhook endpoints.',
  },
  {
    id: 'lst-102',
    name: 'LangGraph Autonomous Customer Support Agent',
    creatorHandle: '@alex_rivera',
    type: 'Agent',
    platform: 'LangGraph',
    price: '$79',
    submittedTime: '2026-08-10T11:45:00Z',
    status: 'pending',
    description: 'Multi-agent customer support state machine with human-in-the-loop review queue.',
    version: '2.0.1',
    fileSize: '2.4 MB (.zip)',
    copyrightScore: 4,
    featured: false,
    sponsored: false,
    adminNotes: 'Requires Docker container test.',
  },
  {
    id: 'lst-103',
    name: 'Auto-Scraper & Vector DB Indexer (MCP Server)',
    creatorHandle: '@mcp_master',
    type: 'Agent',
    platform: 'Claude',
    price: 'FREE',
    submittedTime: '2026-08-09T22:10:00Z',
    status: 'pending',
    description: 'Fast Python MCP server connecting web scraping directly to Qdrant vector database.',
    version: '1.0.0',
    fileSize: '1.1 MB (.py)',
    copyrightScore: 18,
    featured: false,
    sponsored: false,
  },
  {
    id: 'lst-104',
    name: 'n8n Stripe Drip & Webhook Engine',
    creatorHandle: '@builder',
    type: 'Workflow',
    platform: 'n8n',
    price: '$29',
    submittedTime: '2026-08-05T10:00:00Z',
    status: 'live',
    description: 'Production-ready subscription drip sequence and checkout webhook router.',
    version: '2.1.0',
    fileSize: '310 KB (.json)',
    copyrightScore: 0,
    featured: true,
    sponsored: true,
  },
  {
    id: 'lst-105',
    name: 'Autonomous Dev OS (Docker + Open Interpreter)',
    creatorHandle: '@elena_r',
    type: 'AI-OS',
    platform: 'Docker',
    price: '$49',
    submittedTime: '2026-08-03T18:30:00Z',
    status: 'live',
    description: 'Containerized developer environment for executing multi-step coding prompts.',
    version: '3.0.0',
    fileSize: '14.2 MB (.zip)',
    copyrightScore: 1,
    featured: true,
    sponsored: false,
  },
  {
    id: 'lst-106',
    name: 'Unverified Web Scraper Bot v4',
    creatorHandle: '@spam_bot_42',
    type: 'Agent',
    platform: 'Auto-GPT',
    price: '$99',
    submittedTime: '2026-08-09T04:12:00Z',
    status: 'rejected',
    description: 'Scrapes data without rate limit headers.',
    version: '0.1.0',
    fileSize: '800 KB (.zip)',
    copyrightScore: 84,
    featured: false,
    sponsored: false,
    adminNotes: 'High copyright match (84%). Missing proxy error handlers.',
  },
  {
    id: 'lst-107',
    name: 'Claude 3.7 Sonnet Master Prompt Suite',
    creatorHandle: '@sarah_ai',
    type: 'Prompt',
    platform: 'Claude',
    price: '$19',
    submittedTime: '2026-08-08T14:15:00Z',
    status: 'flagged',
    description: 'Prompt templates for system architecture design and automated refactoring.',
    version: '1.0.0',
    fileSize: '45 KB (.md)',
    copyrightScore: 5,
    featured: false,
    sponsored: false,
    flagReason: 'User reported duplicate prompts from public repo.',
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
export const MarketplaceModeration: React.FC = () => {
  const [listings, setListings] = useState<ListingItem[]>(INITIAL_LISTINGS);
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [editingListing, setEditingListing] = useState<ListingItem | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'approve' | 'reject' | 'unpublish' | 'delete';
    targetId: string;
  }>({ isOpen: false, title: '', description: '', actionType: 'approve', targetId: '' });

  const [adminNotes, setAdminNotes] = useState<{ [id: string]: string }>({
    'lst-101': 'Clean node structure. Verified webhook endpoints.',
    'lst-102': 'Requires Docker container test.',
  });

  const counts = useMemo(() => {
    return {
      pending: listings.filter(l => l.status === 'pending').length,
      live: listings.filter(l => l.status === 'live').length,
      rejected: listings.filter(l => l.status === 'rejected').length,
      flagged: listings.filter(l => l.status === 'flagged').length,
    };
  }, [listings]);

  const currentItems = useMemo(() => {
    return listings.filter(l => l.status === activeTab);
  }, [listings, activeTab]);

  const handleAction = (id: string, action: 'approve' | 'reject' | 'request_changes') => {
    if (action === 'approve') {
      setConfirmModal({
        isOpen: true,
        title: 'Approve Listing',
        description: 'Are you sure you want to approve this listing and publish it to the live Marketplace?',
        actionType: 'approve',
        targetId: id,
      });
    } else if (action === 'reject') {
      setConfirmModal({
        isOpen: true,
        title: 'Reject Listing',
        description: 'Rejecting this submission will send feedback to the creator. This action cannot be undone automatically.',
        actionType: 'reject',
        targetId: id,
      });
    } else {
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected', adminNotes: (adminNotes[id] || '') + ' [Changes Requested]' } : l));
    }
  };

  const confirmAction = () => {
    const { actionType, targetId } = confirmModal;
    setListings(prev => prev.map(l => {
      if (l.id === targetId) {
        if (actionType === 'approve') return { ...l, status: 'live' };
        if (actionType === 'reject' || actionType === 'unpublish') return { ...l, status: 'rejected' };
      }
      return l;
    }));
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const toggleFeature = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, featured: !l.featured } : l));
  };
  const toggleSponsor = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, sponsored: !l.sponsored } : l));
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="marketplace" />
      <TopBar breadcrumbs={['Admin', 'Content', 'Marketplace Moderation']} />

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-5 max-w-[1400px]">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#E5E1E7]">Marketplace Moderation Queue</h1>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                Review submitted workflows, agents, and prompts · Verify security & copyright
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-[#C0F500]/10 text-[#C0F500] border border-[#C0F500]/20 text-[12px] font-mono">
                {counts.pending} pending review
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#232329] pb-3">
            {[
              { id: 'pending', label: 'Pending Review', count: counts.pending, color: 'text-[#F5A623]' },
              { id: 'live', label: 'Live Marketplace', count: counts.live, color: 'text-[#C0F500]' },
              { id: 'flagged', label: 'Flagged / Reported', count: counts.flagged, color: 'text-[#FF6B6B]' },
              { id: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-[#5A5A68]' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1E1E24] text-[#E5E1E7] border-l-2 border-[#C0F500]'
                    : 'text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#131317]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#0E0E12] border border-[#232329] ${tab.color}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Cards Grid for Pending Review */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {currentItems.length === 0 ? (
                <div className="bg-[#131317] border border-[#232329] rounded-xl p-8 text-center text-[#5A5A68]">
                  <span className="material-symbols-outlined mb-2" style={{ fontSize: 32 }}>fact_check</span>
                  <p className="text-[14px]">No pending submissions in the queue!</p>
                </div>
              ) : (
                currentItems.map(item => (
                  <div key={item.id} className="bg-[#131317] border border-[#232329] rounded-xl p-5 hover:border-[#353439] transition-all space-y-4">
                    {/* Item Top Info */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-semibold text-[#E5E1E7]">{item.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#C0F500]/15 text-[#C0F500]">
                            {item.type}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#00DAF3]/15 text-[#00DAF3]">
                            {item.platform}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#8B8FA3]">{item.description}</p>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-[#5A5A68] pt-1">
                          <span>By <strong className="text-[#E5E1E7]">{item.creatorHandle}</strong></span>
                          <span>Price: <strong className="text-[#C0F500]">{item.price}</strong></span>
                          <span>Version: {item.version}</span>
                          <span>Size: {item.fileSize}</span>
                          <span>Submitted: {new Date(item.submittedTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Copyright Badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1 ${
                          item.copyrightScore > 50 ? 'bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30' : 'bg-[#C0F500]/10 text-[#C0F500]'
                        }`}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>copyright</span>
                          {item.copyrightScore}% Match
                        </span>
                        <span className="text-[10px] text-[#5A5A68]">Copyright Scan</span>
                      </div>
                    </div>

                    {/* Admin Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#1E1E24]">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-[#1E1E24] border border-[#232329] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                          Preview Listing
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-[#1E1E24] border border-[#232329] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
                          Download Files
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-[#1E1E24] border border-[#232329] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                          Check Copyright
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(item.id, 'request_changes')}
                          className="px-3 py-1.5 rounded-lg bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30 text-[12px] font-medium hover:bg-[#F5A623]/25 transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>flag</span>
                          Request Changes
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'reject')}
                          className="px-3 py-1.5 rounded-lg bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30 text-[12px] font-medium hover:bg-[#FF6B6B]/25 transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'approve')}
                          className="px-3 py-1.5 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                          Approve & Publish
                        </button>
                      </div>
                    </div>

                    {/* Admin Notes Box */}
                    <div className="pt-2">
                      <textarea
                        value={adminNotes[item.id] || ''}
                        onChange={e => setAdminNotes({ ...adminNotes, [item.id]: e.target.value })}
                        placeholder="Add private admin review notes here..."
                        rows={2}
                        className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 resize-none placeholder:text-[#5A5A68]"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Table View for Live / Flagged / Rejected */}
          {activeTab !== 'pending' && (
            <div className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#232329] text-[11px] uppercase tracking-wider text-[#5A5A68]">
                    <th className="py-3 px-4 text-left">Listing Name</th>
                    <th className="py-3 px-4 text-left">Creator</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Badges</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E24]">
                  {currentItems.map(item => (
                    <tr key={item.id} className="hover:bg-[#0E0E12] transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-[13px] font-medium text-[#E5E1E7] block">{item.name}</span>
                        <span className="text-[10px] font-mono text-[#5A5A68]">{item.description}</span>
                      </td>
                      <td className="py-3 px-4 text-[12px] font-mono text-[#8B8FA3]">{item.creatorHandle}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E1E24] text-[#8B8FA3]">
                          {item.type} ({item.platform})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[12px] font-mono text-[#C0F500] font-bold">{item.price}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleFeature(item.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${item.featured ? 'bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/40' : 'bg-[#1E1E24] text-[#5A5A68]'}`}
                          >
                            {item.featured ? '★ Featured' : '+ Feature'}
                          </button>
                          <button
                            onClick={() => toggleSponsor(item.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${item.sponsored ? 'bg-[#00DAF3]/20 text-[#00DAF3] border border-[#00DAF3]/40' : 'bg-[#1E1E24] text-[#5A5A68]'}`}
                          >
                            {item.sponsored ? '⚡ Sponsored' : '+ Sponsor'}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingListing(item)}
                            className="px-2.5 py-1 rounded text-[11px] bg-[#1E1E24] text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAction(item.id, 'reject')}
                            className="px-2.5 py-1 rounded text-[11px] bg-[#FF6B6B]/15 text-[#FF6B6B] hover:bg-[#FF6B6B]/25 transition-colors"
                          >
                            Unpublish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Admin Override Editor Modal */}
          {editingListing && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-6 max-w-xl w-full space-y-4">
                <div className="flex items-center justify-between border-b border-[#232329] pb-3">
                  <h3 className="text-base font-semibold text-[#E5E1E7]">Admin Override Editor</h3>
                  <button onClick={() => setEditingListing(null)} className="text-[#5A5A68] hover:text-[#E5E1E7]">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Listing Name</label>
                    <input
                      type="text" defaultValue={editingListing.name}
                      className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Price</label>
                      <input
                        type="text" defaultValue={editingListing.price}
                        className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Type</label>
                      <select defaultValue={editingListing.type} className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7]">
                        <option>Workflow</option><option>Agent</option><option>AI-OS</option><option>Prompt</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-[#232329]">
                  <button onClick={() => setEditingListing(null)} className="px-4 py-2 rounded-lg bg-[#1E1E24] text-[12px] text-[#8B8FA3]">Cancel</button>
                  <button onClick={() => setEditingListing(null)} className="px-4 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold">Save Override</button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {confirmModal.isOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#131317] border border-[#FF6B6B]/30 rounded-xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center gap-3 text-[#FF6B6B]">
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>warning</span>
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
