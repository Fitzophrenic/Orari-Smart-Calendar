import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from './Button';

const initialMessages = [
  {
    id: '1',
    role: 'assistant',
    text: "Hi — I'm Orari AI. Ask me to summarize your week, find gaps for study time, or reschedule conflicts.",
  },
];

export default function AiChatPanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { id: String(Date.now()), role: 'user', text: trimmed };
    const reply = {
      id: String(Date.now() + 1),
      role: 'assistant',
      text: 'This is a UI preview. Connect your model API here to enable real scheduling assistance.',
    };
    setMessages((m) => [...m, userMsg, reply]);
    setInput('');
  };

  return (
    <aside className="sticky top-0 flex h-screen w-full max-w-[360px] flex-col border-l border-orari-border bg-orari-surface">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orari-border px-6">
        <Sparkles className="h-5 w-5 text-orari-primary" />
        <h2 className="font-semibold text-orari-text-primary">Orari AI</h2>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === 'user'
                ? 'ml-6 rounded-xl rounded-br-sm bg-orari-primary-light px-4 py-3 text-[15px] text-orari-text-primary'
                : 'mr-4 rounded-xl rounded-bl-sm border border-orari-border bg-orari-background px-4 py-3 text-[15px] text-orari-text-primary'
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <footer className="shrink-0 border-t border-orari-border p-5">
        <div className="mb-3">
          <label className="mb-2 block text-[13px] text-orari-text-secondary" htmlFor="orari-ai-input">
            Message
          </label>
          <textarea
            id="orari-ai-input"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your schedule…"
            className="w-full resize-none rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary placeholder:text-orari-text-disabled focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
            style={{ borderRadius: 'var(--radius-input)' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
        </div>
        <Button type="button" variant="primary" size="md" className="w-full gap-2" onClick={send}>
          <Send className="h-4 w-4" />
          Send
        </Button>
      </footer>
    </aside>
  );
}
