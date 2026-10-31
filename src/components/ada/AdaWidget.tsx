import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EmbeddedCard {
  title: string;
  type: string;
  rating?: number;
  price?: string;
  url: string;
  icon: string;
  badge?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ada';
  text: string;
  timestamp: string;
  mode?: 'lookup' | 'discovery' | 'comparison' | 'navigation' | 'seo' | 'course';
  cards?: EmbeddedCard[];
  codeSnippet?: string;
  tableData?: { headers: string[]; rows: string[][] };
}

const ADA_SYSTEM_PROMPT_CLIENT = `
You are **Ada** — the AI brain behind "Wiki of Automation" (wikiofautomation.com), the living encyclopedia of the automation economy.

## Your Personality
You're sharp, witty, and genuinely passionate about automation. You're opinionated (in a helpful way), you use analogies to make complex things click, and you never give a boring answer when an interesting one exists.

## How You Answer
1. **Lead with insight, not definitions.** Don't start with "X is a Y." Start with why it matters or what it unlocks.
2. **Use rich formatting:**
   - **Bold** for key terms and product names
   - Markdown tables for comparisons (e.g. | Aspect | Tool A | Tool B |)
   - Bullet lists for features, pros/cons, or step-by-step
   - Emoji sparingly for visual anchors (⚡ for agents, 🔄 for workflows, 📚 for wiki, 🆚 for comparisons)
3. **Be conversational.** Use contractions, ask follow-up questions, suggest next steps.
4. **Answer the actual question.** If asked to compare LangGraph vs AutoGen, compare *those two*.
5. **Handle greetings warmly.** Introduce yourself with personality when asked who you are.
6. **Language:** Reply in English default, or in বাংলা if asked in Bengali, or in हिंदी if asked in Hindi.
`.trim();

