import React, { useState, useMemo } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: 'LAUNCH' | 'BENCHMARK' | 'DEEP DIVE' | 'TOOL' | 'OPINION';
  status: 'published' | 'draft' | 'scheduled';
  publishDate: string;
  scheduledDate?: string;
  author: string;
  readTime: string;
  heroImage: boolean;
  views: number;
  newsletterPush: boolean;
  pushNotification: boolean;
}

type SortField = 'title' | 'category' | 'status' | 'publishDate' | 'views';
type SortDir = 'asc' | 'desc';

/* ─── Mock Data ──────────────────────────────────── */
const NEWS_ARTICLES: NewsArticle[] = [
  { id: 'n1', title: 'Claude 5 Sonnet Public Preview: What Builders Need to Know', slug: 'claude-sonnet-5-wiki-published', category: 'LAUNCH', status: 'published', publishDate: '2026-08-10T00:42:00Z', author: 'WOA Editorial', readTime: '8 min', heroImage: true, views: 4820, newsletterPush: true, pushNotification: true },
  { id: 'n2', title: 'n8n Autonomous Agent Benchmark: 50 Workflows Tested', slug: 'n8n-autonomous-agent-benchmark', category: 'BENCHMARK', status: 'published', publishDate: '2026-08-09T14:00:00Z', author: 'WOA Editorial', readTime: '12 min', heroImage: true, views: 3240, newsletterPush: true, pushNotification: false },
  { id: 'n3', title: 'MCP Protocol v2: Universal Tool Registry & OAuth Support', slug: 'mcp-protocol-v2-launch', category: 'LAUNCH', status: 'published', publishDate: '2026-08-08T10:30:00Z', author: 'WOA Editorial', readTime: '10 min', heroImage: true, views: 6100, newsletterPush: true, pushNotification: true },
  { id: 'n4', title: 'The Future of AI Automation in 2026: 7 Predictions', slug: 'future-of-ai-automation-2026', category: 'DEEP DIVE', status: 'published', publishDate: '2026-08-07T08:00:00Z', author: 'Sarah Chen', readTime: '15 min', heroImage: true, views: 8940, newsletterPush: true, pushNotification: false },
  { id: 'n5', title: 'Open Interpreter + Docker OS: The Linux AI Stack', slug: 'open-interpreter-docker-os', category: 'TOOL', status: 'published', publishDate: '2026-08-06T12:00:00Z', author: 'WOA Editorial', readTime: '9 min', heroImage: true, views: 5400, newsletterPush: false, pushNotification: false },
  { id: 'n6', title: 'LangGraph vs AutoGen: Agent Swarm Showdown 2026', slug: 'langgraph-vs-autogen-agent-swarms', category: 'BENCHMARK', status: 'published', publishDate: '2026-08-05T16:00:00Z', author: 'Marcus Dev', readTime: '14 min', heroImage: true, views: 7200, newsletterPush: true, pushNotification: true },
  { id: 'n7', title: 'Why Every SaaS Should Expose an MCP Server', slug: 'saas-mcp-server-opinion', category: 'OPINION', status: 'draft', publishDate: '2026-08-10T03:00:00Z', author: 'WOA Editorial', readTime: '7 min', heroImage: false, views: 0, newsletterPush: false, pushNotification: false },
  { id: 'n8', title: 'GPT-5 vs Claude 4 Opus: Coding Agent Benchmark', slug: 'gpt5-vs-claude4-coding', category: 'BENCHMARK', status: 'scheduled', publishDate: '2026-08-10T03:00:00Z', scheduledDate: '2026-08-12T08:00:00Z', author: 'WOA Editorial', readTime: '18 min', heroImage: true, views: 0, newsletterPush: true, pushNotification: true },
  { id: 'n9', title: 'Building a Self-Healing CI/CD Pipeline with AI Agents', slug: 'self-healing-cicd-ai', category: 'DEEP DIVE', status: 'draft', publishDate: '2026-08-09T20:00:00Z', author: 'Elena R', readTime: '11 min', heroImage: false, views: 0, newsletterPush: false, pushNotification: false },
  { id: 'n10', title: 'Windsurf vs Cursor vs Claude Code: IDE Wars 2026', slug: 'ide-wars-2026', category: 'BENCHMARK', status: 'scheduled', publishDate: '2026-08-10T03:00:00Z', scheduledDate: '2026-08-14T10:00:00Z', author: 'WOA Editorial', readTime: '16 min', heroImage: true, views: 0, newsletterPush: true, pushNotification: false },
];

