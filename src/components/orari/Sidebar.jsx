import React from 'react';
import { Calendar, FolderKanban, Lightbulb, Bell, User, Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { Switch } from './Switch';
import { useAppData } from '../../context/AppDataContext';

/** Figma `Sidebar.tsx` — routes and hierarchy */
const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Calendar, label: 'Calendar', path: '/dashboard' },
  { icon: FolderKanban, label: 'Categories', path: '/categories' },
  { icon: Lightbulb, label: 'Suggestions', path: '/suggestions' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const { calendars, toggleCalendar } = useAppData();

  return (
    <div className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-orari-border bg-orari-surface lg:flex">
      <div className="px-6 pb-4 pt-5">
        <BrandMark variant="onBackground" className="w-32 object-left sm:w-40" />
      </div>

      <nav className="flex-1 px-3 pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/home'}
              className={({ isActive }) => {
                const isSuggestOrAlerts = item.path === '/suggestions' || item.path === '/alerts';
                const inactive = isSuggestOrAlerts
                  ? 'border-l-4 border-transparent font-semibold text-orari-text-primary/80 hover:bg-orari-primary-light/50 hover:text-orari-text-primary'
                  : 'border-l-4 border-transparent text-orari-text-secondary hover:bg-orari-primary-light/50';
                return `mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'border-l-4 border-orari-primary bg-orari-primary-light text-orari-primary'
                    : inactive
                }`;
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}

        <div className="mb-4 mt-8">
          <div className="mb-3 px-4">
            <span className="text-xs font-medium uppercase tracking-wide text-orari-text-secondary">My Calendars</span>
          </div>
          <div className="space-y-2">
            {calendars.map((calendar, index) => (
              <div
                key={calendar.name}
                className="flex items-center justify-between rounded-lg px-4 py-2 transition-colors hover:bg-orari-primary-light/30"
              >
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: calendar.color }} />
                  <span className="text-sm text-orari-text-primary">{calendar.name}</span>
                </div>
                <div className="-translate-x-px shrink-0">
                  <Switch checked={calendar.enabled} onCheckedChange={() => toggleCalendar(index)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-orari-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orari-primary-light">
            <User className="h-5 w-5 text-orari-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-orari-text-primary">Student Name</div>
            <div className="text-xs text-orari-text-secondary">student@email.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
