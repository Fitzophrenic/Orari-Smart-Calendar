import React, { createContext, useCallback, useContext, useMemo } from 'react';

const AppDataContext = createContext(null);

export const defaultCalendars = [
  { name: 'Academic', color: '#4A6FA5', enabled: true },
  { name: 'Work', color: '#E8A838', enabled: true },
  { name: 'Fitness', color: '#6BAF8D', enabled: true },
  { name: 'Social', color: '#D95F5F', enabled: true },
  { name: 'Personal', color: '#3AAFA9', enabled: true },
];

export const defaultEventsSeed = [
  {
    id: '1',
    title: 'CS101 Lecture',
    category: 'Academic',
    color: '#4A6FA5',
    date: new Date(2026, 3, 18),
    startTime: '10:00 AM',
    endTime: '11:30 AM',
  },
  {
    id: '2',
    title: 'Gym Session',
    category: 'Fitness',
    color: '#6BAF8D',
    date: new Date(2026, 3, 19),
    startTime: '6:00 AM',
    endTime: '7:00 AM',
  },
  {
    id: '3',
    title: 'Team Meeting',
    category: 'Work',
    color: '#E8A838',
    date: new Date(2026, 3, 20),
    startTime: '2:00 PM',
    endTime: '3:00 PM',
  },
  {
    id: '4',
    title: 'Study Group',
    category: 'Academic',
    color: '#4A6FA5',
    date: new Date(2026, 3, 21),
    startTime: '4:00 PM',
    endTime: '6:00 PM',
  },
  {
    id: '5',
    title: 'Project Deadline',
    category: 'Academic',
    color: '#4A6FA5',
    date: new Date(2026, 3, 22),
  },
  {
    id: '6',
    title: 'Coffee with Sarah',
    category: 'Social',
    color: '#D95F5F',
    date: new Date(2026, 3, 23),
    startTime: '3:00 PM',
    endTime: '4:00 PM',
  },
];

export function getDefaultAppData() {
  return {
    calendars: defaultCalendars.map((c) => ({ ...c })),
    events: defaultEventsSeed.map((e) => ({ ...e, date: new Date(e.date) })),
    aiSuggestions: [],
  };
}

/**
 * @param {import('react').Dispatch<import('react').SetStateAction<ReturnType<typeof getDefaultAppData>>>} setAppData
 */
export function AppDataProvider({ children, appData, setAppData }) {
  const calendars = appData.calendars;
  const events = appData.events;

  const setCalendars = useCallback(
    (next) => {
      setAppData((prev) => ({
        ...prev,
        calendars: typeof next === 'function' ? next(prev.calendars) : next,
      }));
    },
    [setAppData],
  );

  const setEvents = useCallback(
    (next) => {
      setAppData((prev) => ({
        ...prev,
        events: typeof next === 'function' ? next(prev.events) : next,
      }));
    },
    [setAppData],
  );

  const toggleCalendar = useCallback((index) => {
    setAppData((prev) => {
      const next = [...prev.calendars];
      next[index] = { ...next[index], enabled: !next[index].enabled };
      return { ...prev, calendars: next };
    });
  }, [setAppData]);

  const appendEvent = useCallback(
    (newEvent) => {
      setAppData((prev) => ({ ...prev, events: [...prev.events, newEvent] }));
    },
    [setAppData],
  );

  const updateEvent = useCallback(
    (eventId, updates) => {
      setAppData((prev) => ({
        ...prev,
        events: prev.events.map((event) => (event.id === eventId ? { ...event, ...updates } : event)),
      }));
    },
    [setAppData],
  );

  const deleteEvent = useCallback(
    (eventId) => {
      setAppData((prev) => ({
        ...prev,
        events: prev.events.filter((event) => event.id !== eventId),
      }));
    },
    [setAppData],
  );

  const value = useMemo(
    () => ({
      calendars,
      setCalendars,
      events,
      setEvents,
      toggleCalendar,
      appendEvent,
      updateEvent,
      deleteEvent,
      appData,
      setAppData,
    }),
    [calendars, events, setCalendars, setEvents, toggleCalendar, appendEvent, updateEvent, deleteEvent, appData, setAppData],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
}
