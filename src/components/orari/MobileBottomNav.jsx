import React from 'react';
import { Calendar, FolderKanban, Bell, User, Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';

/** Figma `MobileBottomNav.tsx` — five tabs, no Suggestions */
const tabs = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Calendar, label: 'Calendar', path: '/dashboard' },
  { icon: FolderKanban, label: 'Categories', path: '/categories' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-orari-border bg-orari-surface px-2 lg:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/home'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
                isActive ? 'text-orari-primary' : 'text-orari-text-disabled'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
