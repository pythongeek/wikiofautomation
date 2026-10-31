import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantMessage,
                };
                return newMessages;
              });
            } catch {
              // ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            '⚠️ Sorry, I encountered an error connecting to the knowledge base. Please check that the Minimax API key is configured and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /** Render message content with basic markdown link support */
  const renderContent = (content: string) => {
    // Convert markdown links [text](url) to clickable anchors
    const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00DAF3] hover:text-[#6C63FF] underline underline-offset-2 transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }
      // Convert **bold** markers
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bp, j) => {
        const boldMatch = bp.match(/^\*\*(.+)\*\*$/);
        if (boldMatch) {
          return (
            <strong key={`${i}-${j}`} className="font-semibold text-[#E5E1E7]">
              {boldMatch[1]}
            </strong>
          );
        }
        return <span key={`${i}-${j}`}>{bp}</span>;
      });
    });
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-[#131317] rounded-2xl border border-[#232329] shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 bg-[#1B1B1F] border-b border-[#232329] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 flex items-center justify-center text-[#9B93FF]">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>smart_toy</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#E5E1E7]">Ada AI — Live RAG Assistant</h3>
            <span className="text-[10px] font-mono text-[#00DAF3] block">
              Minimax M3 · Wiki + Marketplace + News RAG
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
          <span className="text-[10px] text-[#8B8FA3]">Live</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
        {messages.length === 0 && (
          <div className="text-center text-[#5A5A68] mt-16 space-y-3">
            <span className="material-symbols-outlined text-[#6C63FF]" style={{ fontSize: 40 }}>auto_awesome</span>
            <p className="text-base font-medium text-[#E5E1E7]">How can Ada assist your workflow today?</p>
            <p className="text-xs text-[#8B8FA3]">
              Ask about n8n nodes, MCP protocols, LangGraph agents, marketplace tools, or pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['What is n8n?', 'Compare LangGraph vs AutoGen', 'Show marketplace agents'].map(q => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                  }}
                  className="px-3 py-1.5 text-[11px] rounded-lg bg-[#1E1E24] border border-[#232329] text-[#8B8FA3] hover:text-[#E5E1E7] hover:border-[#6C63FF]/40 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[#1E1E24] text-[#E5E1E7] border border-[#232329]'
                  : 'bg-[#6C63FF]/10 text-[#E5E1E7] border border-[#6C63FF]/20'
              }`}
            >
              <span className="text-[10px] text-[#5A5A68] block mb-1">
                {msg.role === 'user' ? 'You' : '🤖 Ada AI'}
              </span>
              <div className="whitespace-pre-wrap font-sans leading-relaxed">
                {renderContent(msg.content)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-[#6C63FF]/10 border border-[#6C63FF]/20 rounded-2xl px-4 py-3">
              <span className="text-[10px] text-[#5A5A68] block mb-1">🤖 Ada AI</span>
              <div className="flex space-x-1.5 items-center">
                <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-[#5A5A68] ml-2">Searching knowledge base...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-[#0E0E12] border-t border-[#232329]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about n8n, MCP, marketplace tools, or anything on the wiki..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#131317] border border-[#232329] text-[13px] text-[#E5E1E7] placeholder-[#5A5A68] focus:outline-none focus:border-[#6C63FF] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#6C63FF] text-white font-semibold rounded-xl hover:bg-[#5B52E0] disabled:opacity-50 text-[13px] transition-colors"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
        <p className="text-[9px] text-[#3A3A48] mt-2 text-center">
          Powered by Minimax M3 · RAG over {5} wiki entries, {8} marketplace listings, {6} news articles
        </p>
      </form>
    </div>
  );
};
