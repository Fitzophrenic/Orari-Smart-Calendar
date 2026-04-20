import React, { useMemo, useState } from 'react';
import { Bell, AlertTriangle, Info, X, Clock } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { BrandMark } from '../components/orari/BrandMark';
import { Switch } from '../components/orari/Switch';
import { Button } from '../components/orari/Button';

const seedAlerts = [
  {
    id: '1',
    title: 'CS4263 project due soon',
    body: 'Final submission is in 48 hours. Block time to polish and record your demo.',
    urgency: 'high',
    createdAt: addHours(new Date(), -2),
  },
  {
    id: '2',
    title: 'Team sync tomorrow',
    body: 'You have a standing meeting at 10:00 AM. Agenda was shared in your inbox.',
    urgency: 'medium',
    createdAt: addHours(new Date(), -8),
  },
  {
    id: '3',
    title: 'Calendar sync completed',
    body: 'Your Google Calendar finished syncing. 3 new events were imported.',
    urgency: 'low',
    createdAt: addHours(new Date(), -26),
  },
];

function UrgencyIcon({ urgency }) {
  if (urgency === 'high') return <AlertTriangle className="h-5 w-5 text-orari-danger" aria-hidden />;
  if (urgency === 'medium') return <Bell className="h-5 w-5 text-orari-warning" aria-hidden />;
  return <Info className="h-5 w-5 text-orari-primary" aria-hidden />;
}

function urgencyStyles(urgency) {
  if (urgency === 'high') return 'border-orari-danger/30 bg-orari-danger/5';
  if (urgency === 'medium') return 'border-orari-warning/30 bg-orari-warning/5';
  return 'border-orari-border bg-orari-surface';
}

export default function Alerts() {
  const [items, setItems] = useState(seedAlerts);
  const [prefs, setPrefs] = useState({
    pushEnabled: true,
    emailDigest: false,
    eventReminders: true,
    aiHighlights: true,
  });

  const sorted = useMemo(() => [...items].sort((a, b) => b.createdAt - a.createdAt), [items]);

  const dismiss = (id) => setItems((prev) => prev.filter((a) => a.id !== id));

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-orari-border bg-orari-surface px-4 lg:hidden">
        <div className="flex shrink-0 items-center ml-8 sm:ml-10">
          <BrandMark variant="onBackground" className="max-h-10 w-32 object-contain object-left sm:max-h-11 sm:w-40" />
        </div>
        <h2 className="font-semibold text-orari-text-primary">Alerts</h2>
        <div className="w-8" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-4xl p-6 pb-24 lg:p-10 lg:pb-10">
        <div className="mb-8 hidden items-center justify-between lg:flex">
          <div>
            <h1 className="text-orari-text-primary">Alerts</h1>
            <p className="mt-1 text-[13px] text-orari-text-secondary">Stay on top of deadlines, conflicts, and account activity</p>
          </div>
        </div>

        <h1 className="mb-6 lg:hidden">Alerts</h1>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-orari-primary" />
            <h2 className="font-semibold text-orari-text-primary">Active</h2>
            <span className="rounded-full bg-orari-primary-light px-2 py-0.5 text-[11px] font-semibold text-orari-primary">{sorted.length}</span>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-orari-border bg-orari-surface/80 py-14 text-center shadow-orari-card">
              <p className="text-[15px] font-medium text-orari-text-primary">You&apos;re all caught up</p>
              <p className="mt-1 text-[13px] text-orari-text-secondary">New alerts will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex gap-4 rounded-xl border p-5 shadow-orari-card transition-shadow hover:shadow-md ${urgencyStyles(alert.urgency)}`}
                >
                  <div className="mt-0.5 shrink-0">
                    <UrgencyIcon urgency={alert.urgency} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-[15px] font-semibold text-orari-text-primary">{alert.title}</h3>
                      <button
                        type="button"
                        onClick={() => dismiss(alert.id)}
                        className="shrink-0 rounded-lg p-1.5 text-orari-text-secondary transition-colors hover:bg-orari-primary-light/50 hover:text-orari-text-primary"
                        aria-label="Dismiss alert"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-orari-text-secondary">{alert.body}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-orari-text-disabled">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{format(alert.createdAt, 'MMM d, h:mm a')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-orari-text-primary">Notification preferences</h2>
          <div className="divide-y divide-orari-border rounded-xl border border-orari-border bg-orari-surface shadow-orari-card">
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0 text-left">
                <p className="font-medium text-orari-text-primary">Push notifications</p>
                <p className="text-[13px] text-orari-text-secondary">Instant alerts on this device</p>
              </div>
              <Switch checked={prefs.pushEnabled} onCheckedChange={(v) => setPrefs((p) => ({ ...p, pushEnabled: v }))} />
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0 text-left">
                <p className="font-medium text-orari-text-primary">Daily email digest</p>
                <p className="text-[13px] text-orari-text-secondary">Morning summary of your day</p>
              </div>
              <Switch checked={prefs.emailDigest} onCheckedChange={(v) => setPrefs((p) => ({ ...p, emailDigest: v }))} />
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0 text-left">
                <p className="font-medium text-orari-text-primary">Event reminders</p>
                <p className="text-[13px] text-orari-text-secondary">Reminders before meetings and classes</p>
              </div>
              <Switch checked={prefs.eventReminders} onCheckedChange={(v) => setPrefs((p) => ({ ...p, eventReminders: v }))} />
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0 text-left">
                <p className="font-medium text-orari-text-primary">AI highlights</p>
                <p className="text-[13px] text-orari-text-secondary">Smart nudges based on your schedule</p>
              </div>
              <Switch checked={prefs.aiHighlights} onCheckedChange={(v) => setPrefs((p) => ({ ...p, aiHighlights: v }))} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" type="button" onClick={() => setItems(seedAlerts)}>
              Restore sample alerts
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
