import React, { useState } from 'react';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  username: string;
  avatar: string;
  title: string;
  specialty: string;
  toolsCount: number;
  installsCount: number;
  ratingAvg: number;
  reviewsCount: number;
  revenueEst: number;
}

export const Leaderboard: React.FC = () => {
  const [timeframeFilter, setTimeframeFilter] = useState<'month' | 'alltime'>('month');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Ada Lovelace',
      username: 'ada_lovelace',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      title: 'Autonomous Swarm Architect',
      specialty: 'LangGraph & Python MCP',
      toolsCount: 12,
      installsCount: 3120,
      ratingAvg: 4.9,
      reviewsCount: 340,
      revenueEst: 42500,
    },
    {
      rank: 2,
      name: 'Linus Torvalds',
      username: 'linustech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      title: 'Dev OS Container Lead',
      specialty: 'Docker & Open Interpreter',
      toolsCount: 8,
      installsCount: 2890,
      ratingAvg: 4.95,
      reviewsCount: 280,
      revenueEst: 38200,
    },
    {
      rank: 3,
      name: 'Alex Rivera',
      username: 'alex_rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      title: 'Enterprise Workflow Specialist',
      specialty: 'n8n & Stripe Systems',
      toolsCount: 15,
      installsCount: 2450,
      ratingAvg: 4.85,
      reviewsCount: 195,
      revenueEst: 29400,
    },
    {
      rank: 4,
      name: 'Elena Rostova',
      username: 'elena_r',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      title: 'Prompt Systems Engineer',
      specialty: 'Claude 3.7 & Anthropic SDK',
      toolsCount: 9,
      installsCount: 1980,
      ratingAvg: 4.9,
      reviewsCount: 160,
      revenueEst: 24100,
    },
    {
      rank: 5,
      name: 'Marcus Chen',
      username: 'marcus_dev',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      title: 'Fullstack Automation Engineer',
      specialty: 'Node.js & Webhook Mesh',
      toolsCount: 6,
      installsCount: 1620,
      ratingAvg: 4.8,
      reviewsCount: 110,
      revenueEst: 19800,
    },
    {
      rank: 6,
      name: 'Sarah Jenkins',
      username: 'sarah_ai',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
      title: 'Multi-Model Router Dev',
      specialty: 'LLM Orchestration & Failover',
      toolsCount: 11,
      installsCount: 1410,
      ratingAvg: 4.88,
      reviewsCount: 94,
      revenueEst: 16500,
    },
    {
      rank: 7,
      name: 'DevSwarm Labs',
      username: 'dev_swarm',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      title: 'Agentic Research Collective',
      specialty: 'AutoGen & Swarm Intelligence',
      toolsCount: 7,
      installsCount: 1250,
      ratingAvg: 4.75,
      reviewsCount: 82,
      revenueEst: 14200,
    },
    {
      rank: 8,
      name: 'MCP Architect',
      username: 'mcp_master',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
      title: 'Protocol Standard Core Dev',
      specialty: 'Model Context Protocol Servers',
      toolsCount: 5,
      installsCount: 1080,
      ratingAvg: 4.92,
      reviewsCount: 75,
      revenueEst: 12800,
    },
  ];

  let filtered = leaderboardData;
  if (categoryFilter !== 'all') {
    filtered = filtered.filter((item) =>
      item.specialty.toLowerCase().includes(categoryFilter.toLowerCase())
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase bg-[#c0f500]/10 text-[#c0f500] border border-[#c0f500]/30">
            🏆 Top Creator Ecosystem Rankings
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Builder <span className="text-[#c0f500]">Leaderboard</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9ca3af] max-w-xl">
            Top creators this month by installs, revenue, and community rating across verified workflows, agents, and MCP servers.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center bg-[#131317] border border-white/10 p-1 rounded-xl font-mono text-xs">
            <button
              onClick={() => setTimeframeFilter('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeframeFilter === 'month' ? 'bg-[#c0f500] text-[#161f00] font-bold' : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              This month ▾
            </button>
            <button
              onClick={() => setTimeframeFilter('alltime')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeframeFilter === 'alltime' ? 'bg-[#c0f500] text-[#161f00] font-bold' : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              All time ▾
            </button>
          </div>

          {/* Specialty filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 bg-[#131317] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-xs font-mono text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Specialties ▾</option>
            <option value="langgraph">LangGraph & Swarms</option>
            <option value="docker">Docker & Containers</option>
            <option value="n8n">n8n Workflows</option>
            <option value="claude">Claude 3.7 & Prompts</option>
            <option value="mcp">MCP Protocol</option>
          </select>
        </div>
      </div>

      {/* Top 3 Spotlight Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Rank 2 (Silver) */}
        <div className="bg-[#131317] border-l-4 border-l-slate-300 border-white/10 rounded-2xl p-6 relative flex flex-col justify-between space-y-4 hover:bg-[#1f1f23] transition-all group">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 flex items-center justify-center font-mono font-bold text-sm">
              🥈 #2
            </span>
            <span className="text-xs font-mono text-[#9ca3af]">2.8k Installs</span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={leaderboardData[1].avatar}
              alt={leaderboardData[1].name}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-300/50"
            />
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#c0f500] transition-colors">
                {leaderboardData[1].name}
              </h3>
              <div className="text-xs font-mono text-[#9ca3af]">@{leaderboardData[1].username}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-[#9ca3af]">{leaderboardData[1].toolsCount} Published Tools</span>
            <span className="text-[#f59e0b] font-bold">${leaderboardData[1].revenueEst.toLocaleString()}/mo</span>
          </div>

          <a
            href={`/profile/${leaderboardData[1].username}`}
            className="w-full py-2 bg-[#1f1f23] group-hover:bg-[#c0f500] text-white group-hover:text-[#161f00] text-xs font-bold rounded-xl text-center transition-colors cursor-pointer"
          >
            View Builder Profile →
          </a>
        </div>

        {/* Rank 1 (Gold) */}
        <div className="bg-[#131317] border-l-4 border-l-amber-400 border-white/10 rounded-2xl p-6 relative flex flex-col justify-between space-y-4 hover:bg-[#1f1f23] transition-all group shadow-[0_0_25px_rgba(245,158,11,0.15)] md:-translate-y-2">
          <div className="flex items-center justify-between">
            <span className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 flex items-center justify-center font-mono font-bold text-sm">
              🥇 #1
            </span>
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
              Top Creator
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={leaderboardData[0].avatar}
              alt={leaderboardData[0].name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#c0f500] transition-colors">
                {leaderboardData[0].name}
              </h3>
              <div className="text-xs font-mono text-amber-400">@{leaderboardData[0].username}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-[#9ca3af]">{leaderboardData[0].toolsCount} Published Tools</span>
            <span className="text-[#f59e0b] font-bold text-sm">${leaderboardData[0].revenueEst.toLocaleString()}/mo</span>
          </div>

          <a
            href={`/profile/${leaderboardData[0].username}`}
            className="w-full py-2.5 bg-[#c0f500] text-[#161f00] text-xs font-bold rounded-xl text-center shadow-md transition-all cursor-pointer"
          >
            View Builder Profile →
          </a>
        </div>

        {/* Rank 3 (Bronze) */}
        <div className="bg-[#131317] border-l-4 border-l-amber-700 border-white/10 rounded-2xl p-6 relative flex flex-col justify-between space-y-4 hover:bg-[#1f1f23] transition-all group">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/40 flex items-center justify-center font-mono font-bold text-sm">
              🥉 #3
            </span>
            <span className="text-xs font-mono text-[#9ca3af]">2.4k Installs</span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={leaderboardData[2].avatar}
              alt={leaderboardData[2].name}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-700/50"
            />
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#c0f500] transition-colors">
                {leaderboardData[2].name}
              </h3>
              <div className="text-xs font-mono text-[#9ca3af]">@{leaderboardData[2].username}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-[#9ca3af]">{leaderboardData[2].toolsCount} Published Tools</span>
            <span className="text-[#f59e0b] font-bold">${leaderboardData[2].revenueEst.toLocaleString()}/mo</span>
          </div>

          <a
            href={`/profile/${leaderboardData[2].username}`}
            className="w-full py-2 bg-[#1f1f23] group-hover:bg-[#c0f500] text-white group-hover:text-[#161f00] text-xs font-bold rounded-xl text-center transition-colors cursor-pointer"
          >
            View Builder Profile →
          </a>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-[#131317] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-sans">Ecosystem Builder Standings</h2>
          <span className="text-xs font-mono text-[#9ca3af]">Showing {filtered.length} Creators</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-white/10 bg-[#0e0e12] text-[#9ca3af] uppercase font-mono text-xs">
                <th className="py-4 px-6 text-center">Rank</th>
                <th className="py-4 px-6">Builder</th>
                <th className="py-4 px-6">Primary Specialty</th>
                <th className="py-4 px-6 text-center">Published Tools</th>
                <th className="py-4 px-6 text-center">Total Installs</th>
                <th className="py-4 px-6 text-center">Avg Rating</th>
                <th className="py-4 px-6 text-right">Est. Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map((item) => {
                let borderAccent = '';
                if (item.rank === 1) borderAccent = 'border-l-4 border-l-amber-400 bg-amber-500/5';
                else if (item.rank === 2) borderAccent = 'border-l-4 border-l-slate-300 bg-slate-500/5';
                else if (item.rank === 3) borderAccent = 'border-l-4 border-l-amber-700 bg-amber-700/5';

                return (
                  <tr
                    key={item.rank}
                    onClick={() => (window.location.href = `/profile/${item.username}`)}
                    className={`hover:bg-[#1f1f23] transition-all cursor-pointer group ${borderAccent}`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6 text-center font-mono font-bold">
                      {item.rank === 1 ? (
                        <span className="text-amber-400 font-bold">🥇 #1</span>
                      ) : item.rank === 2 ? (
                        <span className="text-slate-300 font-bold">🥈 #2</span>
                      ) : item.rank === 3 ? (
                        <span className="text-amber-600 font-bold">🥉 #3</span>
                      ) : (
                        <span className="text-[#9ca3af]">#{item.rank}</span>
                      )}
                    </td>

                    {/* Builder Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-[#c0f500] transition-colors"
                        />
                        <div>
                          <div className="font-bold text-white group-hover:text-[#c0f500] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs font-mono text-[#9ca3af]">@{item.username}</div>
                        </div>
                      </div>
                    </td>

                    {/* Primary Specialty */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded font-mono text-xs bg-[#1f1f23] text-[#00e3fd] border border-white/5">
                        {item.specialty}
                      </span>
                    </td>

                    {/* Tools Count */}
                    <td className="py-4 px-6 text-center font-mono text-white font-semibold">
                      {item.toolsCount}
                    </td>

                    {/* Installs Count */}
                    <td className="py-4 px-6 text-center font-mono text-white font-semibold">
                      {item.installsCount.toLocaleString()}
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6 text-center font-mono">
                      <span className="text-amber-300 font-bold">★ {item.ratingAvg}</span>
                      <span className="text-[10px] text-[#9ca3af] block">({item.reviewsCount} reviews)</span>
                    </td>

                    {/* Revenue */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-[#f59e0b]">
                      ${item.revenueEst.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
