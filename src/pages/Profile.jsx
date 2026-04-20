import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, User } from 'lucide-react';
import { BrandMark } from '../components/orari/BrandMark';
import { Button } from '../components/orari/Button';
import { Switch } from '../components/orari/Switch';
import { FloatingInput } from '../components/orari/FloatingInput';

const handleFilter = () => {};

/** Figma `Profile.tsx` — shell from `OrariAppLayout` */
export default function Profile() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    try {
      localStorage.clear();
    } catch {
      /* ignore quota / private mode */
    }
    navigate('/');
  };

  const [profile, setProfile] = useState({
    name: 'Student Name',
    email: 'student@email.com',
  });

  const [preferences, setPreferences] = useState({
    aiSuggestions: true,
    defaultReminder: '1 hour before',
    timeZone: 'Eastern Time (ET)',
  });

  const [connectedCalendars, setConnectedCalendars] = useState({
    google: false,
    apple: false,
  });

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-orari-border bg-orari-surface px-4 lg:hidden">
        <div className="flex shrink-0 items-center ml-8 sm:ml-10">
          <BrandMark variant="onBackground" className="max-h-10 w-32 object-contain object-left sm:max-h-11 sm:w-40" />
        </div>
        <h2 className="font-semibold text-orari-text-primary">Profile</h2>
        <div className="w-8" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-3xl p-6 pb-24 lg:p-10 lg:pb-10">
        <h1 className="mb-8">Profile</h1>

        <div className="mb-10 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orari-primary-light">
              <User className="h-8 w-8 text-orari-primary" />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-orari-primary transition-colors hover:bg-orari-primary/90"
              aria-label="Edit avatar"
            >
              <Edit2 className="h-3 w-3 text-white" />
            </button>
          </div>
          <h2 className="mb-1">{profile.name}</h2>
          <p className="text-orari-text-secondary">{profile.email}</p>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-orari-text-primary">Account</h3>
          <div className="space-y-4 rounded-xl bg-orari-surface p-6 shadow-orari-card">
            <FloatingInput
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <FloatingInput
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-orari-text-primary">Preferences</h3>
          <div className="space-y-4 rounded-xl bg-orari-surface p-6 shadow-orari-card">
            <div className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-orari-primary-light/30">
              <div>
                <div className="font-medium text-orari-text-primary">AI Suggestions</div>
                <div className="text-sm text-orari-text-secondary">Get intelligent scheduling recommendations</div>
              </div>
              <Switch
                checked={preferences.aiSuggestions}
                onCheckedChange={(checked) => setPreferences({ ...preferences, aiSuggestions: checked })}
              />
            </div>

            <div>
              <label className="mb-2 block px-4 text-sm text-orari-text-secondary">Default Reminder Timing</label>
              <select
                className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary"
                value={preferences.defaultReminder}
                onChange={(e) => setPreferences({ ...preferences, defaultReminder: e.target.value })}
              >
                <option>15 minutes before</option>
                <option>30 minutes before</option>
                <option>1 hour before</option>
                <option>1 day before</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block px-4 text-sm text-orari-text-secondary">Time Zone</label>
              <select
                className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary"
                value={preferences.timeZone}
                onChange={(e) => setPreferences({ ...preferences, timeZone: e.target.value })}
              >
                <option>Eastern Time (ET)</option>
                <option>Central Time (CT)</option>
                <option>Mountain Time (MT)</option>
                <option>Pacific Time (PT)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-orari-text-primary">Connected Calendars</h3>
          <div className="space-y-4 rounded-xl bg-orari-surface p-6 shadow-orari-card">
            <div className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-orari-primary-light/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orari-primary-light">
                  <span className="text-lg font-bold text-orari-primary">G</span>
                </div>
                <div>
                  <div className="font-medium text-orari-text-primary">Google Calendar</div>
                  <div className="text-sm text-orari-text-secondary">
                    {connectedCalendars.google ? 'Connected' : 'Not connected'}
                  </div>
                </div>
              </div>
              {connectedCalendars.google ? (
                <Switch
                  checked={connectedCalendars.google}
                  onCheckedChange={(checked) => setConnectedCalendars({ ...connectedCalendars, google: checked })}
                />
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setConnectedCalendars({ ...connectedCalendars, google: true })}
                >
                  Connect
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-orari-primary-light/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orari-primary-light">
                  <span className="text-lg font-bold text-orari-primary">A</span>
                </div>
                <div>
                  <div className="font-medium text-orari-text-primary">Apple Calendar</div>
                  <div className="text-sm text-orari-text-secondary">
                    {connectedCalendars.apple ? 'Connected' : 'Not connected'}
                  </div>
                </div>
              </div>
              {connectedCalendars.apple ? (
                <Switch
                  checked={connectedCalendars.apple}
                  onCheckedChange={(checked) => setConnectedCalendars({ ...connectedCalendars, apple: checked })}
                />
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setConnectedCalendars({ ...connectedCalendars, apple: true })}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="primary" size="lg" type="button" className="w-full" onClick={() => handleFilter()}>
            Save Changes
          </Button>
          <Button variant="secondary" size="lg" type="button" className="w-full" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}