async function callMinimaxDirect(query: string, contextHistory?: string): Promise<{ reply: string; links: { url: string; anchor: string }[] }> {
  const apiKey = import.meta.env.PUBLIC_MINIMAX_API_KEY || 'sk-cp-9_VnYYpS_2tAbRPFfwhm9D2QCVpSvWQGzrE6LkmjgWeCntsT9B_0JzUMDVTIjrxRB-9blk1ZL9SVYW8uDXi8uydEvCLZNVn2B08rEBPkR6l-95ii7hW4jWQ';
  const baseUrl = import.meta.env.PUBLIC_MINIMAX_BASE_URL || 'https://api.minimax.io/v1';
  const model = import.meta.env.PUBLIC_MINIMAX_MODEL || 'MiniMax-M3';

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const userContent = contextHistory
    ? `Previous Conversation:\n${contextHistory}\n\nUser Question: ${query}`
    : `User Question: ${query}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: 1200,
      messages: [
        { role: 'system', content: ADA_SYSTEM_PROMPT_CLIENT },
        { role: 'user', content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Minimax API HTTP ${res.status}`);
  }

  const data = await res.json();
  let content = data.choices?.[0]?.message?.content || 'No response generated.';

  // Strip CoT reasoning tags
  content = content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<details>[\s\S]*?<\/details>/gi, '')
    .replace(/详细思考[\s\S]*?(?=\n\n|\n[A-Z#])/gi, '')
    .trim();

  const links = [
    { url: '/wiki', anchor: 'Encyclopedia' },
    { url: '/marketplace', anchor: 'Marketplace' },
    { url: '/news', anchor: 'Automation News' },
  ];

  return { reply: content, links };
}

// Markdown → HTML renderer with table, heading, code block, and list support
function renderMarkdown(text: string): string {
  if (!text) return '';

  let html = text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<details>[\s\S]*?<\/details>/gi, '')
    .trim();

  // Code blocks ```
  html = html.replace(/```(?:[a-z]+)?\n([\s\S]*?)\n```/gi, (_, code) => {
    return `<div style="background:#0e0e12;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;font-family:monospace;font-size:11px;color:#00e3fd;overflow-x:auto;margin:8px 0;"><pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></div>`;
  });

  // Headings
  html = html
    .replace(/^### (.*$)/gim, '<h4 style="font-size:12.5px;font-weight:700;color:#c0f500;margin:10px 0 4px 0;">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="font-size:13.5px;font-weight:700;color:#fff;margin:12px 0 6px 0;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:4px;">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 style="font-size:14.5px;font-weight:700;color:#c0f500;margin:14px 0 6px 0;">$1</h2>');

  // Tables
  html = html.replace(/((?:\|[^\n]+\|\n?)+)/g, (tableMatch) => {
    const lines = tableMatch.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) return tableMatch;

    const headers = lines[0].split('|').map(c => c.trim()).filter(c => c.length > 0);
    const dataRows = lines.slice(2).map(line => line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length));

    if (headers.length === 0) return tableMatch;

    let tableHtml = `<div style="overflow-x:auto;margin:10px 0;border:1px solid rgba(255,255,255,0.12);border-radius:8px;"><table style="width:100%;border-collapse:collapse;font-size:11px;font-family:sans-serif;">`;
    tableHtml += `<thead style="background:#1f1f23;color:#c0f500;"><tr>`;
    headers.forEach(h => {
      tableHtml += `<th style="padding:6px 10px;border-bottom:1px solid rgba(255,255,255,0.1);text-align:left;">${h}</th>`;
    });
    tableHtml += `</tr></thead><tbody>`;

    dataRows.forEach((row, rIdx) => {
      const bg = rIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)';
      tableHtml += `<tr style="background:${bg};">`;
      row.forEach(cell => {
        tableHtml += `<td style="padding:6px 10px;border-bottom:1px solid rgba(255,255,255,0.05);color:#d1d5db;">${cell}</td>`;
      });
      tableHtml += `</tr>`;
    });
    tableHtml += `</tbody></table></div>`;
    return tableHtml;
  });

  // Formatting
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff;font-weight:600;">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#9ca3af;">$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(192,245,0,0.12);color:#c0f500;padding:1px 5px;border-radius:4px;font-size:11px;font-family:monospace;">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#00e3fd;text-decoration:underline;" target="_blank">$1</a>');

  // Lists & line breaks
  if (!html.includes('<table') && !html.includes('<pre')) {
    html = html.replace(/\n/g, '<br/>');
  }

  return html;
}

