import React, { useState } from 'react';

export interface ForumThread {
  id: string;
  author: string;
  authorAvatar: string;
  authorHandle: string;
  timeAgo: string;
  title: string;
  excerpt: string;
  tags: string[];
  repliesCount: number;
  viewsCount: number;
  upvotesCount: number;
  isUnanswered?: boolean;
}

export const ForumIndex: React.FC = () => {
  const [filterTab, setFilterTab] = useState<'hot' | 'new' | 'unanswered'>('hot');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('#help');
  const [newBody, setNewBody] = useState('');

  // Selected Thread Detail Modal State
  const [activeThreadDetail, setActiveThreadDetail] = useState<ForumThread | null>(null);
  const [replyText, setReplyText] = useState('');
  const [repliesList, setRepliesList] = useState<
    Array<{ author: string; handle: string; avatar: string; text: string; timeAgo: string }>
  >([
    {
      author: 'Linus Torvalds',
      handle: 'linustech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text: 'Make sure your Postgres pooler max connections is set to at least 50. LangGraph state checkpointer holds transaction locks per agent step.',
      timeAgo: '1h ago',
    },
    {
      author: 'Elena Rostova',
      handle: 'elena_r',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      text: 'We ran into this last week! Switching to async connection pooling resolved the 10+ agent deadlock issue completely.',
      timeAgo: '45m ago',
    },
  ]);

  const initialThreads: ForumThread[] = [
    {
      id: 'thread-1',
      author: 'Ada Lovelace',
      authorHandle: 'ada_lovelace',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      timeAgo: '2h ago',
      title: 'How to handle state persistence in multi-agent LangGraph swarms with Postgres checkpointer?',
      excerpt:
        'When scaling beyond 10 concurrent agent threads, SQLite checkpointer locks up with database locked error. Here is our benchmark test showing how PostgreSQL pooler resolves it.',
      tags: ['#langgraph', '#help', '#agents'],
      repliesCount: 42,
      viewsCount: 1840,
      upvotesCount: 128,
    },
    {
      id: 'thread-2',
      author: 'Linus Torvalds',
      authorHandle: 'linustech',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      timeAgo: '4h ago',
      title: 'MCP Server protocol v2 specification is out — here is what changed for tool definitions',
      excerpt:
        'The new standard introduces asynchronous stream handlers and binary file passing capabilities over stdio and SSE connections. Full breakdown and migration code included.',
      tags: ['#mcp', '#claude'],
      repliesCount: 29,
      viewsCount: 2420,
      upvotesCount: 95,
    },
    {
      id: 'thread-3',
      author: 'Alex Rivera',
      authorHandle: 'alex_rivera',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      timeAgo: '6h ago',
      title: 'n8n + Stripe webhook integration throwing 401 signature verification failed in self-hosted Docker',
      excerpt:
        'Make sure you pass the raw binary request body before body-parser parses JSON. Here is the working docker-compose snippet with proper Nginx reverse proxy headers.',
      tags: ['#n8n', '#docker', '#help'],
      repliesCount: 15,
      viewsCount: 890,
      upvotesCount: 64,
    },
    {
      id: 'thread-4',
      author: 'Elena Rostova',
      authorHandle: 'elena_r',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      timeAgo: '12h ago',
      title: 'Claude 3.7 Sonnet extended thinking mode vs DeepSeek-R1 for complex workflow code generation',
      excerpt:
        'Benchmark results across 500 n8n JSON nodes and Python MCP tool calls. Sonnet 3.7 achieves 98.2% valid syntax accuracy with reasoning tokens enabled.',
      tags: ['#claude', '#agents'],
      repliesCount: 67,
      viewsCount: 4120,
      upvotesCount: 210,
    },
    {
      id: 'thread-5',
      author: 'Marcus Chen',
      authorHandle: 'marcus_dev',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      timeAgo: '1d ago',
      title: 'Building an Autonomous Dev OS inside Docker container — security isolation tips',
      excerpt:
        'How we configured non-root user permissions, limited cgroups CPU quota, and mounted workspace paths safely for Open Interpreter execution.',
      tags: ['#docker', '#mcp'],
      repliesCount: 34,
      viewsCount: 1560,
      upvotesCount: 88,
    },
    {
      id: 'thread-6',
      author: 'Sarah Jenkins',
      authorHandle: 'sarah_ai',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
      timeAgo: '2d ago',
      title: 'What is your fallback strategy when OpenAI or Anthropic API encounters 529 overload errors?',
      excerpt:
        'Discussing automated failover routers: routing to Gemini 1.5 Pro or local Ollama models when primary cloud APIs return 5xx rates.',
      tags: ['#agents', '#help'],
      repliesCount: 0,
      viewsCount: 320,
      upvotesCount: 14,
      isUnanswered: true,
    },
  ];

  const [threads, setThreads] = useState<ForumThread[]>(initialThreads);

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, upvotesCount: t.upvotesCount + 1 } : t))
    );
  };

  const handleCreateThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const created: ForumThread = {
      id: `thread-${Date.now()}`,
      author: 'You (Current Builder)',
      authorHandle: 'current_builder',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      timeAgo: 'Just now',
      title: newTitle.trim(),
      excerpt: newBody.trim(),
      tags: [newCategory],
      repliesCount: 0,
      viewsCount: 1,
      upvotesCount: 1,
      isUnanswered: true,
    };

    setThreads([created, ...threads]);
    setNewTitle('');
    setNewBody('');
    setIsNewThreadModalOpen(false);
  };

  const handleAddReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadDetail) return;

    const newReply = {
      author: 'You (Current Builder)',
      handle: 'current_builder',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      text: replyText.trim(),
      timeAgo: 'Just now',
    };

    setRepliesList([...repliesList, newReply]);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadDetail.id ? { ...t, repliesCount: t.repliesCount + 1 } : t
      )
    );
    setReplyText('');
  };

  // Filter logic
  let filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authorHandle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTag === 'all' || t.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  if (filterTab === 'new') {
    filteredThreads = [...filteredThreads].reverse();
  } else if (filterTab === 'unanswered') {
    filteredThreads = filteredThreads.filter((t) => t.repliesCount === 0 || t.isUnanswered);
  }

  const topTags = ['#n8n', '#claude', '#mcp', '#agents', '#docker', '#langgraph', '#help'];
  const activeBuilders = [
    { name: 'Ada Lovelace', handle: 'ada_lovelace', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80', tools: 12 },
    { name: 'Linus Torvalds', handle: 'linustech', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', tools: 8 },
    { name: 'Alex Rivera', handle: 'alex_rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', tools: 15 },
    { name: 'Elena Rostova', handle: 'elena_r', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', tools: 9 },
    { name: 'Marcus Chen', handle: 'marcus_dev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', tools: 6 },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase bg-[#c0f500]/10 text-[#c0f500] border border-[#c0f500]/30">
            💬 Open Builder Discussions
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Community <span className="text-[#c0f500]">Forum</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9ca3af] max-w-xl">
            Discuss AI workflows, MCP server protocols, prompt engineering, and autonomous agent swarms with verified builders.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forum threads..."
              className="w-full h-11 bg-[#131317] border border-white/10 focus:border-[#c0f500] rounded-xl pl-10 pr-4 text-xs font-mono text-white focus:outline-none transition-colors"
            />
            <span className="absolute left-3.5 top-3 text-[#9ca3af] text-sm">🔍</span>
          </div>

          <button
            onClick={() => setIsNewThreadModalOpen(true)}
            className="h-11 px-5 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm shadow-[0_0_15px_rgba(192,245,0,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>+ New Thread</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Threads List (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filter Bar & Tag Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131317] border border-white/10 rounded-2xl p-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#1f1f23] p-1 rounded-xl">
              <button
                onClick={() => setFilterTab('hot')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterTab === 'hot' ? 'bg-[#c0f500] text-[#161f00]' : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                Hot 🔥
              </button>
              <button
                onClick={() => setFilterTab('new')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterTab === 'new' ? 'bg-[#c0f500] text-[#161f00]' : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                New ⚡
              </button>
              <button
                onClick={() => setFilterTab('unanswered')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterTab === 'unanswered' ? 'bg-[#c0f500] text-[#161f00]' : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                Unanswered ❓
              </button>
            </div>

            {/* Tag Selection */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-mono uppercase text-[#9ca3af]">Tag:</span>
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                  selectedTag === 'all'
                    ? 'bg-[#00e3fd]/20 text-[#00e3fd] border border-[#00e3fd]/30'
                    : 'bg-[#1f1f23] text-[#9ca3af] hover:text-white'
                }`}
              >
                All
              </button>
              {['#n8n', '#claude', '#mcp', '#agents', '#help'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-[#00e3fd]/20 text-[#00e3fd] border border-[#00e3fd]/30'
                      : 'bg-[#1f1f23] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Threads Cards List */}
          <div className="space-y-4">
            {filteredThreads.length === 0 ? (
              <div className="p-12 text-center bg-[#131317] border border-white/10 rounded-2xl space-y-3">
                <div className="text-3xl">💬</div>
                <h3 className="text-lg font-bold text-white">No discussions found</h3>
                <p className="text-xs text-[#9ca3af]">Try adjusting your search query or tag filter.</p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadDetail(thread)}
                  className="bg-[#131317] border border-white/10 hover:border-[#c0f500] rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 shadow-lg space-y-4"
                >
                  {/* Author Line */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/profile/${thread.authorHandle}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2.5 group/author"
                      >
                        <img
                          src={thread.authorAvatar}
                          alt={thread.author}
                          className="w-8 h-8 rounded-full object-cover border border-white/10 group-hover/author:border-[#c0f500]"
                        />
                        <div>
                          <span className="text-xs font-bold text-white group-hover/author:text-[#c0f500] transition-colors block">
                            @{thread.authorHandle}
                          </span>
                          <span className="text-[10px] text-[#9ca3af] font-mono">{thread.author}</span>
                        </div>
                      </a>
                      <span className="text-[#9ca3af] text-xs">·</span>
                      <span className="text-xs font-mono text-[#9ca3af]">{thread.timeAgo}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {thread.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-[#1f1f23] text-[#00e3fd] border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Thread Title & Excerpt */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-[#c0f500] transition-colors leading-snug">
                      {thread.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9ca3af] line-clamp-2 leading-relaxed">
                      {thread.excerpt}
                    </p>
                  </div>

                  {/* Thread Metrics Footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#9ca3af]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        💬 <strong className="text-white">{thread.repliesCount}</strong> replies
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        👁️ <strong className="text-white">{thread.viewsCount.toLocaleString()}</strong> views
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleUpvote(thread.id, e)}
                      className="px-3 py-1 bg-[#1f1f23] hover:bg-[#c0f500]/20 text-[#c0f500] border border-[#c0f500]/30 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>🔥</span>
                      <span>{thread.upvotesCount}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Tags Widget */}
          <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-mono uppercase font-bold text-white flex items-center gap-2">
              <span>🏷️</span> Top Forum Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-[#c0f500] text-[#161f00] font-bold'
                      : 'bg-[#1f1f23] text-white hover:border-[#c0f500] border border-white/5'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Active Builders Widget */}
          <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase font-bold text-white flex items-center gap-2">
                <span>⚡</span> Active Builders
              </h3>
              <a href="/community/leaderboard" className="text-xs font-mono text-[#00e3fd] hover:underline">
                Leaderboard →
              </a>
            </div>

            <div className="space-y-3">
              {activeBuilders.map((builder, i) => (
                <a
                  key={i}
                  href={`/profile/${builder.handle}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1f1f23] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={builder.avatar}
                        alt={builder.name}
                        className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover:border-[#c0f500]"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-[#131317] absolute bottom-0 right-0"></span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#c0f500] transition-colors">
                        {builder.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#9ca3af]">@{builder.handle}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] text-[#00e3fd] bg-[#00e3fd]/10 border border-[#00e3fd]/20">
                    {builder.tools} tools
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Community Rules Widget */}
          <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-mono uppercase font-bold text-white flex items-center gap-2">
              <span>📜</span> Community Rules
            </h3>
            <ul className="space-y-2.5 text-xs text-[#9ca3af] leading-relaxed font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#c0f500] font-mono font-bold">1.</span>
                <span><strong>Be helpful & respectful:</strong> Share constructive code feedback and support fellow builders.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c0f500] font-mono font-bold">2.</span>
                <span><strong>No spam or low-effort ads:</strong> Keep self-promotion restricted to Show & Tell threads.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c0f500] font-mono font-bold">3.</span>
                <span><strong>Credit sources:</strong> Respect open-source licenses and reference original workflow creators.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* NEW THREAD MODAL */}
      {isNewThreadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#131317] border border-white/10 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Create New Discussion Thread</h3>
              <button
                onClick={() => setIsNewThreadModalOpen(false)}
                className="text-[#9ca3af] hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateThreadSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-[#9ca3af]">Thread Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best practice for mounting persistent volume in Dockerized n8n worker nodes"
                  required
                  className="w-full h-12 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-[#9ca3af]">Category / Tag</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-12 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-4 text-xs font-mono text-white focus:outline-none"
                >
                  <option value="#n8n">#n8n Workflow Automation</option>
                  <option value="#claude">#claude Anthropic LLMs</option>
                  <option value="#mcp">#mcp Model Context Protocol</option>
                  <option value="#agents">#agents Autonomous Swarms</option>
                  <option value="#docker">#docker Dev OS Isolation</option>
                  <option value="#help">#help General Troubleshooting</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-[#9ca3af]">Discussion Content</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Describe your architecture question or benchmark findings in detail..."
                  rows={5}
                  required
                  className="w-full bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewThreadModalOpen(false)}
                  className="px-4 h-11 bg-[#1f1f23] text-[#9ca3af] hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 h-11 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Publish Thread →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THREAD DETAIL & REPLIES MODAL */}
      {activeThreadDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#131317] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeThreadDetail.authorAvatar}
                  alt={activeThreadDetail.author}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="text-sm font-bold text-white">{activeThreadDetail.author}</div>
                  <div className="text-xs font-mono text-[#9ca3af]">@{activeThreadDetail.authorHandle} · {activeThreadDetail.timeAgo}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveThreadDetail(null)}
                className="text-[#9ca3af] hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Thread Body */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{activeThreadDetail.title}</h2>
              <p className="text-sm text-[#9ca3af] leading-relaxed whitespace-pre-wrap">{activeThreadDetail.excerpt}</p>
              <div className="flex items-center gap-2">
                {activeThreadDetail.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded font-mono text-xs bg-[#1f1f23] text-[#00e3fd] border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Replies List */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-mono uppercase font-bold text-white">
                Replies ({repliesList.length + activeThreadDetail.repliesCount})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {repliesList.map((reply, idx) => (
                  <div key={idx} className="p-4 bg-[#1f1f23] border border-white/10 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={reply.avatar} alt={reply.author} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-bold text-white">@{reply.handle}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#9ca3af]">{reply.timeAgo}</span>
                    </div>
                    <p className="text-xs text-[#9ca3af] leading-relaxed">{reply.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Reply Form */}
              <form onSubmit={handleAddReplySubmit} className="space-y-3 pt-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a constructive reply..."
                  rows={3}
                  required
                  className="w-full bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl p-3 text-xs text-white focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 h-10 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Post Reply →
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
