import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppDataProvider, getDefaultAppData } from './context/AppDataContext';
import OrariAppLayout from './layouts/OrariAppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Categories from './pages/Categories';
import Suggestions from './pages/Suggestions';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';

const DASHBOARD_STORAGE_KEY = 'dashboard_state';

function reviveEventDates(events) {
  if (!Array.isArray(events)) return [];
  return events.map((e) => ({
    ...e,
    date: e.date ? new Date(e.date) : e.date,
  }));
}

function loadAppDataFromStorage() {
  try {
    const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (!raw) return getDefaultAppData();
    const parsed = JSON.parse(raw);
    const base = getDefaultAppData();
    return {
      calendars: Array.isArray(parsed.calendars) ? parsed.calendars : base.calendars,
      events: reviveEventDates(parsed.events ?? base.events),
      aiSuggestions: Array.isArray(parsed.aiSuggestions) ? parsed.aiSuggestions : base.aiSuggestions,
    };
  } catch {
    return getDefaultAppData();
  }
}

function serializeAppData(data) {
  return JSON.stringify({
    ...data,
    events: data.events.map((e) => ({
      ...e,
      date: e.date instanceof Date ? e.date.toISOString() : e.date,
    })),
  });
}

export default function App() {
  const [appData, setAppData] = useState(loadAppDataFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, serializeAppData(appData));
    } catch (e) {
      console.warn('dashboard_state save failed', e);
    }
  }, [appData]);

  const updateAppData = useCallback((key, value) => {
    setAppData((prev) => {
      const nextValue = typeof value === 'function' ? value(prev[key]) : value;
      let normalized = nextValue;
      if (key === 'events' && Array.isArray(normalized)) {
        normalized = reviveEventDates(normalized);
      }
      return { ...prev, [key]: normalized };
    });
  }, []);

  useEffect(() => {
    window.updateAppData = updateAppData;
    return () => {
      delete window.updateAppData;
    };
  }, [updateAppData]);

  return (
    <AppDataProvider appData={appData} setAppData={setAppData}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<OrariAppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Calendar />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}