const CATEGORY_LABELS = ['All', 'LAUNCH', 'BENCHMARK', 'DEEP DIVE', 'TOOL', 'OPINION'];
const STATUSES = ['All', 'Published', 'Draft', 'Scheduled'];

function categoryColor(cat: NewsArticle['category']) {
  switch (cat) {
    case 'LAUNCH': return { bg: 'bg-[#C0F500]/12', text: 'text-[#C0F500]' };
    case 'BENCHMARK': return { bg: 'bg-[#00DAF3]/12', text: 'text-[#00DAF3]' };
    case 'DEEP DIVE': return { bg: 'bg-[#6C63FF]/12', text: 'text-[#9B93FF]' };
    case 'TOOL': return { bg: 'bg-[#F5A623]/12', text: 'text-[#F5A623]' };
    case 'OPINION': return { bg: 'bg-[#FF6B6B]/12', text: 'text-[#FF6B6B]' };
    default: return { bg: 'bg-[#5A5A68]/12', text: 'text-[#5A5A68]' };
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/* ─── News Editor ────────────────────────────────── */
function NewsEditor({ article, onBack }: { article: NewsArticle; onBack: () => void }) {
  const [title, setTitle] = useState(article.title);
  const [category, setCategory] = useState(article.category);
  const [author, setAuthor] = useState(article.author);
  const [readTime, setReadTime] = useState(article.readTime);
  const [scheduledDate, setScheduledDate] = useState(article.scheduledDate || '');
  const [newsletterPush, setNewsletterPush] = useState(article.newsletterPush);
  const [pushNotification, setPushNotification] = useState(article.pushNotification);
  const [savedAgo] = useState(8);

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-lg bg-[#1E1E24] border border-[#232329] flex items-center justify-center text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          </button>
          <h2 className="text-lg font-semibold text-[#E5E1E7]">Edit News Article</h2>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
            article.status === 'published' ? 'bg-[#C0F500]/15 text-[#C0F500]' :
            article.status === 'scheduled' ? 'bg-[#00DAF3]/15 text-[#00DAF3]' :
            'bg-[#5A5A68]/20 text-[#5A5A68]'
          }`}>
            {article.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#5A5A68]">Saved {savedAgo}s ago</span>
          <button className="px-3 py-1.5 rounded-lg bg-[#1E1E24] border border-[#232329] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors">Preview</button>
          <button className="px-3 py-1.5 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] transition-colors">Publish</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Panel: Editor */}
        <div className="col-span-2 space-y-4">
          {/* Title */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Title</label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[15px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 transition-colors"
            />
          </div>

          {/* Category + Author row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
              <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Category Label</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LABELS.filter(c => c !== 'All').map(cat => {
                  const colors = categoryColor(cat as NewsArticle['category']);
                  return (
                    <button key={cat} onClick={() => setCategory(cat as NewsArticle['category'])}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                        category === cat ? `${colors.bg} ${colors.text} ring-1 ring-current` : 'text-[#5A5A68] hover:text-[#8B8FA3]'
                      }`}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
              <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Author Override</label>
              <input
                type="text" value={author} onChange={e => setAuthor(e.target.value)}
                className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40"
              />
            </div>
          </div>

          {/* Hero Image Upload */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Hero Image (1200×630)</label>
            <div className="bg-[#0E0E12] border-2 border-dashed border-[#232329] rounded-lg h-[200px] flex flex-col items-center justify-center cursor-pointer hover:border-[#C0F500]/30 transition-colors">
              <span className="material-symbols-outlined text-[#5A5A68] mb-2" style={{ fontSize: 32 }}>add_photo_alternate</span>
              <p className="text-[12px] text-[#5A5A68]">Drop hero image or click to upload</p>
              <p className="text-[10px] text-[#5A5A68]/60 mt-0.5">1200×630px · JPG/PNG/WebP · Max 2MB</p>
            </div>
          </div>

          {/* Body Editor */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl">
            <div className="flex items-center gap-1 px-4 py-2 border-b border-[#232329]">
              {['format_bold', 'format_italic', 'format_strikethrough', 'link', 'code', 'format_list_bulleted', 'format_list_numbered', 'format_quote', 'image', 'horizontal_rule'].map(icon => (
                <button key={icon} className="w-7 h-7 rounded flex items-center justify-center text-[#5A5A68] hover:text-[#E5E1E7] hover:bg-[#1E1E24] transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                </button>
              ))}
              <span className="w-px h-5 bg-[#232329] mx-1" />
              {['title', 'data_object', 'table_chart', 'youtube_activity'].map(icon => (
                <button key={icon} className="w-7 h-7 rounded flex items-center justify-center text-[#5A5A68] hover:text-[#E5E1E7] hover:bg-[#1E1E24] transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                </button>
              ))}
            </div>
            <div className="p-4 min-h-[320px] text-[13px] text-[#8B8FA3] leading-relaxed">
              <p className="mb-3"><span className="text-[#E5E1E7] font-semibold text-lg">{article.title}</span></p>
              <p className="mb-3 text-[#5A5A68] italic text-[12px]">By {article.author} · {article.readTime} read</p>
              <p className="mb-3">The AI automation landscape is evolving at an unprecedented pace. In this deep-dive article, we explore the latest developments and what they mean for builders, developers, and automation engineers worldwide.</p>
              <p className="mb-3"><span className="text-[#E5E1E7] font-semibold">## Key Takeaways</span></p>
              <p className="mb-1">- New capabilities unlock previously impossible automation workflows</p>
              <p className="mb-1">- Performance benchmarks show 3x improvement over previous versions</p>
              <p className="mb-1">- Enterprise adoption is accelerating across Fortune 500 companies</p>
              <p className="mb-3">- Open-source alternatives are closing the gap rapidly</p>
              <p><span className="text-[#E5E1E7] font-semibold">## In-Depth Analysis</span></p>
              <p className="mt-2 text-[#5A5A68] italic">Continue writing or use AI-draft from URL...</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Meta */}
        <div className="space-y-4">
          {/* Read Time */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Read Time</label>
            <input
              type="text" value={readTime} onChange={e => setReadTime(e.target.value)}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] font-mono focus:outline-none focus:border-[#C0F500]/40"
            />
          </div>

          {/* Scheduled Publish */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Scheduled Publish</label>
            <input
              type="datetime-local" value={scheduledDate ? scheduledDate.slice(0, 16) : ''} onChange={e => setScheduledDate(e.target.value)}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] font-mono focus:outline-none focus:border-[#C0F500]/40"
            />
            {scheduledDate && (
              <p className="text-[10px] text-[#00DAF3] mt-1.5 font-mono">⏱ Will publish at scheduled time</p>
            )}
          </div>

          {/* Notification Toggles */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4 space-y-3">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium block">Distribution</label>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#E5E1E7] font-medium">Newsletter Push</p>
                <p className="text-[10px] text-[#5A5A68]">Send to subscribers</p>
              </div>
              <button onClick={() => setNewsletterPush(!newsletterPush)}
                className={`w-10 h-5 rounded-full transition-colors relative ${newsletterPush ? 'bg-[#C0F500]' : 'bg-[#232329]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${newsletterPush ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#E5E1E7] font-medium">Push Notification</p>
                <p className="text-[10px] text-[#5A5A68]">Send browser push</p>
              </div>
              <button onClick={() => setPushNotification(!pushNotification)}
                className={`w-10 h-5 rounded-full transition-colors relative ${pushNotification ? 'bg-[#C0F500]' : 'bg-[#232329]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pushNotification ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {/* SEO Meta */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Meta Title</label>
            <input
              type="text" defaultValue={`${article.title} — Wiki of Automation`}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 mb-3"
            />
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Meta Description</label>
            <textarea
              rows={3} defaultValue={article.title}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['#ai', '#automation', '#' + article.slug.split('-')[0]].map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#C0F500]/10 text-[11px] text-[#C0F500] font-mono">
                  {tag}
                  <span className="cursor-pointer text-[#C0F500]/40 hover:text-[#FF6B6B]">×</span>
                </span>
              ))}
            </div>
            <input
              type="text" placeholder="Add tag..."
              className="w-full bg-[#0E0E12] border border-[#232329] rounded px-2 py-1 text-[11px] text-[#E5E1E7] font-mono focus:outline-none focus:border-[#C0F500]/40"
            />
          </div>

          {/* AI Draft */}
          <div className="bg-[#131317] border border-[#6C63FF]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#6C63FF]" style={{ fontSize: 16 }}>smart_toy</span>
              <label className="text-[11px] uppercase tracking-wider text-[#6C63FF] font-semibold">AI Assist</label>
            </div>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6C63FF]/8 border border-[#6C63FF]/15 text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:border-[#6C63FF]/30 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>link</span>
                AI-draft from URL
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6C63FF]/8 border border-[#6C63FF]/15 text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:border-[#6C63FF]/30 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_fix_high</span>
                Rewrite with Ada
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6C63FF]/8 border border-[#6C63FF]/15 text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:border-[#6C63FF]/30 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>summarize</span>
                Generate summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
export const NewsCms: React.FC = () => {
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }
    return '';
  });
  const [categoryFilter, setCategoryFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('category') || 'All';
    }
    return 'All';
  });
  const [statusFilter, setStatusFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('status') || 'All';
    }
    return 'All';
  });
  const [sortField, setSortField] = useState<SortField>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (params.get('sort') as SortField) || 'publishDate';
    }
    return 'publishDate';
  });
  const [sortDir, setSortDir] = useState<SortDir>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (params.get('order') as SortDir) || 'desc';
    }
    return 'desc';
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      if (sortField) params.set('sort', sortField);
      if (sortDir) params.set('order', sortDir);
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (search) params.set('q', search);
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [sortField, sortDir, categoryFilter, statusFilter, search]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let articles = [...NEWS_ARTICLES];
    if (search) articles = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter !== 'All') articles = articles.filter(a => a.category === categoryFilter);
    if (statusFilter !== 'All') articles = articles.filter(a => a.status === statusFilter.toLowerCase());
    articles.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'category': cmp = a.category.localeCompare(b.category); break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        case 'publishDate': cmp = new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime(); break;
        case 'views': cmp = a.views - b.views; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return articles;
  }, [search, categoryFilter, statusFilter, sortField, sortDir]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(a => a.id)));
  };

  const publishedCount = NEWS_ARTICLES.filter(a => a.status === 'published').length;
  const draftCount = NEWS_ARTICLES.filter(a => a.status === 'draft').length;
  const scheduledCount = NEWS_ARTICLES.filter(a => a.status === 'scheduled').length;

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="material-symbols-outlined ml-0.5 inline-block" style={{ fontSize: 14, opacity: sortField === field ? 1 : 0.3 }}>
      {sortField === field && sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="news" />
      <TopBar breadcrumbs={['Admin', 'Content', 'News']} />

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-4 max-w-[1400px]">

          {editingArticle ? (
            <NewsEditor article={editingArticle} onBack={() => setEditingArticle(null)} />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-[#E5E1E7]">News CMS</h1>
                  <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">{NEWS_ARTICLES.length} articles · {publishedCount} published · {draftCount} drafts · {scheduledCount} scheduled</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[12px] text-[#9B93FF] hover:text-[#E5E1E7] transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>link</span>
                    AI-draft from URL
                  </button>
                  <button
                    onClick={() => setEditingArticle(NEWS_ARTICLES[0])}
                    className="px-3 py-1.5 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                    New article
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-[400px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A68]" style={{ fontSize: 16 }}>search</span>
                  <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
                    className="w-full bg-[#131317] border border-[#232329] rounded-lg pl-9 pr-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 placeholder:text-[#5A5A68]"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  {CATEGORY_LABELS.map(cat => {
                    const colors = cat !== 'All' ? categoryColor(cat as NewsArticle['category']) : { bg: '', text: '' };
                    return (
                      <button key={cat} onClick={() => setCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors ${
                          categoryFilter === cat
                            ? cat === 'All' ? 'bg-[#C0F500]/15 text-[#C0F500]' : `${colors.bg} ${colors.text}`
                            : 'text-[#5A5A68] hover:text-[#8B8FA3]'
                        }`}>
                        {cat}
                      </button>
                    );
                  })}
                </div>
                <span className="w-px h-5 bg-[#232329]" />
                {STATUSES.map(st => (
                  <button key={st} onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${statusFilter === st ? 'bg-[#00DAF3]/15 text-[#00DAF3]' : 'text-[#5A5A68] hover:text-[#8B8FA3]'}`}>
                    {st}
                  </button>
                ))}
              </div>

              {/* Bulk Actions */}
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 bg-[#C0F500]/8 border border-[#C0F500]/20 rounded-lg px-4 py-2">
                  <span className="text-[12px] text-[#C0F500] font-medium">{selectedIds.size} selected</span>
                  <button className="text-[11px] text-[#8B8FA3] hover:text-[#E5E1E7] px-2 py-0.5 rounded bg-[#1E1E24]">Bulk Publish</button>
                  <button className="text-[11px] text-[#8B8FA3] hover:text-[#E5E1E7] px-2 py-0.5 rounded bg-[#1E1E24]">Bulk Unpublish</button>
                  <button className="text-[11px] text-[#FF6B6B] hover:text-[#FF9B9B] px-2 py-0.5 rounded bg-[#1E1E24]">Delete Selected</button>
                  <button onClick={() => setSelectedIds(new Set())} className="text-[11px] text-[#5A5A68] hover:text-[#8B8FA3] ml-auto">Clear</button>
                </div>
              )}

              {/* Table */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#232329] text-[11px] uppercase tracking-wider text-[#5A5A68]">
                      <th className="w-10 py-2.5 px-3 text-left">
                        <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                          className="w-3.5 h-3.5 rounded border-[#232329] bg-[#0E0E12] text-[#C0F500] focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                      </th>
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3]" onClick={() => toggleSort('title')}>
                        Title <SortIcon field="title" />
                      </th>
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3] w-[100px]" onClick={() => toggleSort('category')}>
                        Label <SortIcon field="category" />
                      </th>
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3] w-[90px]" onClick={() => toggleSort('status')}>
                        Status <SortIcon field="status" />
                      </th>
                      <th className="py-2.5 px-3 text-left w-[80px]">Author</th>
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3] w-[80px]" onClick={() => toggleSort('views')}>
                        Views <SortIcon field="views" />
                      </th>
                      <th className="py-2.5 px-3 text-left w-[50px]">Img</th>
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3] w-[130px]" onClick={() => toggleSort('publishDate')}>
                        Date <SortIcon field="publishDate" />
                      </th>
                      <th className="py-2.5 px-3 text-right w-[180px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E24]">
                    {filtered.map((article, idx) => {
                      const catColors = categoryColor(article.category);
                      return (
                        <tr key={article.id} className={`hover:bg-[#0E0E12] transition-colors ${idx % 2 === 0 ? '' : 'bg-[#0A0A0E]'}`}>
                          <td className="py-2.5 px-3">
                            <input type="checkbox" checked={selectedIds.has(article.id)} onChange={() => toggleSelect(article.id)}
                              className="w-3.5 h-3.5 rounded border-[#232329] bg-[#0E0E12] text-[#C0F500] focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                          </td>
                          <td className="py-2.5 px-3">
                            <p className="text-[13px] font-medium text-[#E5E1E7] line-clamp-1">{article.title}</p>
                            <span className="text-[10px] font-mono text-[#5A5A68]">/news/{article.slug} · {article.readTime}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${catColors.bg} ${catColors.text}`}>
                              {article.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="flex items-center gap-1.5 text-[12px]">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                article.status === 'published' ? 'bg-[#C0F500]' :
                                article.status === 'scheduled' ? 'bg-[#00DAF3]' :
                                'bg-[#5A5A68]'
                              }`} />
                              <span className={
                                article.status === 'published' ? 'text-[#C0F500]' :
                                article.status === 'scheduled' ? 'text-[#00DAF3]' :
                                'text-[#5A5A68]'
                              }>{article.status.charAt(0).toUpperCase() + article.status.slice(1)}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-[#8B8FA3] truncate max-w-[80px]">{article.author}</td>
                          <td className="py-2.5 px-3 text-[12px] font-mono text-[#8B8FA3]">{article.views > 0 ? article.views.toLocaleString() : '—'}</td>
                          <td className="py-2.5 px-3">
                            <span className={`material-symbols-outlined ${article.heroImage ? 'text-[#C0F500]' : 'text-[#5A5A68]/30'}`} style={{ fontSize: 16 }}>
                              {article.heroImage ? 'check_circle' : 'cancel'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[12px] text-[#8B8FA3]">{formatDate(article.publishDate)}</span>
                            {article.scheduledDate && (
                              <span className="block text-[10px] font-mono text-[#00DAF3]">⏱ {formatDate(article.scheduledDate)}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => setEditingArticle(article)}
                                className="px-2 py-1 rounded text-[11px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#1E1E24] transition-colors">Edit</button>
                              <button className="px-2 py-1 rounded text-[11px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#1E1E24] transition-colors">Preview</button>
                              <button className="px-2 py-1 rounded text-[11px] text-[#FF6B6B] hover:text-[#FF9B9B] hover:bg-[#1E1E24] transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="flex items-center justify-between text-[11px] text-[#5A5A68] font-mono">
                <span>Showing {filtered.length} of {NEWS_ARTICLES.length} articles</span>
                <span>Sort: {sortField} {sortDir}</span>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
