import React, { useState } from 'react';

export interface UserProfileProps {
  username?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ username = 'ada_lovelace' }) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'reviews' | 'about'>('tools');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Profile Data mapping based on username
  const profilesMap: Record<string, any> = {
    ada_lovelace: {
      name: 'Ada Lovelace',
      handle: 'ada_lovelace',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      title: 'Autonomous Swarm Architect & MCP Contributor',
      location: 'San Francisco, CA',
      joinedDate: 'March 2025',
      bio: 'Building deterministic multi-agent swarms with LangGraph and Model Context Protocol. Open-source maintainer and workflow designer focusing on self-healing Docker execution environments.',
      stats: {
        avgRating: 4.9,
        reviewsCount: 340,
        toolsCount: 12,
        totalUses: '3.1k',
        revenueEst: '$42,500',
      },
      socials: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        website: 'https://wikiofautomation.com',
        discord: 'ada_lovelace#1337',
      },
      skills: ['LangGraph', 'Python MCP', 'Docker OS', 'Claude 3.7', 'n8n Workflows', 'PostgreSQL Checkpointer'],
      publishedTools: [
        {
          id: 'tool-1',
          icon: '🤖',
          type: 'ai-os',
          slug: 'autonomous-dev-os',
          title: 'Autonomous Dev OS (Docker + Open Interpreter)',
          description: 'Self-contained sandbox operating system for running autonomous coding agents safely with human-in-the-loop validation.',
          price: '$49',
          rating: 4.9,
          reviews: 128,
          installs: 1820,
        },
        {
          id: 'tool-2',
          icon: '⚡',
          type: 'agents',
          slug: 'inbox-triage-agent',
          title: 'Inbox Triage Agent (LangGraph + Claude 3.7)',
          description: 'Autonomous email triage agent that categorizes, drafts replies, and syncs key tasks directly to your n8n database.',
          price: 'FREE',
          rating: 4.8,
          reviews: 94,
          installs: 940,
        },
        {
          id: 'tool-3',
          icon: '💳',
          type: 'workflows',
          slug: 'n8n-stripe-drip-workflow',
          title: 'n8n Stripe Drip & Webhook Engine',
          description: 'Production-ready n8n workflow for handling subscription lifecycle events, failed payment retries, and customer notifications.',
          price: '$29',
          rating: 4.95,
          reviews: 76,
          installs: 620,
        },
        {
          id: 'tool-4',
          icon: '🎯',
          type: 'prompts',
          slug: 'claude-prompt-engineer',
          title: 'Claude 3.7 Prompt Engineering Suite',
          description: 'Curated collection of 50+ system prompts optimized for extended thinking mode and automated tool call routing.',
          price: '$19',
          rating: 4.9,
          reviews: 42,
          installs: 410,
        },
      ],
      userReviews: [
        {
          id: 'rev-1',
          author: 'Linus Torvalds',
          handle: 'linustech',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          rating: 5,
          date: '2 days ago',
          toolName: 'Autonomous Dev OS',
          text: 'Exceptionally well-structured Docker container logic. The security permissions for non-root execution saved us weeks of isolation testing.',
        },
        {
          id: 'rev-2',
          author: 'Alex Rivera',
          handle: 'alex_rivera',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          rating: 5,
          date: '1 week ago',
          toolName: 'n8n Stripe Drip Workflow',
          text: 'Deployed in under 10 minutes. Clean JSON payload handling with automated webhooks verification built right into n8n nodes.',
        },
        {
          id: 'rev-3',
          author: 'Elena Rostova',
          handle: 'elena_r',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
          rating: 5,
          date: '2 weeks ago',
          toolName: 'Claude 3.7 Prompt Suite',
          text: 'The thinking mode token budget guidance included in the documentation is pure gold for reducing API costs.',
        },
      ],
    },
    linustech: {
      name: 'Linus Torvalds',
      handle: 'linustech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'Dev OS Container Lead & Linux Kernel Maintainer',
      location: 'Portland, OR',
      joinedDate: 'January 2025',
      bio: 'Specializing in low-overhead Linux containerization for autonomous coding agents and Model Context Protocol servers.',
      stats: {
        avgRating: 4.95,
        reviewsCount: 280,
        toolsCount: 8,
        totalUses: '2.8k',
        revenueEst: '$38,200',
      },
      skills: ['Docker OS', 'Linux Kernel', 'C++', 'Python MCP', 'Bash Automation'],
      publishedTools: [
        {
          id: 'tool-l1',
          icon: '🐳',
          type: 'ai-os',
          slug: 'autonomous-dev-os',
          title: 'Linux Isolated Dev OS Container',
          description: 'Hardened Linux kernel environment tuned for executing LLM-generated code safely.',
          price: '$59',
          rating: 4.95,
          reviews: 140,
          installs: 1420,
        },
      ],
      userReviews: [
        {
          id: 'rev-l1',
          author: 'Ada Lovelace',
          handle: 'ada_lovelace',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
          rating: 5,
          date: '3 days ago',
          toolName: 'Linux Isolated Dev OS Container',
          text: 'Unmatched performance and memory efficiency. The low-overhead kernel isolation makes running 20 parallel agent containers seamless.',
        },
      ],
    },
  };

  const cleanHandle = (username || 'ada_lovelace').replace('@', '').toLowerCase();
  const profile = profilesMap[cleanHandle] || profilesMap['ada_lovelace'];

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText('');
      setIsMessageModalOpen(false);
    }, 1500);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white">
      {/* Profile Header Banner */}
      <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-8 relative shadow-2xl space-y-6 overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0f500]/5 blur-3xl rounded-full pointer-events-none -z-10"></div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Avatar & Title Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#c0f500] shadow-xl"
              />
              <span className="w-4 h-4 rounded-full bg-teal-400 border-2 border-[#131317] absolute bottom-1 right-1"></span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">{profile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase bg-[#c0f500]/10 text-[#c0f500] border border-[#c0f500]/30">
                  ✓ Verified Builder
                </span>
              </div>

              <div className="text-sm font-mono text-[#00e3fd]">@{profile.handle}</div>
              <p className="text-xs sm:text-sm text-[#9ca3af] font-medium max-w-lg">{profile.title}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-mono text-[#9ca3af]">
                <span>📍 {profile.location}</span>
                <span>·</span>
                <span>📅 Joined {profile.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-3 shrink-0">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`h-11 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isFollowing
                  ? 'bg-[#1f1f23] text-white border border-white/20'
                  : 'bg-[#c0f500] text-[#161f00] hover:bg-[#b0e000] shadow-[0_0_15px_rgba(192,245,0,0.3)]'
              }`}
            >
              {isFollowing ? '✓ Following' : '+ Follow Builder'}
            </button>
            <button
              onClick={() => setIsMessageModalOpen(true)}
              className="h-11 px-5 bg-[#1f1f23] hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>💬 Message</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
          <div className="p-4 bg-[#1f1f23] border border-white/5 rounded-xl">
            <div className="text-xl font-bold text-amber-300">★ {profile.stats.avgRating}</div>
            <div className="text-[11px] text-[#9ca3af]">Avg Rating ({profile.stats.reviewsCount})</div>
          </div>
          <div className="p-4 bg-[#1f1f23] border border-white/5 rounded-xl">
            <div className="text-xl font-bold text-white">{profile.stats.toolsCount}</div>
            <div className="text-[11px] text-[#9ca3af]">Published Tools</div>
          </div>
          <div className="p-4 bg-[#1f1f23] border border-white/5 rounded-xl">
            <div className="text-xl font-bold text-[#00e3fd]">{profile.stats.totalUses}</div>
            <div className="text-[11px] text-[#9ca3af]">Total Installs</div>
          </div>
          <div className="p-4 bg-[#1f1f23] border border-white/5 rounded-xl">
            <div className="text-xl font-bold text-[#c0f500]">{profile.stats.revenueEst}</div>
            <div className="text-[11px] text-[#9ca3af]">Est. Revenue</div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 my-8">
        <button
          onClick={() => setActiveTab('tools')}
          className={`pb-4 px-4 font-mono text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'tools'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Tools Published ({profile.publishedTools.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 px-4 font-mono text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          Reviews ({profile.stats.reviewsCount})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-4 px-4 font-mono text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'border-[#c0f500] text-[#c0f500]'
              : 'border-transparent text-[#9ca3af] hover:text-white'
          }`}
        >
          About & Tech Stack
        </button>
      </div>

      {/* TAB CONTENT 1: Published Tools Grid */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {profile.publishedTools.map((tool: any) => (
            <div
              key={tool.id}
              className="bg-[#131317] border border-white/10 hover:border-[#c0f500] rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 group hover:-translate-y-1 shadow-xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#1f1f23] border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-[#c0f500]/10 text-[#c0f500] border border-[#c0f500]/30">
                    {tool.price}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#c0f500] transition-colors leading-snug">
                  {tool.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 font-mono text-xs text-[#9ca3af]">
                  <span className="text-amber-300 font-bold">★ {tool.rating}</span>
                  <span>·</span>
                  <span>{tool.installs} installs</span>
                </div>

                <a
                  href={`/marketplace/${tool.type}/${tool.slug}`}
                  className="px-4 py-2 bg-[#1f1f23] group-hover:bg-[#c0f500] text-white group-hover:text-[#161f00] font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>View Tool</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 2: Reviews List */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 max-w-3xl animate-in fade-in duration-200">
          {profile.userReviews.map((rev: any) => (
            <div key={rev.id} className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={rev.avatar} alt={rev.author} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                  <div>
                    <div className="text-sm font-bold text-white">{rev.author}</div>
                    <div className="text-xs font-mono text-[#9ca3af]">@{rev.handle} · {rev.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-300 font-mono text-sm font-bold">
                  {'★'.repeat(rev.rating)}
                </div>
              </div>

              <div className="text-xs font-mono text-[#00e3fd]">Verified Use for: {rev.toolName}</div>
              <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">{rev.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 3: About & Tech Stack */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-mono uppercase font-bold text-white">Creator Bio</h3>
              <p className="text-sm text-[#9ca3af] leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            </div>

            <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-mono uppercase font-bold text-white">Core Technical Stack & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl font-mono text-xs bg-[#1f1f23] text-[#c0f500] border border-white/10"
                  >
                    ⚡ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-4 font-mono text-xs">
              <h3 className="text-sm uppercase font-bold text-white">Links & Profiles</h3>

              <div className="space-y-3">
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-[#1f1f23] rounded-xl text-white hover:text-[#c0f500] transition-colors"
                >
                  <span>🐙 GitHub</span>
                  <span>→</span>
                </a>
                <a
                  href={profile.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-[#1f1f23] rounded-xl text-white hover:text-[#c0f500] transition-colors"
                >
                  <span>🐦 Twitter / X</span>
                  <span>→</span>
                </a>
                <div className="flex items-center justify-between p-3 bg-[#1f1f23] rounded-xl text-white">
                  <span>💬 Discord</span>
                  <span className="text-[#00e3fd]">{profile.socials.discord}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT MESSAGE MODAL */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#131317] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Direct Message to @{profile.handle}</h3>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="text-[#9ca3af] hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {messageSent ? (
              <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl text-xs font-mono text-[#00e3fd] text-center space-y-2">
                <div className="text-2xl">✉️</div>
                <div className="font-bold">Message Delivered!</div>
                <div>@{profile.handle} has been notified via Discord & Email.</div>
              </div>
            ) : (
              <form onSubmit={handleSendMessageSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-[#9ca3af]">Your Message</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Hi ${profile.name}, I am interested in collaborating on your MCP server workflow...`}
                    rows={4}
                    required
                    className="w-full bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(false)}
                    className="px-4 h-10 bg-[#1f1f23] text-[#9ca3af] hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 h-10 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Send Message →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
