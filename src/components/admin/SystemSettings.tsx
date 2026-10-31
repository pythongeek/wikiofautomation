import React, { useState } from 'react';
import { AdminSidebar } from './AdminOverview';

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

export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'cache' | 'flags' | 'danger'>('general');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  /* General Settings */
  const [siteName, setSiteName] = useState('Wiki of Automation');
  const [tagline, setTagline] = useState('The encyclopedia of automation — understand it, find it, ship it.');
  const [maintMode, setMaintMode] = useState(false);
  const [maintMsg, setMaintMsg] = useState('WikiOfAutomation is under scheduled maintenance. Back online shortly!');
  const [tickerEnabled, setTickerEnabled] = useState(true);

  /* Feature Flags State */
  const [flags, setFlags] = useState({
    adaWidget: true,
    marketplace: true,
    academy: true,
    communityForum: true,
    compareEngine: true,
    seoTools: true,
    cryptoPayments: true,
    publicApi: true,
    affiliateProgram: false,
    skillRegistry: true,
  });

  /* Modal State for Danger Zone */
  const [dangerModal, setDangerModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'reset_flags' | 'wipe_test' | 'export_gdpr' | 'delete_guest_sessions';
  }>({ isOpen: false, title: '', description: '', actionType: 'wipe_test' });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDangerAction = (type: 'reset_flags' | 'wipe_test' | 'export_gdpr' | 'delete_guest_sessions') => {
    let title = '';
    let description = '';

    if (type === 'reset_flags') {
      title = 'Reset All Feature Flags';
      description = 'Reset all platform feature toggles to factory default configuration?';
    } else if (type === 'wipe_test') {
      title = 'Wipe Test & Staging Data';
      description = 'Permanently purge all sandbox test transactions and demo accounts?';
    } else if (type === 'export_gdpr') {
      title = 'Export All User Data (GDPR Dump)';
      description = 'Generate an encrypted full system archive of user metadata for GDPR compliance?';
    } else {
      title = 'Delete Expired Guest Sessions';
      description = 'Immediately purge all expired unauthenticated browser session tokens from memory?';
    }

    setDangerModal({ isOpen: true, title, description, actionType: type });
  };

  const confirmDangerAction = () => {
    showToast(`Executed: ${dangerModal.title}`);
    setDangerModal({ ...dangerModal, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="system" />
      <TopBar breadcrumbs={['Admin', 'System', 'System Settings']} />

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
              <h1 className="text-xl font-semibold text-[#E5E1E7]">System Configuration & Feature Flags</h1>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                Maintenance mode, cache purging, feature flag toggles, and system danger zone
              </p>
            </div>
            <button onClick={() => showToast('System Settings saved!')} className="px-3.5 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33]">
              Save Configuration
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#232329] pb-3">
            {[
              { id: 'general', label: 'General & Maintenance', icon: 'settings' },
              { id: 'cache', label: 'Cache & Redis Control', icon: 'cached' },
              { id: 'flags', label: 'Feature Flags', icon: 'flag' },
              { id: 'danger', label: 'Danger Zone', icon: 'warning' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? tab.id === 'danger' ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-l-2 border-[#FF6B6B]' : 'bg-[#1E1E24] text-[#C0F500] border-l-2 border-[#C0F500]'
                    : 'text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#131317]'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: General Settings */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Site Information</h3>
                <div>
                  <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Site Title</label>
                  <input
                    type="text" value={siteName} onChange={e => setSiteName(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Tagline</label>
                  <input
                    type="text" value={tagline} onChange={e => setTagline(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7]"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[13px] text-[#E5E1E7]">Live News Ticker Bar</span>
                  <button onClick={() => setTickerEnabled(!tickerEnabled)} className={`w-9 h-5 rounded-full relative ${tickerEnabled ? 'bg-[#C0F500]' : 'bg-[#232329]'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${tickerEnabled ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="pt-3 border-t border-[#1E1E24] space-y-2">
                  <span className="text-[11px] uppercase text-[#5A5A68] font-medium block">Enabled Site Languages</span>
                  <div className="flex gap-4 text-[12px] font-mono">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#C0F500]" /> English (en)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#C0F500]" /> Spanish (es)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" className="accent-[#C0F500]" /> German (de)
                    </label>
                  </div>
                </div>
              </div>

              {/* Maintenance Mode */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#E5E1E7]">Maintenance Mode</h3>
                    <p className="text-[11px] text-[#5A5A68]">Locks frontend access for non-admin users</p>
                  </div>
                  <button onClick={() => setMaintMode(!maintMode)} className={`w-9 h-5 rounded-full relative ${maintMode ? 'bg-[#FF6B6B]' : 'bg-[#232329]'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${maintMode ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>
                {maintMode && (
                  <div>
                    <label className="text-[11px] uppercase text-[#FF6B6B] font-medium block mb-1">Maintenance Banner Message</label>
                    <textarea
                      value={maintMsg} onChange={e => setMaintMsg(e.target.value)} rows={3}
                      className="w-full bg-[#0E0E12] border border-[#FF6B6B]/40 rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Cache Control */}
          {activeTab === 'cache' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Cloudflare Edge Cache</h3>
                <p className="text-[11px] text-[#5A5A68]">Purge cached static HTML pages across edge data centers</p>
                <div className="space-y-2">
                  {['Homepage', 'Wiki Detail Pages', 'Marketplace Listings', 'Everything (Full Edge Cache)'].map(target => (
                    <button
                      key={target}
                      onClick={() => showToast(`Purged Cloudflare Cache for ${target}`)}
                      className="w-full py-2 px-3 rounded bg-[#1E1E24] border border-[#232329] text-[12px] text-[#E5E1E7] hover:border-[#C0F500]/40 flex items-center justify-between"
                    >
                      <span>Purge {target}</span>
                      <span className="material-symbols-outlined text-[#5A5A68]" style={{ fontSize: 16 }}>cleaning_services</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Redis Key-Value Storage</h3>
                <p className="text-[11px] text-[#5A5A68]">Flush in-memory session keys, rate limits, and vector query cache</p>
                <button onClick={() => showToast('Redis cache successfully flushed!')} className="w-full py-2.5 rounded bg-[#FF6B6B]/20 text-[#FF6B6B] font-semibold text-[12px] border border-[#FF6B6B]/30">
                  Flush Redis Memory Cache
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Feature Flags */}
          {activeTab === 'flags' && (
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#E5E1E7]">Platform Feature Flags (Global Toggle)</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(flags).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded bg-[#0E0E12] border border-[#1E1E24]">
                    <span className="text-[13px] text-[#E5E1E7] font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <button
                      onClick={() => setFlags({ ...flags, [key]: !val })}
                      className={`w-9 h-5 rounded-full relative transition-colors ${val ? 'bg-[#C0F500]' : 'bg-[#232329]'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${val ? 'left-[18px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Danger Zone */}
          {activeTab === 'danger' && (
            <div className="bg-[#131317] border border-[#FF6B6B]/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#FF6B6B]">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>warning</span>
                <h3 className="text-sm font-semibold uppercase tracking-wider">System Danger Zone</h3>
              </div>
              <p className="text-[12px] text-[#8B8FA3]">Irreversible administrative utility operations. Use with caution.</p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { id: 'reset_flags', label: 'Reset Feature Flags', desc: 'Restore factory default toggle states' },
                  { id: 'wipe_test', label: 'Wipe Staging Test Data', desc: 'Purge test listings & mock users' },
                  { id: 'export_gdpr', label: 'Export All User Data (GDPR)', desc: 'Generate encrypted full archive' },
                  { id: 'delete_guest_sessions', label: 'Delete Expired Sessions', desc: 'Flush stale guest session tokens' },
                ].map(action => (
                  <div key={action.id} className="p-4 rounded-lg bg-[#0E0E12] border border-[#FF6B6B]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[13px] font-semibold text-[#E5E1E7] block">{action.label}</span>
                      <span className="text-[10px] text-[#5A5A68]">{action.desc}</span>
                    </div>
                    <button onClick={() => handleDangerAction(action.id as any)} className="px-3 py-1.5 rounded bg-[#FF6B6B]/20 text-[#FF6B6B] text-[11px] font-semibold hover:bg-[#FF6B6B]/30">
                      Execute
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Modal */}
          {dangerModal.isOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#131317] border border-[#FF6B6B]/40 rounded-xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center gap-3 text-[#FF6B6B]">
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>warning</span>
                  <h3 className="text-base font-bold">{dangerModal.title}</h3>
                </div>
                <p className="text-[13px] text-[#8B8FA3] leading-relaxed">{dangerModal.description}</p>
                <div className="flex justify-end gap-2 pt-3 border-t border-[#232329]">
                  <button onClick={() => setDangerModal({ ...dangerModal, isOpen: false })} className="px-4 py-2 rounded-lg bg-[#1E1E24] text-[12px] text-[#8B8FA3]">Cancel</button>
                  <button onClick={confirmDangerAction} className="px-4 py-2 rounded-lg bg-[#FF6B6B] text-white text-[12px] font-semibold">Confirm Execution</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
