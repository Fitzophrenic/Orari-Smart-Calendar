import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from './Button';
import { useAppData } from '../../context/AppDataContext';

const INITIAL_MESSAGES = [
  {
    id: '1',
    role: 'assistant',
    text: "Hi — I'm Orari AI. Ask me to summarize your week, find gaps for study time, or reschedule conflicts.",
  },
];


function MarkdownText({ text }) {
  const lines = text.split('\n');

  const renderInline = (str) => {
    // Split on **bold** and *italic* markers
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const elements = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="mt-1 mb-1 space-y-0.5 pl-4">
        {bulletBuffer.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orari-primary" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Bullet line: starts with - or •
    if (/^[-•]\s+/.test(trimmed)) {
      bulletBuffer.push(trimmed.replace(/^[-•]\s+/, ''));
      return;
    }

    // Non-bullet: flush any pending bullets first
    flushBullets();

    if (trimmed === '') {
      // Empty line → small spacer (skip if last)
      if (i < lines.length - 1) {
        elements.push(<div key={`sp-${i}`} className="h-1" />);
      }
    } else {
      elements.push(
        <p key={`p-${i}`} className="leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushBullets(); // flush any trailing bullets

  return <div className="space-y-1 text-[15px]">{elements}</div>;
}


export default function AiChatPanel() {
  const { events, calendars } = useAppData();

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: String(Date.now()), role: 'user', text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    const history = [...messages, userMsg]
      .filter((m) => m.id !== '1')
      .map((m) => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, events, calendars }),
      });

      const data = await res.json();
      const replyText = data?.reply || "Sorry, I couldn't process that. Please try again.";

      setMessages((m) => [
        ...m,
        { id: String(Date.now() + 1), role: 'assistant', text: replyText },
      ]);
    } catch (err) {
      console.error('Orari AI error:', err);
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          text: 'Something went wrong connecting to Orari AI. Make sure the backend is running on port 5000.',
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <aside className="sticky top-0 flex h-screen w-full max-w-[360px] flex-col border-l border-orari-border bg-orari-surface">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orari-border px-6">
        <Sparkles className="h-5 w-5 text-orari-primary" />
        <h2 className="font-semibold text-orari-text-primary">Orari AI</h2>
      </header>

      {/* Message thread */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === 'user'
                ? 'ml-6 rounded-xl rounded-br-sm bg-orari-primary-light px-4 py-3 text-orari-text-primary'
                : 'mr-4 rounded-xl rounded-bl-sm border border-orari-border bg-orari-background px-4 py-3 text-orari-text-primary'
            }
          >
            {m.role === 'assistant' ? (
              <MarkdownText text={m.text} />
            ) : (
              <p className="text-[15px] leading-relaxed">{m.text}</p>
            )}
          </div>
        ))}

        {loading && (
          <div className="mr-4 rounded-xl rounded-bl-sm border border-orari-border bg-orari-background px-4 py-3 text-[15px] text-orari-text-secondary italic">
            Orari is thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <footer className="shrink-0 border-t border-orari-border p-5">
        <div className="mb-3">
          <label
            className="mb-2 block text-[13px] text-orari-text-secondary"
            htmlFor="orari-ai-input"
          >
            Message
          </label>
          <textarea
            id="orari-ai-input"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your schedule…"
            className="w-full resize-none rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary placeholder:text-orari-text-disabled focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
          />
        </div>
        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full gap-2"
          onClick={send}
          disabled={loading || !input.trim()}
        >
          <Send className="h-4 w-4" />
          {loading ? 'Sending…' : 'Send'}
        </Button>
      </footer>
    </aside>
  );
}