import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/orari/Sidebar';
import AiChatPanel from '../components/orari/AiChatPanel';
import MobileBottomNav from '../components/orari/MobileBottomNav';

export default function OrariAppLayout() {
  const location = useLocation();
  const showAiPanel = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-orari-background">
      <Sidebar />

      <div
        className={
          showAiPanel
            ? 'flex min-h-screen flex-col pb-20 lg:ml-60 lg:flex-row lg:pb-0'
            : 'min-h-screen pb-20 lg:ml-60 lg:pb-0'
        }
      >
        {showAiPanel ? (
          <>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <Outlet />
            </div>
            <div className="hidden shrink-0 lg:block">
              <AiChatPanel />
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}
