import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "../components/orari/Button";
import Logo from "../components/orari/Logo";
import { useAppData } from "../context/AppDataContext";

const QUOTES = [
  "Small progress is still progress.",
  "Focus on what moves the needle.",
  "Consistency beats intensity.",
  "You don't need more time, just more focus.",
  "Win the morning, win the day.",
];

const PRODUCTIVITY = [
  { day: "Mon", val: 40 }, { day: "Tue", val: 60 }, { day: "Wed", val: 55 },
  { day: "Thu", val: 90 }, { day: "Fri", val: 65 }, { day: "Sat", val: 50 }, { day: "Sun", val: 78 },
];

const PATTERNS = [
  { label: "Most Productive", value: "9AM – 11AM" },
  { label: "Avg Meeting",     value: "45 min"      },
  { label: "Busiest Days",    value: "Tue, Thu"    },
];

const TIPS = ["Block mornings for deep work", "Add breaks between meetings", "Keep meetings under 30 min"];

const PRIORITY_CFG = {
  HIGH:   { bg: "bg-orari-danger/10",  text: "text-orari-danger",  dot: "bg-orari-danger"  },
  MEDIUM: { bg: "bg-orari-warning/10", text: "text-orari-warning", dot: "bg-orari-warning" },
  LOW:    { bg: "bg-orari-primary/10", text: "text-orari-primary", dot: "bg-orari-primary" },
};