export const AdaWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(342);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pulse ring color
  let pulseBorder = 'rgba(108,99,255,0.4)';
  if (onlineCount <= 100) pulseBorder = 'rgba(0,212,170,0.4)';
  else if (onlineCount > 500) pulseBorder = 'rgba(245,166,35,0.4)';

  // Context-aware welcome message
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;

    let welcomeText = "Hey! I'm Ada, the AI brain behind Wiki of Automation. I've indexed over 14,000 tools, agents, and workflows. Ask me anything — from \"What's the best free email triage agent?\" to \"Explain MCP like I'm five.\" 🤖";

    if (path.startsWith('/wiki/')) {
      const topicName = path.split('/').pop()?.replace(/-/g, ' ') || 'this topic';
      welcomeText = `You're reading about **${topicName}**. Ask me anything — how it works, how it compares to alternatives, or where to find templates that use it. ⚡`;
    } else if (path.startsWith('/marketplace/')) {
      welcomeText = "Browsing the marketplace? I can compare this tool to alternatives, check pricing, or find similar agents. What do you need? 🛒";
    } else if (path.startsWith('/news/')) {
      welcomeText = "Reading the newsroom! Want me to explain any tool mentioned here, find it in the wiki, or suggest related workflows? 📰";
    } else if (path.startsWith('/compare/')) {
      welcomeText = "Side-by-side comparison mode! Ask me to dig deeper into pricing, self-hosting, AI capabilities, or community size. 🆚";
    }

    setMessages([{
      id: 'msg-welcome',
      sender: 'ada',
      text: welcomeText,
      timestamp: getCurrentTime(),
    }]);

    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ─── REAL API CALL to /api/ada with Direct Live Minimax Fallback ──────
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    const conversationHistory = [...messages.filter((m) => m.sender !== 'ada' || m.id !== 'msg-welcome'), userMsg]
      .slice(-6)
      .map((m) => `${m.sender === 'user' ? 'User' : 'Ada'}: ${m.text}`)
      .join('\n');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);

      const res = await fetch('/api/ada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: conversationHistory,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const adaMsg = buildAdaMessage(data, query);
        setMessages((prev) => [...prev, adaMsg]);
      } else {
        // Server endpoint 404/500 → Call Minimax M3 directly from browser
        const directRes = await callMinimaxDirect(query, conversationHistory);
        const adaMsg: ChatMessage = {
          id: `ada-${Date.now()}`,
          sender: 'ada',
          text: directRes.reply,
          timestamp: getCurrentTime(),
          cards: directRes.links.map(l => ({ title: l.anchor, type: 'Wiki', url: l.url, icon: '📚' })),
        };
        setMessages((prev) => [...prev, adaMsg]);
      }
    } catch (err) {
      try {
        // Network error or timeout → Call Minimax M3 directly from browser
        const directRes = await callMinimaxDirect(query, conversationHistory);
        const adaMsg: ChatMessage = {
          id: `ada-${Date.now()}`,
          sender: 'ada',
          text: directRes.reply,
          timestamp: getCurrentTime(),
          cards: directRes.links.map(l => ({ title: l.anchor, type: 'Wiki', url: l.url, icon: '📚' })),
        };
        setMessages((prev) => [...prev, adaMsg]);
      } catch (directErr) {
        const fallbackMsg = buildFallbackMessage(query);
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Build a ChatMessage from the real API response
  function buildAdaMessage(data: any, query: string): ChatMessage {
    const time = getCurrentTime();
    const intent = data.intent || 'general';
    const reply = data.reply || "I couldn't find a good answer for that. Try rephrasing your question!";

    // Map API links to cards
    const links = data.links || [];
    const cards: EmbeddedCard[] = links
      .filter((l: any) => l.url && l.anchor)
      .slice(0, 4)
      .map((l: any) => ({
        title: l.anchor,
        type: l.source || 'Link',
        url: l.url.startsWith('/') ? l.url : `/${l.url}`,
        icon: l.source?.includes('marketplace') ? '⚡' : l.source?.includes('news') ? '📰' : '📚',
      }));

    // Detect mode from intent
    let mode: ChatMessage['mode'] = 'lookup';
    if (intent === 'marketplace') mode = 'discovery';
    else if (intent === 'news') mode = 'lookup';
    else if (intent === 'wiki') mode = 'lookup';

    return {
      id: `ada-${Date.now()}`,
      sender: 'ada',
      text: reply,
      timestamp: time,
      mode,
      cards: cards.length > 0 ? cards : undefined,
    };
  }

  // Emergency fallback when API is unreachable
  function buildFallbackMessage(query: string): ChatMessage {
    const time = getCurrentTime();
    const qLower = query.toLowerCase();

    // Multilingual
    if (/[\u0980-\u09FF]/.test(query)) {
      return {
        id: `ada-${Date.now()}`,
        sender: 'ada',
        text: 'হ্যালো! আমি Ada — Wiki of Automation-এর AI অ্যাসিস্ট্যান্ট। দুঃখিত, এই মুহূর্তে আমার AI ব্যাকএন্ড সাড়া দিচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন, অথবা সরাসরি উইকি ব্রাউজ করুন! 🤖',
        timestamp: time,
        cards: [{ title: 'Browse Wiki', type: 'Navigation', url: '/wiki', icon: '📚' }],
      };
    }

    if (/[\u0900-\u097F]/.test(query)) {
      return {
        id: `ada-${Date.now()}`,
        sender: 'ada',
        text: 'नमस्ते! मैं Ada हूँ। इस समय मेरा AI बैकएंड जवाब नहीं दे रहा। कृपया कुछ देर बाद पुनः प्रयास करें या सीधे विकी ब्राउज़ करें! 🤖',
        timestamp: time,
        cards: [{ title: 'Browse Wiki', type: 'Navigation', url: '/wiki', icon: '📚' }],
      };
    }

    // English fallback with helpful direction
    let text = "Hmm, I'm having trouble connecting to my AI backend right now. But I can point you in the right direction:";
    const cards: EmbeddedCard[] = [];

    if (/agent|bot|autonomous/i.test(qLower)) {
      text = "My AI backend is a bit slow right now, but for agents, check out our marketplace — we've got some great picks:";
      cards.push({ title: 'Browse AI Agents', type: 'Marketplace', url: '/marketplace/agents', icon: '⚡', badge: 'BROWSE' });
    } else if (/workflow|n8n|zapier|make/i.test(qLower)) {
      text = "Can't reach my brain right now 😅 but for workflows, head to our marketplace:";
      cards.push({ title: 'Browse Workflows', type: 'Marketplace', url: '/marketplace/workflows', icon: '🔄', badge: 'BROWSE' });
    } else if (/compare|vs/i.test(qLower)) {
      text = "My AI is loading — meanwhile, check out our side-by-side comparison pages:";
      cards.push({ title: 'Tool Comparisons', type: 'Wiki', url: '/wiki/compare', icon: '🆚' });
    } else if (/mcp|protocol/i.test(qLower)) {
      cards.push({ title: 'MCP Protocol Guide', type: 'Wiki Entry', url: '/wiki/protocols/model-context-protocol', icon: '📚' });
    } else if (/hi|hello|hey|who/i.test(qLower)) {
      text = "Hey! I'm Ada, the AI brain behind Wiki of Automation. My backend is a bit slow right now, but I'll be back shortly! Meanwhile, explore:";
      cards.push(
        { title: 'Encyclopedia', type: 'Wiki', url: '/wiki', icon: '📚' },
        { title: 'Marketplace', type: 'Store', url: '/marketplace', icon: '🛒' },
      );
    } else {
      cards.push(
        { title: 'Search Encyclopedia', type: 'Wiki', url: '/wiki', icon: '📚' },
        { title: 'Automation Marketplace', type: 'Store', url: '/marketplace', icon: '🛒' },
        { title: 'Today\'s News', type: 'News', url: '/news', icon: '📰' },
      );
    }

    return {
      id: `ada-${Date.now()}`,
      sender: 'ada',
      text,
      timestamp: time,
      cards: cards.length > 0 ? cards : undefined,
    };
  }

  const quickPills = [
    { label: '🛰 Find an agent', query: 'Find an AI agent for email triage' },
    { label: '📚 Explain a concept', query: 'Explain Model Context Protocol MCP' },
    { label: '⚡ Get a workflow', query: 'Get n8n Stripe webhook workflow' },
    { label: '📊 Compare tools', query: 'Compare n8n vs Make' },
    { label: '🔍 SEO audit help', query: 'Generate JSON-LD Schema snippet' },
  ];

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 font-sans">
      <AnimatePresence>
        {/* STATE 1: COLLAPSED CIRCLE BUTTON */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block px-3 py-1 bg-[#1f1f23] border border-white/10 rounded-lg text-[11px] font-mono text-[#9ca3af] whitespace-nowrap shadow-xl">
              Ask Ada AI Brain
            </div>
            <button
              onClick={() => setIsOpen(true)}
              style={{ borderColor: pulseBorder, animation: 'adaPulseRing 2.4s ease-out infinite' }}
              className="w-14 h-14 rounded-full bg-[#131317] border border-white/20 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200 relative overflow-hidden"
              aria-label="Open Ada AI Assistant"
            >
              <div className="w-10 h-10 rounded-full bg-[#c0f500]/10 border border-[#c0f500]/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(192,245,0,0.3)]">
                🤖
              </div>
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#00e3fd] border-2 border-[#131317] shadow-[0_0_8px_#00e3fd]"></div>
            </button>
          </motion.div>
        )}

        {/* STATE 2: EXPANDED FLOATING PANEL */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 md:static md:w-[380px] md:max-h-[560px] h-full md:h-[560px] bg-[#131317] border border-white/20 rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="h-12 bg-[#1f1f23] border-b border-white/10 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <button onClick={() => setIsOpen(false)} className="md:hidden text-white text-lg mr-1">←</button>
                <div className="w-7 h-7 rounded-full bg-[#c0f500]/20 border border-[#c0f500]/40 flex items-center justify-center text-sm">🤖</div>
                <div>
                  <div className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
                    ADA <span className="text-[10px] font-normal text-[#c0f500]">AI BRAIN</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#9ca3af] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e3fd] animate-pulse"></span>
                    <span>{onlineCount} builders online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer text-sm font-bold">✕</button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex flex-col group ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3.5 leading-relaxed font-sans ${
                      isUser
                        ? 'bg-[#1f1f23] text-white rounded-2xl rounded-br-sm border border-white/10 shadow-md'
                        : 'bg-transparent text-gray-200'
                    }`}>
                      {isUser ? (
                        msg.text
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                      )}

                      {/* Embedded Cards */}
                      {msg.cards && (
                        <div className="mt-3 space-y-2">
                          {msg.cards.map((card, cIdx) => (
                            <a key={cIdx} href={card.url} className="block p-3 bg-[#1f1f23] hover:border-[#c0f500] border border-white/10 rounded-xl space-y-1 transition-all group/card shadow-md">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase text-[#00e3fd] font-bold">{card.type}</span>
                                {card.badge && <span className="px-1.5 py-0.5 rounded bg-[#c0f500]/20 text-[#c0f500] font-mono text-[9px] font-bold">{card.badge}</span>}
                              </div>
                              <div className="font-bold text-white group-hover/card:text-[#c0f500] flex items-center gap-1.5">
                                <span>{card.icon}</span>
                                <span>{card.title}</span>
                              </div>
                              {card.price && (
                                <div className="flex items-center justify-between text-[10px] font-mono text-[#9ca3af] pt-1">
                                  <span>★ {card.rating || 4.9}</span>
                                  <span className="text-[#c0f500] font-bold">{card.price}</span>
                                </div>
                              )}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Code Snippet */}
                      {msg.codeSnippet && (
                        <div className="mt-3 p-3 bg-[#0e0e12] border border-white/10 rounded-xl font-mono text-[11px] text-[#00e3fd] overflow-x-auto">
                          <pre>{msg.codeSnippet}</pre>
                        </div>
                      )}

                      {/* Comparison Table */}
                      {msg.tableData && (
                        <div className="mt-3 border border-white/10 rounded-xl overflow-hidden font-mono text-[11px]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#0e0e12] text-[#9ca3af]">
                                {msg.tableData.headers.map((h, hIdx) => (
                                  <th key={hIdx} className="p-2 border-b border-white/10">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {msg.tableData.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-white/5">
                                  {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="p-2 text-white">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#9ca3af] opacity-0 group-hover:opacity-100 transition-opacity mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 text-[#9ca3af] font-mono text-xs">
                  <span>Ada is searching the wiki</span>
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Pills */}
            <div className="px-4 py-2 bg-[#0e0e12] border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {quickPills.map((pill, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(pill.query)}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-full bg-[#1f1f23] hover:bg-[#c0f500] text-white hover:text-[#161f00] font-mono text-[11px] whitespace-nowrap border border-white/10 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-[#1f1f23] border-t border-white/10 shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Ada anything about WOA..."
                  disabled={isTyping}
                  className="flex-1 h-10 bg-[#131317] border border-white/10 focus:border-[#c0f500] rounded-xl px-3.5 font-mono text-xs text-white focus:outline-none placeholder-[#9ca3af] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="w-10 h-10 rounded-xl bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold flex items-center justify-center text-sm shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  ➔
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes adaPulseRing {
          0% { box-shadow: 0 0 0 0 ${pulseBorder}; }
          70% { box-shadow: 0 0 0 14px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
