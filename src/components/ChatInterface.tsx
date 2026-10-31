// src/components/ChatInterface.tsx — Minimax AI Chat Interface
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
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

      // Handle SSE streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
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
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error communicating with Minimax AI. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto bg-[#131317] rounded-2xl shadow-2xl border border-[#232329] overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#232329] bg-[#0E0E12]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C0F500] text-black font-mono font-bold flex items-center justify-center text-sm shadow">
            AI
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-[#E5E1E7]">WikiOfAutomation Assistant</h3>
            <p className="text-[11px] text-[#8B8FA3] font-mono">Powered by Minimax M3 & RAG Vector Engine</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#C0F500]/10 text-[#C0F500] border border-[#C0F500]/20">
          Live Streaming
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-[#8B8FA3] mt-24 space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#C0F500]">smart_toy</span>
            <p className="text-base font-medium font-mono text-white">How can I help you today?</p>
            <p className="text-xs max-w-sm mx-auto">
              Ask about n8n workflows, Claude MCP tools, AutoNode integrations, or platform features.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-sans ${
                msg.role === 'user'
                  ? 'bg-[#C0F500] text-black font-semibold shadow-md'
                  : 'bg-[#1E1E24] text-[#E5E1E7] border border-[#232329] shadow'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-[#1E1E24] border border-[#232329] rounded-2xl px-4 py-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-[#C0F500] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#C0F500] rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-[#C0F500] rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#232329] bg-[#0E0E12]/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about our workflows, agents, or AutoNode licenses..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#1E1E24] border border-[#232329] text-white text-xs font-mono focus:outline-none focus:border-[#C0F500] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-[#C0F500] hover:bg-[#a8d700] text-black font-mono font-bold text-xs rounded-xl disabled:opacity-50 transition-all flex items-center gap-1 shadow-md"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