function to24Hour(str) {
  const m = str?.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
  if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

function addOneHour(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function to12Hour(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function parseSuggestionTime(timeString) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tokens = [...timeString.matchAll(/\d{1,2}:\d{2}\s*(?:AM|PM)/gi)].map((m) => m[0]);
  const startTime = to24Hour(tokens[0]) || "09:00";
  const endTime   = to24Hour(tokens[1]) || addOneHour(startTime);

  let eventDate = new Date(today);
  const lower = timeString.toLowerCase();
  if (lower.includes("tomorrow")) {
    eventDate.setDate(eventDate.getDate() + 1);
  } else {
    const DAY_NAMES = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const foundDay = DAY_NAMES.findIndex((d) => lower.includes(d));
    if (foundDay !== -1) {
      let daysAhead = foundDay - today.getDay();
      if (daysAhead < 0) daysAhead += 7;
      eventDate.setDate(today.getDate() + daysAhead);
    } else {
      const stripped = timeString.replace(/\d{1,2}:\d{2}\s*(?:AM|PM)/gi, "").replace(/-/g, " ").trim();
      const parsed = Date.parse(stripped);
      if (!isNaN(parsed)) {
        const candidate = new Date(parsed); candidate.setHours(0, 0, 0, 0);
        eventDate = candidate;
      }
    }
  }

  return { dateStr: eventDate.toISOString().slice(0, 10), startTime, endTime };
}

function formatDisplayDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

function PriorityBadge({ priority }) {
  if (!priority) return null;
  const { bg, text, dot } = PRIORITY_CFG[priority] ?? PRIORITY_CFG.LOW;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${bg} ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {priority}
    </span>
  );
}

function ModifyModal({ item, onSave, onClose }) {
  const titleRef = useRef(null);
  const { dateStr, startTime, endTime } = parseSuggestionTime(item.time || "");

  const [form, setForm] = useState({
    title: item.title || "", date: dateStr, startTime, endTime, reason: item.reason || "",
  });

  useEffect(() => { titleRef.current?.focus(); }, []);
  useEffect(() => {
    if (form.startTime) setForm((p) => ({ ...p, endTime: addOneHour(form.startTime) }));
  }, [form.startTime]);

  const empty = form.title.trim() === "";

  const handleSave = () => {
    if (empty) return;
    onSave({
      ...item,
      title:     form.title,
      reason:    form.reason,
      dateStr:   form.date,
      startTime: form.startTime,
      endTime:   form.endTime,
      time:      `${to12Hour(form.startTime)} - ${to12Hour(form.endTime)}`,
    });
    onClose();
  };

  const field = (label, children) => (
    <div>
      <label className="mb-2 block text-[13px] text-orari-text-secondary">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full rounded-orari-input border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20";

  return (
    <>
      <div className="orari-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-orari-card bg-orari-surface shadow-orari-modal">
          <div className="flex items-center justify-between border-b border-orari-border p-6">
            <h3 className="text-[15px] font-semibold text-orari-text-primary font-display">Modify Suggestion</h3>
            <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-orari-primary-light" aria-label="Close">
              <X className="h-5 w-5 text-orari-text-secondary" />
            </button>
          </div>

          <div className="space-y-4 p-6">
            {field("Event Title",
              <input ref={titleRef} type="text" className={inputCls} value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter event title" />
            )}
            {field("Date",
              <input type="date" className={inputCls} value={form.date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            )}
            <div className="grid grid-cols-2 gap-4">
              {field("Start Time",
                <input type="time" className={inputCls} value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              )}
              {field("End Time",
                <input type="time" className={inputCls} value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              )}
            </div>
            {field(<>Notes <span className="text-orari-text-disabled">(Optional)</span></>,
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Add any additional details" />
            )}
          </div>

          <div className="border-t border-orari-border p-6">
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>Cancel</Button>
              <Button variant="primary" className="flex-1" type="button" onClick={handleSave} disabled={empty}>Save Changes</Button>
            </div>
            {empty && <p className="mt-2 text-center text-[13px] text-orari-text-secondary">Add a title to save</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Suggestions() {
  const { appendEvent, calendars } = useAppData();
  const [loading, setLoading]         = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [quote, setQuote]             = useState(QUOTES[0]);
  const [animateBars, setAnimateBars] = useState(false);
  const [modifyItem, setModifyItem]   = useState(null);

  const maxVal = Math.max(...PRODUCTIVITY.map((d) => d.val));
  useEffect(() => { setTimeout(() => setAnimateBars(true), 200); }, []);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const { events = [], calendars: calendarList = [] } = JSON.parse(localStorage.getItem("dashboard_state") || "{}");
      const res  = await fetch("http://localhost:5000/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events, calendars: calendarList, today: new Date().toISOString().slice(0, 10) }),
      });
      const data = await res.json();
      setSuggestions(Array.isArray(data) && data.length ? data : []);
    } catch (err) {
      console.error("Request failed:", err);
      setSuggestions([]);
    }
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setLoading(false);
  };

  const handleAccept = (item) => {
    const parsed = parseSuggestionTime(item.time || "");
    const dateStr    = item.dateStr    || parsed.dateStr;
    const startTime  = item.startTime  || parsed.startTime;
    const endTime    = item.endTime    || parsed.endTime;
    const cal =
      calendars.find((c) => c.name.toLowerCase() === (item.category || "").toLowerCase()) ||
      calendars.find((c) => c.name === "Personal") ||
      calendars[0];
    appendEvent({ id: Date.now().toString(), title: item.title, category: cal.name, color: cal.color,
      date: new Date(dateStr + "T00:00:00"), startTime, endTime, notes: item.reason || "" });
    setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
  };

  const handleDismiss  = (item) => setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
  const handleModifySave = (updated) => setSuggestions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  return (
    <>
      {modifyItem && <ModifyModal item={modifyItem} onSave={handleModifySave} onClose={() => setModifyItem(null)} />}

      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-orari-border bg-orari-surface px-4 lg:hidden">
        <div className="flex shrink-0 items-center ml-8 sm:ml-10">
          <Logo size="medium" />
        </div>
        <h2 className="font-semibold text-orari-text-primary">Suggestions</h2>
        <div className="w-8" aria-hidden="true" />
      </div>

      <div className="w-full px-4 pb-24 lg:px-8 lg:pb-8 lg:pt-6">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">

          <div className="w-full min-w-0">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-orari-text-primary">AI Suggestions</h1>
                <p className="text-orari-text-secondary text-[13px] mt-0.5">Smart scheduling recommendations powered by AI</p>
              </div>
              <Button variant="primary" size="md" onClick={getSuggestions} disabled={loading} className="gap-2 shrink-0">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Thinking…" : "Refresh"}
              </Button>
            </div>

            {!loading && suggestions.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-orari-card border border-orari-border bg-orari-surface py-16 shadow-orari-card text-center">
                <Sparkles className="h-10 w-10 text-orari-primary mb-4 opacity-60" />
                <p className="font-display font-semibold text-orari-text-primary mb-1">No suggestions yet</p>
                <p className="text-[13px] text-orari-text-secondary">Hit Refresh to get AI-powered scheduling ideas</p>
              </div>
            )}

            <div className="mx-auto flex w-full justify-center">
              <div className="grid w-full max-w-6xl grid-cols-1 gap-4 xl:grid-cols-2">
                {suggestions.map((item) => {
                  const parsed = parseSuggestionTime(item.time || "");
                  const dateStr   = item.dateStr   || parsed.dateStr;
                  const startTime = item.startTime || parsed.startTime;
                  const endTime   = item.endTime   || parsed.endTime;
                  return (
                    <div key={item.id} className="rounded-orari-card border border-orari-border bg-orari-surface p-5 shadow-orari-card">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-orari-text-secondary mb-1">{item.type}</p>
                          <h2 className="text-orari-text-primary truncate">{item.title}</h2>
                        </div>
                        <PriorityBadge priority={item.priority} />
                      </div>

                      <p className="text-[13px] text-orari-text-secondary mb-4 leading-relaxed">{item.reason}</p>

                      <div className="flex flex-wrap gap-x-8 gap-y-2 mb-5 text-[13px]">
                        {[
                          ["Scheduled For", formatDisplayDate(dateStr)],
                          ["Time", `${startTime} – ${endTime}`],
                          ["Duration", item.duration],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="font-semibold text-orari-text-primary">{label}</p>
                            <p className="text-orari-text-secondary">{value}</p>
                          </div>
                        ))}
                        {item.confidence != null && (
                          <div>
                            <p className="font-semibold text-orari-text-primary mb-1">Confidence</p>
                            <div className="w-24 h-1.5 bg-orari-primary-light rounded-full overflow-hidden">
                              <div className="h-1.5 bg-orari-primary rounded-full transition-all duration-700"
                                style={{ width: `${item.confidence * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="primary"    size="sm" onClick={() => handleAccept(item)}>Accept &amp; Schedule</Button>
                        <Button variant="secondary"  size="sm" onClick={() => setModifyItem(item)}>Modify</Button>
                        <Button variant="ghost"      size="sm" onClick={() => handleDismiss(item)}
                          className="text-orari-danger hover:bg-orari-danger/10 hover:text-orari-danger">Dismiss</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md shrink-0 space-y-4 lg:mx-0 lg:w-72 lg:max-w-none">

            <div className="rounded-orari-card border border-orari-border bg-orari-surface p-5 shadow-orari-card">
              <h3 className="text-orari-text-primary mb-4">Productivity Score</h3>
              <div className="flex items-end justify-between gap-1" style={{ height: 100 }}>
                {PRODUCTIVITY.map(({ day, val }) => (
                  <div key={day} className="flex flex-col items-center justify-end flex-1" style={{ height: "100%" }}>
                    <div className="w-full rounded-sm transition-all duration-1000 ease-out"
                      style={{
                        height: animateBars ? `${(val / maxVal) * 100}%` : "0%",
                        backgroundColor: val === maxVal ? "var(--orari-primary)" : "var(--orari-primary-light)",
                        border: val === maxVal ? "none" : "1px solid var(--orari-border)",
                      }} />
                    <span className="text-[10px] text-orari-text-disabled mt-1.5">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-orari-card border border-orari-border bg-orari-surface p-5 shadow-orari-card">
              <h3 className="text-orari-text-primary mb-3">Key Patterns</h3>
              <div className="space-y-2">
                {PATTERNS.map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-[13px] text-orari-text-secondary">{label}</span>
                    <span className="text-[13px] font-semibold text-orari-text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-orari-card p-5 shadow-orari-card text-white" style={{ background: "var(--orari-primary-gradient)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 opacity-80" />
                <h3 className="text-white">Motivation</h3>
              </div>
              <p className="text-[13px] italic opacity-90 leading-relaxed">"{quote}"</p>
            </div>

            <div className="rounded-orari-card border border-orari-border bg-orari-surface p-5 shadow-orari-card">
              <h3 className="text-orari-text-primary mb-3">Quick Tips</h3>
              <ul className="space-y-2">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-[13px] text-orari-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--orari-primary)" }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}