import React, { useState } from 'react';

export const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'billing' | 'api-keys' | 'privacy'>('profile');
  
  // Profile Form State
  const [displayName, setDisplayName] = useState('Ada Lovelace');
  const [handle, setHandle] = useState('ada_lovelace');
  const [bio, setBio] = useState('Autonomous Swarm Architect & MCP Contributor. Building high-throughput n8n workflows and AI agent swarms.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('https://wikiofautomation.com');
  const [language, setLanguage] = useState('en');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Notification Toggles State
  const [notifState, setNotifState] = useState({
    newReview: true,
    newFollower: true,
    revenueMilestone: true,
    weeklyDigest: false,
    adaTips: true,
    comments: true,
    forumReplies: true,
    announcements: true,
  });

  // API Key State
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('woa_live_9f83ac1278e94a1b02c892019481ad');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRegenerateKey = () => {
    const newKey = 'woa_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    alert('API Key regenerated successfully! Keep it confidential.');
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white">
      {/* Header */}
      <div className="space-y-2 mb-8 pb-6 border-b border-white/10">
        <h1 className="text-3xl font-extrabold text-white font-sans">Account & Developer Settings</h1>
        <p className="text-xs font-mono text-[#9ca3af]">Manage your public profile, notification preferences, and API integration keys.</p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-1 sm:pb-0">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'account' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'notifications' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'billing' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Billing
        </button>
        <button
          onClick={() => setActiveTab('api-keys')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'api-keys' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          API Keys & Usage
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-4 px-4 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'privacy' ? 'border-[#c0f500] text-[#c0f500]' : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Privacy
        </button>
      </div>

      {/* TAB 1: PROFILE TAB */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="space-y-8 max-w-2xl bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          {saveSuccess && (
            <div className="p-4 bg-[#c0f500]/10 border border-[#c0f500]/30 rounded-xl text-xs font-mono text-[#c0f500]">
              ✓ Profile changes saved successfully!
            </div>
          )}

          {/* Avatar Upload (80px) */}
          <div className="flex items-center gap-6 pb-6 border-b border-white/10">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-[#c0f500] object-cover shadow-lg"
            />
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => alert('Photo upload dialog opened!')}
                className="px-4 py-2 bg-[#1f1f23] hover:bg-white/10 text-white font-mono text-xs font-bold rounded-xl border border-white/10 transition-colors"
              >
                Change photo
              </button>
              <div className="text-[10px] text-[#9ca3af] font-mono">JPG, PNG or GIF. Max 2MB.</div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#9ca3af] uppercase mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full h-11 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-white text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] uppercase mb-1">Handle (@)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#9ca3af]">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required
                  className="w-full h-11 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl pl-9 pr-4 text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#9ca3af] uppercase mb-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl p-4 text-white text-sm focus:outline-none font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#9ca3af] uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] uppercase mb-1">Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full h-11 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#9ca3af] uppercase mb-1">Preferred Interface Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-11 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-white text-sm focus:outline-none"
              >
                <option value="en">English (US)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* TAB 2: NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="space-y-8 max-w-2xl bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-sans uppercase tracking-wider text-xs font-mono text-[#c0f500]">
              📧 Email Notification Preferences
            </h3>

            <div className="space-y-3 divide-y divide-white/5 text-xs font-mono">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-bold text-white">New Review Received</div>
                  <div className="text-[10px] text-[#9ca3af]">Get notified when a buyer leaves a star rating</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifState.newReview}
                  onChange={(e) => setNotifState({ ...notifState, newReview: e.target.checked })}
                  className="w-5 h-5 accent-[#c0f500] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-bold text-white">New Follower Alerts</div>
                  <div className="text-[10px] text-[#9ca3af]">When another builder follows your profile</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifState.newFollower}
                  onChange={(e) => setNotifState({ ...notifState, newFollower: e.target.checked })}
                  className="w-5 h-5 accent-[#c0f500] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-bold text-white">Revenue Milestone Summaries</div>
                  <div className="text-[10px] text-[#9ca3af]">Notifications when sales reach major thresholds</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifState.revenueMilestone}
                  onChange={(e) => setNotifState({ ...notifState, revenueMilestone: e.target.checked })}
                  className="w-5 h-5 accent-[#c0f500] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API KEYS TAB */}
      {activeTab === 'api-keys' && (
        <div className="space-y-8 max-w-2xl bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <span>🔑</span> Production API Key
            </h3>

            {/* Key Display */}
            <div className="p-4 bg-[#0e0e12] border border-white/10 rounded-xl space-y-3 font-mono text-xs">
              <div className="text-[#9ca3af] uppercase text-[10px]">Secret Key</div>
              <div className="flex items-center justify-between gap-3 bg-[#1f1f23] p-3 rounded-lg border border-white/5">
                <code className="text-[#00e3fd] font-bold text-sm tracking-wider">
                  {showKey ? apiKey : 'woa_live_••••••••••••••••••••••••••••'}
                </code>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-[11px]"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={handleRegenerateKey}
                    className="px-3 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded text-[11px]"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </div>

            {/* Usage Meter */}
            <div className="p-4 bg-[#0e0e12] border border-white/10 rounded-xl space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af]">Monthly API Requests</span>
                <span className="text-[#c0f500] font-bold">1,240 / 10,000</span>
              </div>
              <div className="w-full h-3 bg-[#1f1f23] rounded-full overflow-hidden">
                <div style={{ width: '12.4%' }} className="h-full bg-[#c0f500] rounded-full"></div>
              </div>
              <div className="text-[10px] text-[#9ca3af]">Resets on September 1, 2026</div>
            </div>

            <button
              onClick={() => alert('Upgrade to Pro Developer tier requested!')}
              className="w-full py-3 bg-[#00e3fd] hover:bg-[#00daf3] text-[#001f24] font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer font-sans"
            >
              Upgrade for 1M requests/mo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
