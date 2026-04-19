import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from 'date-fns';

export default function CalendarGrid({ currentDate, events, onDateClick, onEventClick }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date) =>
    events.filter((event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-orari-card">
      <div className="grid grid-cols-7 border-b border-orari-border">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-sm font-medium text-orari-text-secondary">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
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
    </div>
  );
}
