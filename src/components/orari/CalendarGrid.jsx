import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
} from 'date-fns';

function getEventsForDay(events, date) {
  return events.filter((event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
}

function renderMonthView({ currentDate, events, onDateClick, onEventClick }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <div className="grid grid-cols-7 border-b border-orari-border">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-sm font-medium text-orari-text-secondary">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(events, day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => onDateClick?.(day)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onDateClick?.(day);
                }
              }}
              className={`min-h-24 cursor-pointer border-b border-r border-orari-border p-2 transition-colors hover:bg-orari-primary-light/30 lg:min-h-32 ${
                !isCurrentMonth ? 'bg-orari-background/50' : 'bg-white'
              } ${index % 7 === 6 ? 'border-r-0' : ''}`}
            >
              <div className="mb-1 flex justify-center">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    isCurrentDay
                      ? 'bg-orari-primary font-semibold text-white'
                      : isCurrentMonth
                        ? 'text-orari-text-primary'
                        : 'text-orari-text-disabled'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer truncate rounded-full px-2 py-1 text-xs text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onEventClick?.(event);
                      }
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="px-2 text-xs text-orari-text-secondary">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function renderWeekView({ currentDate, events, onEventClick }) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-2 p-2">
      {days.map((day) => {
        const dayEvents = getEventsForDay(events, day);
        const isCurrentDay = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className={`rounded-lg border p-3 ${
              isCurrentDay ? 'border-orari-primary bg-orari-primary-light/20' : 'border-orari-border'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[13px] font-medium ${isCurrentDay ? 'text-orari-primary' : 'text-orari-text-secondary'}`}>
                  {format(day, 'EEE')}
                </span>
                <span className={`text-[15px] ${isCurrentDay ? 'font-semibold text-orari-primary' : 'text-orari-text-primary'}`}>
                  {format(day, 'd')}
                </span>
              </div>
              <span className="text-[11px] text-orari-text-disabled">
                {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            <div className="space-y-1">
              {dayEvents.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-orari-primary-light/30"
                  onClick={() => onEventClick?.(event)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onEventClick?.(event);
                    }
                  }}
                >
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
                  <span className="truncate text-[13px] text-orari-text-primary">{event.title}</span>
                </div>
              ))}
              {dayEvents.length > 8 && (
                <div className="px-2 text-[11px] text-orari-text-secondary">+{dayEvents.length - 8} more</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderDayView({ currentDate, events, onEventClick }) {
  const dayEvents = getEventsForDay(events, currentDate);
  const isCurrentDay = isToday(currentDate);

  return (
    <div className="p-2">
      <div
        className={`mb-4 rounded-lg border p-4 ${
          isCurrentDay ? 'border-orari-primary bg-orari-primary-light/20' : 'border-orari-border'
        }`}
      >
        <div className="text-center">
          <div className={`mb-1 text-[13px] font-medium ${isCurrentDay ? 'text-orari-primary' : 'text-orari-text-secondary'}`}>
            {format(currentDate, 'EEEE')}
          </div>
          <div className={`text-[28px] font-semibold ${isCurrentDay ? 'text-orari-primary' : 'text-orari-text-primary'}`}>
            {format(currentDate, 'd')}
          </div>
          <div className="text-[13px] text-orari-text-secondary">{format(currentDate, 'MMMM yyyy')}</div>
        </div>
      </div>

      <div className="space-y-2">
        {dayEvents.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[15px] text-orari-text-secondary">No events scheduled</p>
          </div>
        ) : (
          dayEvents.map((event) => (
            <div
              key={event.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer rounded-lg border border-orari-border p-3 transition-all hover:border-orari-primary hover:bg-orari-primary-light/20"
              onClick={() => onEventClick?.(event)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEventClick?.(event);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-1 rounded-full" style={{ backgroundColor: event.color }} />
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-orari-text-primary">{event.title}</p>
                  <p className="mt-0.5 text-[13px] text-orari-text-secondary">{event.category}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function CalendarGrid({ currentDate, events, view = 'Month', onDateClick, onEventClick }) {
  const shell = (inner) => <div className="overflow-hidden rounded-xl bg-white shadow-orari-card">{inner}</div>;

  if (view === 'Week') {
    return shell(renderWeekView({ currentDate, events, onEventClick }));
  }
  if (view === 'Day') {
    return shell(renderDayView({ currentDate, events, onEventClick }));
  }

  return shell(renderMonthView({ currentDate, events, onDateClick, onEventClick }));
}
