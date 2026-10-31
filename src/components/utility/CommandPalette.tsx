import React, { useState, useEffect, useRef } from 'react';

export interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen: propIsOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync propIsOpen with internal state if controlled externally
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  // Global Keyboard Listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const trendingItems = [
    { title: 'n8n Stripe drip workflow', type: 'search', url: '/search?q=n8n+stripe+drip' },
    { title: 'Claude 3.7 Sonnet prompt engineering', type: 'search', url: '/search?q=claude+3.7+prompt' },
    { title: 'Model Context Protocol specification', type: 'search', url: '/search?q=mcp+protocol' },
    { title: 'Autonomous Dev OS Docker setup', type: 'search', url: '/search?q=autonomous+dev+os' },
  ];

  const quickNavItems = [
    { title: '📚 Wiki Encyclopedia', url: '/wiki' },
    { title: '🛒 Marketplace', url: '/marketplace' },
    { title: '📰 News & Launches', url: '/news' },
    { title: '🎓 Academy Courses', url: '/academy' },
    { title: '🔍 SEO & AEO Tools', url: '/seo-tools' },
    { title: '💬 Community Forum', url: '/community/forum' },
    { title: '🏆 Builder Leaderboard', url: '/community/leaderboard' },
  ];

  const searchableItems = [
    { title: 'n8n Workflow Framework (Wiki)', type: 'wiki', url: '/wiki/frameworks/n8n' },
    { title: 'Claude 3.7 Sonnet (Model)', type: 'wiki', url: '/wiki/models/claude-3-7-sonnet' },
    { title: 'Model Context Protocol (Protocol)', type: 'wiki', url: '/wiki/protocols/model-context-protocol' },
    { title: 'Autonomous Dev OS (Marketplace)', type: 'marketplace', url: '/marketplace/ai-os/autonomous-dev-os' },
    { title: 'Inbox Triage Agent (Marketplace)', type: 'marketplace', url: '/marketplace/agents/inbox-triage-agent' },
    { title: 'n8n Stripe Drip Workflow (Marketplace)', type: 'marketplace', url: '/marketplace/workflows/n8n-stripe-drip-workflow' },
    { title: 'Claude Prompt Engineer (Marketplace)', type: 'marketplace', url: '/marketplace/prompts/claude-prompt-engineer' },
    { title: 'Ada Lovelace (@ada_lovelace)', type: 'profile', url: '/profile/ada_lovelace' },
    { title: 'Linus Torvalds (@linustech)', type: 'profile', url: '/profile/linustech' },
  ];

  // Dynamic Live Results filtering after 2+ characters
  let activeList: Array<{ title: string; url: string; isAda?: boolean }> = [];

  if (query.trim().length >= 2) {
    const qLower = query.trim().toLowerCase();
    const filtered = searchableItems.filter((i) => i.title.toLowerCase().includes(qLower));

    activeList = [
      { title: `⚡ → Ask Ada AI Assistant: "${query.trim()}"`, url: `/search?q=${encodeURIComponent(query.trim())}`, isAda: true },
      ...filtered,
    ];
  } else {
    activeList = [
      ...trendingItems.map((i) => ({ title: `🔥 ${i.title}`, url: i.url })),
      ...quickNavItems.map((i) => ({ title: i.title, url: i.url })),
    ];
  }

  // Keyboard navigation within activeList
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % activeList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeList[selectedIndex]) {
        window.location.href = activeList[selectedIndex].url;
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#0a0a0f]/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#131317] border border-white/20 rounded-2xl max-w-[580px] w-full shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150"
      >
        {/* Input Header */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 bg-[#0e0e12]">
          <span className="text-[#9ca3af] text-lg mr-3">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command or search query..."
            className="w-full bg-transparent font-mono text-base text-white focus:outline-none placeholder-[#9ca3af]"
          />
          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold text-[#9ca3af] bg-[#1f1f23] border border-white/10 shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-4">
          {query.trim().length < 2 ? (
            <>
              {/* Section 1: Trending Searches */}
              <div className="space-y-1">
                <div className="px-3 text-[11px] font-mono uppercase font-bold text-[#9ca3af] mb-2">
                  Trending Searches
                </div>
                {trendingItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <a
                      key={idx}
                      href={item.url}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#c0f500] text-[#161f00] font-bold' : 'text-white hover:bg-[#1f1f23]'
                      }`}
                    >
                      <span>🔥 {item.title}</span>
                      <span className="text-[10px] opacity-75">Search →</span>
                    </a>
                  );
                })}
              </div>

              {/* Section 2: Quick Navigate */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                <div className="px-3 text-[11px] font-mono uppercase font-bold text-[#9ca3af] mb-2">
                  Quick Navigate
                </div>
                {quickNavItems.map((item, idx) => {
                  const actualIdx = trendingItems.length + idx;
                  const isSelected = selectedIndex === actualIdx;
                  return (
                    <a
                      key={idx}
                      href={item.url}
                      onMouseEnter={() => setSelectedIndex(actualIdx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#c0f500] text-[#161f00] font-bold' : 'text-white hover:bg-[#1f1f23]'
                      }`}
                    >
                      <span>{item.title}</span>
                      <span className="text-[10px] opacity-75">Go →</span>
                    </a>
                  );
                })}
              </div>
            </>
          ) : (
            /* Live Filtered Results (2+ chars) */
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-mono uppercase font-bold text-[#9ca3af] mb-2">
                Matching Results ({activeList.length})
              </div>
              {activeList.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <a
                    key={idx}
                    href={item.url}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? item.isAda
                          ? 'bg-[#00e3fd] text-[#002830] font-bold'
                          : 'bg-[#c0f500] text-[#161f00] font-bold'
                        : item.isAda
                        ? 'bg-[#00e3fd]/10 text-[#00e3fd] border border-[#00e3fd]/30'
                        : 'text-white hover:bg-[#1f1f23]'
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className="text-[10px] opacity-75">↵ Select</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Pills Legend */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#0e0e12] flex items-center justify-between font-mono text-[11px] text-[#9ca3af]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#1f1f23] text-white border border-white/10">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#1f1f23] text-white border border-white/10">↓</kbd>
              <span>Navigate</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#1f1f23] text-white border border-white/10">↵</kbd>
              <span>Open</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#1f1f23] text-[#c0f500] border border-white/10 font-bold">⌘K</kbd>
            <span>anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
