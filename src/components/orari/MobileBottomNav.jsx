import React from 'react';
import { Calendar, FolderKanban, Lightbulb, Bell, User, Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';

/** Figma mobile nav — matches sidebar order; Suggestions & Alerts use stronger default contrast */
const tabs = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Calendar, label: 'Calendar', path: '/dashboard' },
  { icon: FolderKanban, label: 'Categories', path: '/categories' },
  { icon: Lightbulb, label: 'Suggestions', path: '/suggestions', emphasize: true },
  { icon: Bell, label: 'Alerts', path: '/alerts', emphasize: true },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex min-h-[4.25rem] items-center justify-around border-t border-orari-border bg-orari-surface px-0.5 pt-0.5 lg:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const emphasize = tab.emphasize === true;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/home'}
            className={({ isActive }) => {
              const inactive = emphasize ? 'text-orari-text-secondary' : 'text-orari-text-disabled';
              return `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 py-2 transition-colors ${
                isActive ? 'text-orari-primary' : inactive
              } ${emphasize && !isActive ? 'font-semibold' : ''}`;
            }}
          >
            <Icon className={`shrink-0 ${emphasize ? 'h-[22px] w-[22px]' : 'h-5 w-5'}`} />
            <span
              className={`max-w-full truncate text-center leading-tight ${emphasize ? 'text-[11px] font-semibold sm:text-xs' : 'text-[10px] font-medium sm:text-xs'}`}
            >
              {tab.label}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
}
