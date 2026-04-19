import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bell,
  TrendingUp,
  Calendar as CalendarIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { format, addMonths, subMonths, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/orari/Logo';
import CompactCalendar from '../components/orari/CompactCalendar';
import EventDetailsModal from '../components/orari/EventDetailsModal';
import { useAppData } from '../context/AppDataContext';

/** Figma frame `Home` — layout: sidebar in shell; top bar h-16; content p-4 lg:p-8 pb-20; grid lg:grid-cols-3 gap-6 */
export default function Home() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('Month');
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { calendars, events, updateEvent, deleteEvent } = useAppData();

  const suggestions = [
    {
      id: '1',
      title: 'Schedule study time before CS101 exam',
      description: 'You have a CS101 exam in 5 days. Consider blocking 2-3 hours for focused study.',
      type: 'academic',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Morning workout routine',
      description: "You've been consistent with gym sessions. Great job! Keep it up.",
      type: 'fitness',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Team project check-in',
      description: 'Your team meeting is tomorrow. Review the agenda and prepare updates.',
      type: 'work',
      priority: 'medium',
    },
  ];

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const calendar = calendars.find((c) => c.name === event.category);
        return calendar?.enabled;
      }),
    [events, calendars],
  );

  const today = startOfDay(new Date());
  const upcomingEvents = useMemo(
    () =>
      filteredEvents
        .filter((event) => {
          const eventDate = startOfDay(event.date);
          return (
            (isAfter(eventDate, today) || format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) &&
            isBefore(eventDate, addDays(today, 8))
          );
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5),
    [filteredEvents, today],
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-orari-danger';
      case 'medium':
        return 'text-orari-warning';
      default:
        return 'text-orari-text-secondary';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-orari-danger/10';
      case 'medium':
        return 'bg-orari-warning/10';
      default:
        return 'bg-orari-primary-light/20';
    }
  };

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-orari-border bg-orari-surface px-4 lg:px-8">
        <div className="lg:hidden">
          <Logo variant="icon-only" size="small" />
        </div>

        <h1 className="font-semibold text-orari-text-primary">Dashboard</h1>

        <div className="w-10" aria-hidden="true" />
      </div>

      <div className="p-4 pb-20 lg:p-8 lg:pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl bg-orari-surface p-6 shadow-orari-card">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orari-primary" />
                  <h2 className="font-semibold text-orari-text-primary">AI Suggestions</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/suggestions')}
                  className="text-[13px] text-orari-primary hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`cursor-pointer rounded-lg border border-orari-border p-4 transition-colors hover:border-orari-primary ${getPriorityBg(suggestion.priority)}`}
                  >
                    <div className="flex items-start gap-3">
                      <TrendingUp className={`mt-0.5 h-4 w-4 shrink-0 ${getPriorityColor(suggestion.priority)}`} />
                      <div className="flex-1">
                        <h3 className="mb-1 text-[15px] font-medium text-orari-text-primary">{suggestion.title}</h3>
                        <p className="text-[13px] text-orari-text-secondary">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-orari-surface p-6 shadow-orari-card">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orari-primary" />
                  <h2 className="font-semibold text-orari-text-primary">Upcoming Events</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/alerts')}
                  className="text-[13px] text-orari-primary hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {upcomingEvents.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-[15px] text-orari-text-secondary">No upcoming events</p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer rounded-lg border border-orari-border p-3 transition-all hover:border-orari-primary hover:bg-orari-primary-light/20"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsEventDetailsModalOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedEvent(event);
                          setIsEventDetailsModalOpen(true);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-1 shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
                        <div className="flex-1">
                          <p className="text-[15px] font-medium text-orari-text-primary">{event.title}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-[13px] text-orari-text-secondary">{format(event.date, 'MMM d, yyyy')}</p>
                            {event.startTime && (
                              <>
                                <span className="text-orari-text-disabled">•</span>
                                <p className="text-[13px] text-orari-text-secondary">{event.startTime}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-orari-text-disabled" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-orari-surface p-6 shadow-orari-card">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-orari-primary" />
                  <h2 className="font-semibold text-orari-text-primary">Calendar</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="text-[13px] text-orari-primary hover:underline"
                >
                  Full View
                </button>
              </div>

              <div className="mb-4 flex rounded-lg bg-orari-primary-light/50 p-1">
                {['Month', 'Week', 'Day'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setCalendarView(v)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      calendarView === v
                        ? 'bg-orari-primary-light text-orari-primary'
                        : 'text-orari-text-secondary hover:text-orari-primary'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="rounded-lg p-1.5 transition-colors hover:bg-orari-primary-light"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4 text-orari-text-secondary" />
                </button>
                <h3 className="text-[15px] font-medium text-orari-text-primary">{format(currentDate, 'MMMM yyyy')}</h3>
                <button
                  type="button"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="rounded-lg p-1.5 transition-colors hover:bg-orari-primary-light"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4 text-orari-text-secondary" />
                </button>
              </div>

              <CompactCalendar
                currentDate={currentDate}
                events={filteredEvents}
                view={calendarView}
                onEventClick={(event) => {
                  setSelectedEvent(event);
                  setIsEventDetailsModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={() => setIsEventDetailsModalOpen(false)}
        event={selectedEvent}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </>
  );
}
