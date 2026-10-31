import React, { useState } from 'react';

export interface CreatorListing {
  id: string;
  name: string;
  type: 'Workflow' | 'Agent' | 'AI-OS' | 'Prompt';
  rating: number;
  uses: number;
  price: string;
  subscribers: number;
  status: 'Published' | 'Draft' | 'Under Review';
}

export const CreatorDashboard: React.FC<{ initialTab?: string }> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const listings: CreatorListing[] = [
    {
      id: 'lst-1',
      name: 'n8n Stripe Drip & Webhook Engine',
      type: 'Workflow',
      rating: 4.95,
      uses: 620,
      price: '$29',
      subscribers: 142,
      status: 'Published',
    },
    {
      id: 'lst-2',
      name: 'Inbox Triage Agent (LangGraph + n8n)',
      type: 'Agent',
      rating: 4.8,
      uses: 940,
      price: 'FREE',
      subscribers: 310,
      status: 'Published',
    },
    {
      id: 'lst-3',
      name: 'Autonomous Dev OS (Docker + Open Interpreter)',
      type: 'AI-OS',
      rating: 4.98,
      uses: 1240,
      price: '$49',
      subscribers: 420,
      status: 'Published',
    },
    {
      id: 'lst-4',
      name: 'Claude 3.7 Sonnet Master Prompt Suite',
      type: 'Prompt',
      rating: 4.75,
      uses: 340,
      price: '$19',
      subscribers: 85,
      status: 'Published',
    },
  ];

  const payoutHistory = [
    { id: 'po-1', date: 'Aug 01, 2026', amount: '$1,640.00', method: 'Stripe Direct (****4242)', status: 'Paid' },
    { id: 'po-2', date: 'Jul 01, 2026', amount: '$1,200.00', method: 'Stripe Direct (****4242)', status: 'Paid' },
    { id: 'po-3', date: 'Jun 01, 2026', amount: '$980.00', method: 'Stripe Direct (****4242)', status: 'Paid' },
  ];

  const sidebarNavItems = [
    { id: 'overview', label: 'Overview', icon: '📊', href: '/dashboard' },
    { id: 'listings', label: 'Listings', icon: '📦', href: '/dashboard?tab=listings' },
    { id: 'revenue', label: 'Revenue', icon: '💰', href: '/dashboard?tab=revenue' },
    { id: 'analytics', label: 'Analytics', icon: '📈', href: '/dashboard?tab=analytics' },
    { id: 'orders', label: 'Orders', icon: '🧾', href: '/dashboard?tab=orders' },
    { id: 'reviews', label: 'Reviews', icon: '⭐', href: '/dashboard?tab=reviews' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'docs', label: 'Docs', icon: '📖', href: '/wiki' },
    { id: 'help', label: 'Help', icon: '❓', href: '/community/forum' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] font-sans text-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#131317] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-bold text-sm">Creator Dashboard</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-[#1f1f23] rounded-lg text-xs font-mono border border-white/10"
        >
          {sidebarOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* Fixed Left Sidebar (240px) */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-60 bg-[#131317] border-r border-white/10 p-5 space-y-6 shrink-0 font-sans z-30`}
      >
        {/* Creator Info */}
        <div className="flex items-center gap-3 pb-5 border-b border-white/10">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
            alt="Ada Lovelace Avatar"
            className="w-10 h-10 rounded-full border border-[#c0f500]"
          />
          <div className="overflow-hidden">
            <div className="font-bold text-sm text-white truncate">Ada Lovelace</div>
            <div className="font-mono text-xs text-[#c0f500]">@ada_lovelace</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {sidebarNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith('/dashboard?tab=')) {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-colors ${
                  isActive
                    ? 'bg-[#c0f500] text-[#161f00] font-bold shadow-md'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#1f1f23]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-6 border-t border-white/10">
          <a
            href="/auth/signin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              Creator Dashboard
            </h1>
            <p className="text-xs font-mono text-[#9ca3af] mt-1">
              Manage published AI workflows, analyze performance metrics, and track payouts.
            </p>
          </div>

          <a
            href="/marketplace"
            className="px-5 py-2.5 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>+ Publish New Listing</span>
          </a>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-[#9ca3af]">
                  <span>Net Revenue (30d)</span>
                  <span className="text-[#c0f500] font-bold">+14.2% ↑</span>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">$2,840</div>
                <div className="text-[10px] text-[#9ca3af]">Next payout Aug 15 ($1,240 ready)</div>
              </div>

              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-[#9ca3af]">
                  <span>Total Installs</span>
                  <span className="text-[#00e3fd] font-bold">+280 this week</span>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">3,140</div>
                <div className="text-[10px] text-[#9ca3af]">Across 12 published items</div>
              </div>

              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-[#9ca3af]">
                  <span>Average Rating</span>
                  <span className="text-amber-300 font-bold">★ 4.88</span>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">4.88</div>
                <div className="text-[10px] text-[#9ca3af]">Based on 340 verified buyer reviews</div>
              </div>

              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-[#9ca3af]">
                  <span>Active Listings</span>
                  <span className="text-[#c0f500] font-bold">100% Healthy</span>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">12</div>
                <div className="text-[10px] text-[#9ca3af]">Workflows, Agents & Docker OS</div>
              </div>
            </div>

            {/* 30-Day Revenue Chart Visualizer */}
            <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <span>📈</span> 30-Day Revenue Growth
                </h3>
                <span className="font-mono text-xs text-[#c0f500] font-bold">$2,840 Total</span>
              </div>

              {/* Bar Visualizer */}
              <div className="h-40 flex items-end justify-between gap-1.5 pt-6 pb-2 px-2 border-b border-white/10">
                {[45, 52, 60, 48, 70, 85, 90, 78, 65, 88, 95, 110, 105, 120, 135, 140, 150, 165, 155, 170, 185, 190, 210, 225, 240, 230, 260, 275, 290, 310].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${(val / 310) * 100}%` }}
                      className="flex-1 bg-gradient-to-t from-[#c0f500]/20 to-[#c0f500] rounded-t hover:bg-white transition-colors cursor-pointer group relative"
                      title={`Day ${idx + 1}: $${val}`}
                    ></div>
                  )
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#9ca3af]">
                <span>30 Days Ago</span>
                <span>15 Days Ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* My Listings Table */}
            <div className="bg-[#131317] border border-white/10 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <span>📦</span> Published Listings
                </h3>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="font-mono text-xs text-[#c0f500] hover:underline"
                >
                  View All (12) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0e0e12] text-[#9ca3af] uppercase font-mono text-xs">
                      <th className="py-3 px-4">Listing Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Installs</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Subscribers</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {listings.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1f1f23] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#c0f500]"></span>
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#9ca3af]">{item.type}</td>
                        <td className="py-3.5 px-4 font-mono text-amber-300">★ {item.rating}</td>
                        <td className="py-3.5 px-4 font-mono text-white">{item.uses}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#c0f500]">{item.price}</td>
                        <td className="py-3.5 px-4 font-mono text-[#00e3fd]">{item.subscribers}</td>
                        <td className="py-3.5 px-4 text-right font-mono space-x-2">
                          <button className="px-2.5 py-1 bg-[#1f1f23] hover:bg-white/10 rounded text-white text-[11px]">
                            Edit
                          </button>
                          <button className="px-2.5 py-1 bg-[#1f1f23] hover:bg-white/10 rounded text-[#00e3fd] text-[11px]">
                            Analytics
                          </button>
                          <a
                            href={`/marketplace`}
                            className="px-2.5 py-1 bg-[#c0f500]/20 text-[#c0f500] hover:bg-[#c0f500]/30 rounded text-[11px]"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-xs font-mono text-[#9ca3af]">Gross Marketplace Sales</div>
                <div className="text-3xl font-extrabold text-white font-mono">$3,400.00</div>
              </div>

              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-xs font-mono text-[#9ca3af]">Platform Fee (15%)</div>
                <div className="text-3xl font-extrabold text-red-400 font-mono">-$560.00</div>
              </div>

              <div className="bg-[#131317] border border-[#c0f500]/30 rounded-2xl p-5 space-y-2 bg-[#c0f500]/5">
                <div className="text-xs font-mono text-[#c0f500]">Net Creator Earnings</div>
                <div className="text-3xl font-extrabold text-[#c0f500] font-mono">$2,840.00</div>
              </div>
            </div>

            {/* Payout History Table */}
            <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <span>💰</span> Payout History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0e0e12] text-[#9ca3af] uppercase font-mono text-xs">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Payout Amount</th>
                      <th className="py-3 px-4">Payout Method</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {payoutHistory.map((po) => (
                      <tr key={po.id} className="hover:bg-[#1f1f23] transition-colors">
                        <td className="py-3.5 px-4 font-mono text-white">{po.date}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#c0f500]">{po.amount}</td>
                        <td className="py-3.5 px-4 font-mono text-[#9ca3af]">{po.method}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          {po.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-xs font-mono text-[#9ca3af]">Total Listing Views</div>
                <div className="text-3xl font-extrabold text-white font-mono">24,800</div>
              </div>
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-xs font-mono text-[#9ca3af]">Unique Visitors</div>
                <div className="text-3xl font-extrabold text-white font-mono">14,200</div>
              </div>
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-xs font-mono text-[#9ca3af]">Successful Downloads</div>
                <div className="text-3xl font-extrabold text-[#c0f500] font-mono">3,140</div>
              </div>
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="text-xs font-mono text-[#9ca3af]">Conversion Rate</div>
                <div className="text-3xl font-extrabold text-[#00e3fd] font-mono">12.6%</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
