import React, { useState, useMemo } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Types ──────────────────────────────────────── */
interface WikiEntry {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'live' | 'draft' | 'archived';
  lastUpdated: string;
  author: string;
  views: number;
  quickAnswer: string;
  faqCount: number;
  verified: boolean;
  featured: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

type SortField = 'title' | 'category' | 'status' | 'lastUpdated' | 'views';
type SortDir = 'asc' | 'desc';
type ViewMode = 'table' | 'editor';

/* ─── Mock Data ──────────────────────────────────── */
const WIKI_ENTRIES: WikiEntry[] = [
  { id: 'w1', title: 'n8n', slug: 'n8n', category: 'Frameworks', status: 'live', lastUpdated: '2026-08-10T02:30:00Z', author: 'admin@woa', views: 12400, quickAnswer: 'Fair-code workflow automation with 400+ integrations, self-hosted or cloud.', faqCount: 8, verified: true, featured: true },
  { id: 'w2', title: 'Model Context Protocol', slug: 'model-context-protocol', category: 'Protocols', status: 'live', lastUpdated: '2026-08-09T18:15:00Z', author: 'admin@woa', views: 8920, quickAnswer: 'Universal interface connecting AI models to external tools, data, and context.', faqCount: 6, verified: true, featured: true },
  { id: 'w3', title: 'LangGraph', slug: 'langgraph', category: 'Frameworks', status: 'live', lastUpdated: '2026-08-09T14:00:00Z', author: 'admin@woa', views: 7340, quickAnswer: 'Graph-based framework for building stateful, multi-agent LLM applications.', faqCount: 5, verified: true, featured: false },
  { id: 'w4', title: 'AutoGen', slug: 'autogen', category: 'Agents', status: 'live', lastUpdated: '2026-08-08T22:45:00Z', author: 'admin@woa', views: 6180, quickAnswer: 'Microsoft framework for building multi-agent AI systems with role-based conversations.', faqCount: 4, verified: true, featured: false },
  { id: 'w5', title: 'Claude 3.7 Sonnet', slug: 'claude-3-7-sonnet', category: 'Models', status: 'live', lastUpdated: '2026-08-08T16:30:00Z', author: 'admin@woa', views: 15200, quickAnswer: 'Anthropic flagship model: best-in-class coding, extended thinking, 200k context.', faqCount: 7, verified: true, featured: true },
  { id: 'w6', title: 'Claude Code', slug: 'claude-code', category: 'Agents', status: 'draft', lastUpdated: '2026-08-10T03:00:00Z', author: 'admin@woa', views: 0, quickAnswer: 'Agentic CLI coding tool by Anthropic for terminal-native development.', faqCount: 2, verified: false, featured: false },
  { id: 'w7', title: 'OpenAI Codex', slug: 'openai-codex', category: 'Agents', status: 'draft', lastUpdated: '2026-08-09T10:20:00Z', author: 'admin@woa', views: 0, quickAnswer: 'Cloud-based coding agent running in a sandboxed environment.', faqCount: 1, verified: false, featured: false },
  { id: 'w8', title: 'Gemini CLI', slug: 'gemini-cli', category: 'Agents', status: 'live', lastUpdated: '2026-08-07T20:00:00Z', author: 'admin@woa', views: 4100, quickAnswer: 'Open-source AI agent by Google DeepMind running directly in the terminal.', faqCount: 3, verified: true, featured: false },
  { id: 'w9', title: 'Zapier', slug: 'zapier', category: 'Frameworks', status: 'live', lastUpdated: '2026-08-06T12:00:00Z', author: 'admin@woa', views: 9800, quickAnswer: 'No-code workflow automation platform with 7,000+ app integrations.', faqCount: 5, verified: true, featured: false },
  { id: 'w10', title: 'Make (Integromat)', slug: 'make', category: 'Frameworks', status: 'live', lastUpdated: '2026-08-05T09:30:00Z', author: 'admin@woa', views: 7600, quickAnswer: 'Visual automation platform for designing complex multi-step workflows.', faqCount: 4, verified: true, featured: false },
  { id: 'w11', title: 'CrewAI', slug: 'crewai', category: 'Agents', status: 'draft', lastUpdated: '2026-08-04T15:00:00Z', author: 'admin@woa', views: 0, quickAnswer: 'Framework for orchestrating role-playing autonomous AI agents.', faqCount: 0, verified: false, featured: false },
  { id: 'w12', title: 'Docker', slug: 'docker', category: 'Concepts', status: 'live', lastUpdated: '2026-08-03T08:45:00Z', author: 'admin@woa', views: 5400, quickAnswer: 'Container platform for building, shipping, and running applications.', faqCount: 3, verified: true, featured: false },
];

const CATEGORIES = ['All', 'Frameworks', 'Protocols', 'Agents', 'Models', 'Concepts', 'Companies'];
const STATUSES = ['All', 'Live', 'Draft', 'Archived'];

/* ─── Helper Functions ───────────────────────────── */
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/* ─── Editor View ────────────────────────────────── */
function WikiEditor({ entry, onBack }: { entry: WikiEntry; onBack: () => void }) {
  const [title, setTitle] = useState(entry.title);
  const [category, setCategory] = useState(entry.category);
  const [quickAnswer, setQuickAnswer] = useState(entry.quickAnswer);
  const [slug, setSlug] = useState(entry.slug);
  const [metaTitle, setMetaTitle] = useState(`${entry.title} — Wiki of Automation`);
  const [metaDesc, setMetaDesc] = useState(entry.quickAnswer);
  const [verified, setVerified] = useState(entry.verified);
  const [featured, setFeatured] = useState(entry.featured);
  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 'faq1', question: `What is ${entry.title}?`, answer: entry.quickAnswer },
    { id: 'faq2', question: `Is ${entry.title} free?`, answer: 'Check the official pricing page for the most up-to-date information.' },
  ]);
  const [savedAgo, setSavedAgo] = useState(12);

  const wordCount = quickAnswer.split(/\s+/).filter(Boolean).length;

  const addFaq = () => {
    setFaqs(prev => [...prev, { id: `faq-${Date.now()}`, question: '', answer: '' }]);
  };
  const removeFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-lg bg-[#1E1E24] border border-[#232329] flex items-center justify-center text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          </button>
          <h2 className="text-lg font-semibold text-[#E5E1E7]">Edit Wiki Entry</h2>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${entry.status === 'live' ? 'bg-[#C0F500]/15 text-[#C0F500]' : 'bg-[#5A5A68]/20 text-[#5A5A68]'}`}>
            {entry.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#5A5A68]">Saved {savedAgo}s ago</span>
          <button className="px-3 py-1.5 rounded-lg bg-[#1E1E24] border border-[#232329] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors">Preview</button>
          <button className="px-3 py-1.5 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] transition-colors">Publish</button>
        </div>
      </div>

      {/* 2-panel layout */}
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

          {/* Category */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Category</label>
            <select
              value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40"
            >
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Quick Answer */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">Quick Answer</label>
              <span className={`text-[10px] font-mono ${wordCount > 60 ? 'text-[#FF6B6B]' : 'text-[#5A5A68]'}`}>{wordCount}/60 words</span>
            </div>
            <textarea
              value={quickAnswer} onChange={e => setQuickAnswer(e.target.value)}
              rows={3}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 resize-none"
            />
          </div>

          {/* Body Editor (TipTap-style mock) */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl">
            <div className="flex items-center gap-1 px-4 py-2 border-b border-[#232329]">
              {['format_bold', 'format_italic', 'format_strikethrough', 'link', 'code', 'format_list_bulleted', 'format_list_numbered', 'format_quote', 'image', 'horizontal_rule'].map(icon => (
                <button key={icon} className="w-7 h-7 rounded flex items-center justify-center text-[#5A5A68] hover:text-[#E5E1E7] hover:bg-[#1E1E24] transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                </button>
              ))}
              <span className="w-px h-5 bg-[#232329] mx-1" />
              {['title', 'data_object', 'table_chart'].map(icon => (
                <button key={icon} className="w-7 h-7 rounded flex items-center justify-center text-[#5A5A68] hover:text-[#E5E1E7] hover:bg-[#1E1E24] transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                </button>
              ))}
            </div>
            <div className="p-4 min-h-[280px] text-[13px] text-[#8B8FA3] leading-relaxed">
              <p className="mb-3"><span className="text-[#E5E1E7] font-semibold">## Overview</span></p>
              <p className="mb-3">{entry.title} is a powerful tool in the automation ecosystem. It provides builders with robust capabilities for creating, deploying, and managing automated workflows at scale.</p>
              <p className="mb-3"><span className="text-[#E5E1E7] font-semibold">## Key Features</span></p>
              <p className="mb-1">- **Visual workflow builder** — drag-and-drop interface for creating complex automation flows</p>
              <p className="mb-1">- **400+ integrations** — connect to popular services and APIs out of the box</p>
              <p className="mb-1">- **Self-hosted option** — full data sovereignty with Docker or Kubernetes deployment</p>
              <p className="mb-3">- **AI-native** — built-in support for LLM tool calling and agent orchestration</p>
              <p><span className="text-[#E5E1E7] font-semibold">## Getting Started</span></p>
              <p className="mt-2 text-[#5A5A68] italic">Continue writing or use Ada to generate content...</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">FAQ ({faqs.length})</label>
              <button onClick={addFaq} className="flex items-center gap-1 text-[11px] text-[#C0F500] hover:underline font-medium">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add FAQ
              </button>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={faq.id} className="bg-[#0E0E12] border border-[#1E1E24] rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-[11px] font-mono text-[#5A5A68] mt-1.5 shrink-0">Q{i+1}</span>
                    <input
                      type="text" value={faq.question} onChange={e => { const updated = [...faqs]; updated[i] = { ...faq, question: e.target.value }; setFaqs(updated); }}
                      className="flex-1 bg-transparent border-b border-[#232329] pb-1 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40"
                      placeholder="Question..."
                    />
                    <button onClick={() => removeFaq(faq.id)} className="text-[#5A5A68] hover:text-[#FF6B6B] mt-0.5 transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                    </button>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-mono text-[#5A5A68] mt-1.5 shrink-0">A{i+1}</span>
                    <textarea
                      value={faq.answer} onChange={e => { const updated = [...faqs]; updated[i] = { ...faq, answer: e.target.value }; setFaqs(updated); }}
                      rows={2}
                      className="flex-1 bg-transparent border-b border-[#232329] pb-1 text-[13px] text-[#8B8FA3] focus:outline-none focus:border-[#C0F500]/40 resize-none"
                      placeholder="Answer..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Meta/SEO */}
        <div className="space-y-4">
          {/* Slug */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Slug</label>
            <div className="flex items-center gap-1">
              <span className="text-[12px] text-[#5A5A68] font-mono">/wiki/{category.toLowerCase()}/</span>
              <input
                type="text" value={slug} onChange={e => setSlug(e.target.value)}
                className="flex-1 bg-[#0E0E12] border border-[#232329] rounded px-2 py-1 text-[12px] text-[#E5E1E7] font-mono focus:outline-none focus:border-[#C0F500]/40"
              />
            </div>
          </div>

          {/* Meta Title */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">Meta Title</label>
              <span className={`text-[10px] font-mono ${metaTitle.length > 60 ? 'text-[#FF6B6B]' : 'text-[#5A5A68]'}`}>{metaTitle.length}/60</span>
            </div>
            <input
              type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40"
            />
          </div>

          {/* Meta Description */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium">Meta Description</label>
              <span className={`text-[10px] font-mono ${metaDesc.length > 155 ? 'text-[#FF6B6B]' : 'text-[#5A5A68]'}`}>{metaDesc.length}/155</span>
            </div>
            <textarea
              value={metaDesc} onChange={e => setMetaDesc(e.target.value)}
              rows={3}
              className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 resize-none"
            />
          </div>

          {/* OG Image */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">OG Image</label>
            <div className="bg-[#0E0E12] border border-dashed border-[#232329] rounded-lg p-6 text-center">
              <span className="material-symbols-outlined text-[#5A5A68] mb-1 block" style={{ fontSize: 24 }}>cloud_upload</span>
              <p className="text-[11px] text-[#5A5A68]">Drop image or click to upload</p>
              <p className="text-[10px] text-[#5A5A68]/60 mt-0.5">1200×630px recommended</p>
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#E5E1E7] font-medium">Verified</p>
                <p className="text-[10px] text-[#5A5A68]">Show verified badge</p>
              </div>
              <button onClick={() => setVerified(!verified)} className={`w-10 h-5 rounded-full transition-colors relative ${verified ? 'bg-[#C0F500]' : 'bg-[#232329]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${verified ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#E5E1E7] font-medium">Featured</p>
                <p className="text-[10px] text-[#5A5A68]">Show on homepage</p>
              </div>
              <button onClick={() => setFeatured(!featured)} className={`w-10 h-5 rounded-full transition-colors relative ${featured ? 'bg-[#C0F500]' : 'bg-[#232329]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${featured ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Schema Type */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Schema Type</label>
            <select className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40">
              <option>SoftwareApplication</option>
              <option>TechArticle</option>
              <option>HowTo</option>
              <option>FAQPage</option>
            </select>
          </div>

          {/* Related Entries */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Related Entries</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['LangGraph', 'AutoGen', 'Make'].map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E1E24] text-[11px] text-[#8B8FA3]">
                  {tag}
                  <span className="cursor-pointer text-[#5A5A68] hover:text-[#FF6B6B]">×</span>
                </span>
              ))}
            </div>
            <input
              type="text" placeholder="Search entries..."
              className="w-full bg-[#0E0E12] border border-[#232329] rounded px-2 py-1 text-[11px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40"
            />
          </div>

          {/* Tags */}
          <div className="bg-[#131317] border border-[#232329] rounded-xl p-4">
            <label className="text-[11px] uppercase tracking-wider text-[#5A5A68] font-medium mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['#n8n', '#automation', '#workflows', '#self-hosted'].map(tag => (
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

          {/* Ada Assist */}
          <div className="bg-[#131317] border border-[#6C63FF]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#6C63FF]" style={{ fontSize: 16 }}>smart_toy</span>
              <label className="text-[11px] uppercase tracking-wider text-[#6C63FF] font-semibold">Ada Assist</label>
            </div>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6C63FF]/8 border border-[#6C63FF]/15 text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:border-[#6C63FF]/30 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>link</span>
                Generate draft from URL
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6C63FF]/8 border border-[#6C63FF]/15 text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:border-[#6C63FF]/30 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>search_insights</span>
                Improve SEO with Ada
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6C63FF]/8 border border-[#6C63FF]/15 text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:border-[#6C63FF]/30 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>quiz</span>
                Auto-generate FAQ
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
export const WikiManagement: React.FC = () => {
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
      return (params.get('sort') as SortField) || 'lastUpdated';
    }
    return 'lastUpdated';
  });
  const [sortDir, setSortDir] = useState<SortDir>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (params.get('order') as SortDir) || 'desc';
    }
    return 'desc';
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [editingEntry, setEditingEntry] = useState<WikiEntry | null>(null);

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
    let entries = [...WIKI_ENTRIES];
    if (search) entries = entries.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter !== 'All') entries = entries.filter(e => e.category === categoryFilter);
    if (statusFilter !== 'All') entries = entries.filter(e => e.status === statusFilter.toLowerCase());
    entries.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'category': cmp = a.category.localeCompare(b.category); break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        case 'lastUpdated': cmp = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(); break;
        case 'views': cmp = a.views - b.views; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return entries;
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
    else setSelectedIds(new Set(filtered.map(e => e.id)));
  };

  const liveCount = WIKI_ENTRIES.filter(e => e.status === 'live').length;
  const draftCount = WIKI_ENTRIES.filter(e => e.status === 'draft').length;

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="material-symbols-outlined ml-0.5 inline-block" style={{ fontSize: 14, opacity: sortField === field ? 1 : 0.3 }}>
      {sortField === field && sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="wiki" />
      <TopBar breadcrumbs={['Admin', 'Content', 'Wiki']} />

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-4 max-w-[1400px]">

          {viewMode === 'editor' && editingEntry ? (
            <WikiEditor entry={editingEntry} onBack={() => { setViewMode('table'); setEditingEntry(null); }} />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-[#E5E1E7]">Wiki Entries</h1>
                  <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">{WIKI_ENTRIES.length} entries across {CATEGORIES.length - 1} categories · {liveCount} live · {draftCount} drafts</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-[#1E1E24] border border-[#232329] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7] transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload_file</span>
                    Bulk import CSV
                  </button>
                  <button
                    onClick={() => { setEditingEntry(WIKI_ENTRIES[0]); setViewMode('editor'); }}
                    className="px-3 py-1.5 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                    New entry
                  </button>
                </div>
              </div>

              {/* Search + Filters */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-[400px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A68]" style={{ fontSize: 16 }}>search</span>
                  <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entries..."
                    className="w-full bg-[#131317] border border-[#232329] rounded-lg pl-9 pr-3 py-2 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]/40 placeholder:text-[#5A5A68]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${categoryFilter === cat ? 'bg-[#C0F500]/15 text-[#C0F500]' : 'text-[#5A5A68] hover:text-[#8B8FA3]'}`}>
                      {cat}
                    </button>
                  ))}
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
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3] w-[120px]" onClick={() => toggleSort('category')}>
                        Category <SortIcon field="category" />
                      </th>
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3] w-[80px]" onClick={() => toggleSort('status')}>
                        Status <SortIcon field="status" />
                      </th>
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3] w-[90px]" onClick={() => toggleSort('views')}>
                        Views <SortIcon field="views" />
                      </th>
                      <th className="py-2.5 px-3 text-left cursor-pointer select-none hover:text-[#8B8FA3] w-[140px]" onClick={() => toggleSort('lastUpdated')}>
                        Last Updated <SortIcon field="lastUpdated" />
                      </th>
                      <th className="py-2.5 px-3 text-right w-[200px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E24]">
                    {filtered.map((entry, idx) => (
                      <tr key={entry.id} className={`hover:bg-[#0E0E12] transition-colors ${idx % 2 === 0 ? '' : 'bg-[#0A0A0E]'}`}>
                        <td className="py-2.5 px-3">
                          <input type="checkbox" checked={selectedIds.has(entry.id)} onChange={() => toggleSelect(entry.id)}
                            className="w-3.5 h-3.5 rounded border-[#232329] bg-[#0E0E12] text-[#C0F500] focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-[#E5E1E7]">{entry.title}</span>
                            {entry.verified && <span className="material-symbols-outlined text-[#00DAF3]" style={{ fontSize: 14 }}>verified</span>}
                            {entry.featured && <span className="material-symbols-outlined text-[#F5A623]" style={{ fontSize: 14 }}>star</span>}
                          </div>
                          <span className="text-[10px] font-mono text-[#5A5A68]">/wiki/{entry.category.toLowerCase()}/{entry.slug}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[12px] text-[#8B8FA3]">{entry.category}</td>
                        <td className="py-2.5 px-3">
                          <span className="flex items-center gap-1.5 text-[12px]">
                            <span className={`w-1.5 h-1.5 rounded-full ${entry.status === 'live' ? 'bg-[#C0F500]' : entry.status === 'draft' ? 'bg-[#5A5A68]' : 'bg-[#FF6B6B]'}`} />
                            <span className={entry.status === 'live' ? 'text-[#C0F500]' : 'text-[#5A5A68]'}>{entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[12px] font-mono text-[#8B8FA3]">{entry.views > 0 ? entry.views.toLocaleString() : '—'}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[12px] text-[#8B8FA3]">{formatDate(entry.lastUpdated)}</span>
                          <span className="text-[10px] font-mono text-[#5A5A68] ml-1">{formatTime(entry.lastUpdated)}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { setEditingEntry(entry); setViewMode('editor'); }}
                              className="px-2 py-1 rounded text-[11px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#1E1E24] transition-colors">Edit</button>
                            <button className="px-2 py-1 rounded text-[11px] text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#1E1E24] transition-colors">Preview</button>
                            <button className="px-2 py-1 rounded text-[11px] text-[#F5A623] hover:text-[#F5C977] hover:bg-[#1E1E24] transition-colors">
                              {entry.status === 'live' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button className="px-2 py-1 rounded text-[11px] text-[#FF6B6B] hover:text-[#FF9B9B] hover:bg-[#1E1E24] transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="flex items-center justify-between text-[11px] text-[#5A5A68] font-mono">
                <span>Showing {filtered.length} of {WIKI_ENTRIES.length} entries</span>
                <span>Sort: {sortField} {sortDir}</span>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
