import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "../components/orari/Button";
import { useAppData } from "../context/AppDataContext";

const motivationalQuotes = [
  "Small progress is still progress.",
  "Focus on what moves the needle.",
  "Consistency beats intensity.",
  "You don't need more time, just more focus.",
  "Win the morning, win the day."
];

const productivityData = [
  { day: "Mon", val: 40 },
  { day: "Tue", val: 60 },
  { day: "Wed", val: 55 },
  { day: "Thu", val: 90 },
  { day: "Fri", val: 65 },
  { day: "Sat", val: 50 },
  { day: "Sun", val: 78 }
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function to24Hour(timeStr) {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function addOneHour(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseSuggestionTime(timeString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const timeTokens = [...timeString.matchAll(/\d{1,2}:\d{2}\s*(?:AM|PM)/gi)].map((m) => m[0]);
  const startTime = to24Hour(timeTokens[0]) || "09:00";
  const endTime   = to24Hour(timeTokens[1]) || addOneHour(startTime);

  let eventDate = new Date(today);
  const lower = timeString.toLowerCase();

  if (lower.includes("today")) {
    eventDate = new Date(today);
  } else if (lower.includes("tomorrow")) {
    eventDate = new Date(today);
    eventDate.setDate(eventDate.getDate() + 1);
  } else {
    const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    let foundDay = -1;
    for (let i = 0; i < days.length; i++) {
      if (lower.includes(days[i])) { foundDay = i; break; }
    }
    if (foundDay !== -1) {
      const candidate = new Date(today);
      let daysAhead = foundDay - today.getDay();
      if (daysAhead < 0) daysAhead += 7;
      candidate.setDate(today.getDate() + daysAhead);
      eventDate = candidate;
    } else {
      const stripped = timeString
        .replace(/\d{1,2}:\d{2}\s*(?:AM|PM)/gi, "")
        .replace(/-/g, " ")
        .trim();
      const parsed = Date.parse(stripped);
      if (!isNaN(parsed)) {
        const candidate = new Date(parsed);
        candidate.setHours(0, 0, 0, 0);
        if (candidate < today) candidate.setFullYear(today.getFullYear() + 1);
        eventDate = candidate;
      }
    }
  }

  const dateStr = eventDate.toISOString().slice(0, 10);
  return { dateStr, startTime, endTime };
}

function formatDisplayDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });
}

// ─────────────────────────────────────────────
// MODIFY MODAL
// ─────────────────────────────────────────────

function ModifyModal({ item, onSave, onClose }) {
  const titleInputRef = useRef(null);
  const { dateStr, startTime, endTime } = parseSuggestionTime(item.time || "");

  const [form, setForm] = useState({
    title:     item.title || "",
    date:      dateStr,
    startTime: startTime,
    endTime:   endTime,
    reason:    item.reason || ""
  });

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // Auto-set end time when start changes
  useEffect(() => {
    if (form.startTime) {
      setForm((prev) => ({ ...prev, endTime: addOneHour(form.startTime) }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.startTime]);

  const isTitleEmpty = form.title.trim() === "";

  const handleSave = () => {
    if (isTitleEmpty) return;
    // Reconstruct a time string the parser can read on accept
    const d = new Date(form.date + "T00:00:00");
    const dateLabel = d.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    });
    const to12 = (hhmm) => {
      const [h, m] = hhmm.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const hour   = h % 12 || 12;
      return `${hour}:${String(m).padStart(2, "0")} ${period}`;
    };
    const timeString = `${dateLabel}, ${to12(form.startTime)} - ${to12(form.endTime)}`;
    onSave({ ...item, title: form.title, time: timeString, reason: form.reason });
    onClose();
  };

  return (
    <>
      <div className="orari-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-orari-card bg-orari-surface shadow-orari-modal">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-orari-border p-6">
            <h3 className="text-[15px] font-semibold text-orari-text-primary font-display">
              Modify Suggestion
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 transition-colors hover:bg-orari-primary-light"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-orari-text-secondary" />
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4 p-6">

            {/* Title */}
            <div>
              <label className="mb-2 block text-[13px] text-orari-text-secondary">
                Event Title
              </label>
              <input
                ref={titleInputRef}
                type="text"
                className="w-full rounded-orari-input border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-[13px] text-orari-text-secondary">
                Date
              </label>
              <input
                type="date"
                className="w-full rounded-orari-input border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                value={form.date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            {/* Start / End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[13px] text-orari-text-secondary">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full rounded-orari-input border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] text-orari-text-secondary">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full rounded-orari-input border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Notes / Reason */}
            <div>
              <label className="mb-2 block text-[13px] text-orari-text-secondary">
                Notes <span className="text-orari-text-disabled">(Optional)</span>
              </label>
              <textarea
                className="w-full resize-none rounded-orari-input border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                rows={3}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Add any additional details"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-orari-border p-6">
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                type="button"
                onClick={handleSave}
                disabled={isTitleEmpty}
              >
                Save Changes
              </Button>
            </div>
            {isTitleEmpty && (
              <p className="mt-2 text-center text-[13px] text-orari-text-secondary">
                Add a title to save
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// PRIORITY BADGE
// ─────────────────────────────────────────────

const priorityConfig = {
  HIGH:   { bg: "bg-orari-danger/10",   text: "text-orari-danger",         dot: "bg-orari-danger"   },
  MEDIUM: { bg: "bg-orari-warning/10",  text: "text-orari-warning",        dot: "bg-orari-warning"  },
  LOW:    { bg: "bg-orari-primary/10",  text: "text-orari-primary",        dot: "bg-orari-primary"  },
};

function PriorityBadge({ priority }) {
  if (!priority) return null;
  const cfg = priorityConfig[priority] ?? priorityConfig.LOW;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {priority}
    </span>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function Suggestions() {
  const { appendEvent, calendars } = useAppData();

  const [loading, setLoading]           = useState(false);
  const [suggestions, setSuggestions]   = useState([]);
  const [quote, setQuote]               = useState(motivationalQuotes[0]);
  const [animateBars, setAnimateBars]   = useState(false);
  const [modifyItem, setModifyItem]     = useState(null); // item being modified

  const maxVal = Math.max(...productivityData.map((d) => d.val));

  useEffect(() => {
    setTimeout(() => setAnimateBars(true), 200);
  }, []);

  // ── Fetch ────────────────────────────────────

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const raw    = localStorage.getItem("dashboard_state");
      const parsed = raw ? JSON.parse(raw) : {};
      const events       = parsed.events    || [];
      const calendarList = parsed.calendars || [];
      const todayISO     = new Date().toISOString().slice(0, 10);

      const res = await fetch("http://localhost:5000/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events, calendars: calendarList, today: todayISO })
      });

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Request failed:", err);
      setSuggestions([]);
    }
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    setLoading(false);
  };

  // ── Actions ──────────────────────────────────

  const handleAccept = (item) => {
    const { dateStr, startTime, endTime } = parseSuggestionTime(item.time || "");

    const suggestedCategory = item.category || "Personal";
    const matchedCalendar =
      calendars.find((c) => c.name.toLowerCase() === suggestedCategory.toLowerCase()) ||
      calendars.find((c) => c.name === "Personal") ||
      calendars[0];

    appendEvent({
      id:        Date.now().toString(),
      title:     item.title,
      category:  matchedCalendar.name,
      color:     matchedCalendar.color,
      date:      new Date(dateStr + "T00:00:00"),
      startTime,
      endTime,
      notes:     item.reason || ""
    });

    setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
  };

  const handleModifySave = (updatedItem) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === updatedItem.id ? updatedItem : s))
    );
  };

  const handleDismiss = (item) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
  };

  // ── Render ───────────────────────────────────

  return (
    <>
      {/* Modify Modal */}
      {modifyItem && (
        <ModifyModal
          item={modifyItem}
          onSave={handleModifySave}
          onClose={() => setModifyItem(null)}
        />
      )}

      <div className="w-full flex gap-8">

        {/* ── LEFT: SUGGESTIONS ── */}
        <div className="flex-1 max-w-3xl">

          {/* Page header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-orari-text-primary">AI Suggestions</h1>
              <p className="text-orari-text-secondary text-[13px] mt-0.5">
                Smart scheduling recommendations powered by AI
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={getSuggestions}
              disabled={loading}
              className="gap-2 shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Thinking…" : "Refresh"}
            </Button>
          </div>

          {/* Empty state */}
          {!loading && suggestions.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-orari-card border border-orari-border bg-orari-surface py-16 shadow-orari-card text-center">
              <Sparkles className="h-10 w-10 text-orari-primary mb-4 opacity-60" />
              <p className="font-display font-semibold text-orari-text-primary mb-1">
                No suggestions yet
              </p>
              <p className="text-[13px] text-orari-text-secondary">
                Hit Refresh to get AI-powered scheduling ideas
              </p>
            </div>
          )}

          {/* Suggestion cards */}
          <div className="space-y-4">
            {suggestions.map((item) => {
              const { dateStr, startTime, endTime } = parseSuggestionTime(item.time || "");
              const displayDate = formatDisplayDate(dateStr);

              return (
                <div
                  key={item.id}
                  className="rounded-orari-card border border-orari-border bg-orari-surface p-5 shadow-orari-card"
                >
                  {/* Card header */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-orari-text-secondary mb-1">
                        {item.type}
                      </p>
                      <h2 className="text-orari-text-primary truncate">{item.title}</h2>
                    </div>
                    <PriorityBadge priority={item.priority} />
                  </div>

                  {/* Reason */}
                  <p className="text-[13px] text-orari-text-secondary mb-4 leading-relaxed">
                    {item.reason}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-8 gap-y-2 mb-5 text-[13px]">
                    <div>
                      <p className="font-semibold text-orari-text-primary">Scheduled For</p>
                      <p className="text-orari-text-secondary">{displayDate}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orari-text-primary">Time</p>
                      <p className="text-orari-text-secondary">{startTime} – {endTime}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orari-text-primary">Duration</p>
                      <p className="text-orari-text-secondary">{item.duration}</p>
                    </div>
                    {item.confidence != null && (
                      <div>
                        <p className="font-semibold text-orari-text-primary mb-1">Confidence</p>
                        <div className="w-24 h-1.5 bg-orari-primary-light rounded-full overflow-hidden">
                          <div
                            className="h-1.5 bg-orari-primary rounded-full transition-all duration-700"
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAccept(item)}
                    >
                      Accept &amp; Schedule
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setModifyItem(item)}
                    >
                      Modify
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(item)}
                      className="text-orari-danger hover:bg-orari-danger/10 hover:text-orari-danger"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-72 space-y-4 shrink-0">

          {/* Productivity Score */}
          <div className="rounded-orari-card border border-orari-border bg-orari-surface p-5 shadow-orari-card">
            <h3 className="text-orari-text-primary mb-4">Productivity Score</h3>
            <div className="flex items-end justify-between gap-1" style={{ height: "100px" }}>
              {productivityData.map((d, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-end flex-1"
                  style={{ height: "100%" }}
                >
                  <div
                    className="w-full rounded-sm transition-all duration-1000 ease-out"
                    style={{
                      height: animateBars ? `${(d.val / maxVal) * 100}%` : "0%",
                      backgroundColor: d.val === maxVal
                        ? "var(--orari-primary)"
                        : "var(--orari-primary-light)",
                      border: d.val === maxVal
                        ? "none"
                        : "1px solid var(--orari-border)"
                    }}
                  />
                  <span className="text-[10px] text-orari-text-disabled mt-1.5">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Patterns */}
          <div className="rounded-orari-card border border-orari-border bg-orari-surface p-5 shadow-orari-card">
            <h3 className="text-orari-text-primary mb-3">Key Patterns</h3>
            <div className="space-y-2">
              {[
                { label: "Most Productive", value: "9AM – 11AM" },
                { label: "Avg Meeting", value: "45 min" },
                { label: "Busiest Days", value: "Tue, Thu" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[13px] text-orari-text-secondary">{label}</span>
                  <span className="text-[13px] font-semibold text-orari-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <div
            className="rounded-orari-card p-5 shadow-orari-card text-white"
            style={{ background: "var(--orari-primary-gradient)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 opacity-80" />
              <h3 className="text-white">Motivation</h3>
            </div>
            <p className="text-[13px] italic opacity-90 leading-relaxed">"{quote}"</p>
          </div>

          {/* Quick Tips */}
          <div className="rounded-orari-card border border-orari-border bg-orari-surface p-5 shadow-orari-card">
            <h3 className="text-orari-text-primary mb-3">Quick Tips</h3>
            <ul className="space-y-2">
              {[
                "Block mornings for deep work",
                "Add breaks between meetings",
                "Keep meetings under 30 min",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-[13px] text-orari-text-secondary">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--orari-primary)" }}
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}