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

export default function CompactCalendar({ currentDate, events, view, onEventClick }) {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getEventsForDay = (date) =>
    events.filter((event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div>
        <div className="mb-2 grid grid-cols-7">
          {weekDays.map((day, index) => (
            <div key={index} className="py-1 text-center text-[11px] font-medium text-orari-text-secondary">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg transition-colors ${
                  !isCurrentMonth ? 'opacity-30' : ''
                } ${isCurrentDay ? 'bg-orari-primary text-white' : 'hover:bg-orari-primary-light/30'}`}
              >
                <span className={`text-[13px] ${isCurrentDay ? 'font-semibold' : ''}`}>{format(day, 'd')}</span>
                {dayEvents.length > 0 && (
                  <div className="mt-1 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: isCurrentDay ? 'white' : event.color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="space-y-2">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
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
                  <span
                    className={`text-[13px] font-medium ${isCurrentDay ? 'text-orari-primary' : 'text-orari-text-secondary'}`}
                  >
                    {format(day, 'EEE')}
                  </span>
                  <span
                    className={`text-[15px] ${isCurrentDay ? 'font-semibold text-orari-primary' : 'text-orari-text-primary'}`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <span className="text-[11px] text-orari-text-disabled">
                  {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
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
                {dayEvents.length > 3 && (
                  <div className="px-2 text-[11px] text-orari-text-secondary">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate);
    const isCurrentDay = isToday(currentDate);

    return (
      <div>
        <div
          className={`mb-4 rounded-lg border p-4 ${
            isCurrentDay ? 'border-orari-primary bg-orari-primary-light/20' : 'border-orari-border'
          }`}
        >
          <div className="text-center">
            <div
              className={`mb-1 text-[13px] font-medium ${isCurrentDay ? 'text-orari-primary' : 'text-orari-text-secondary'}`}
            >
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
  };

  return (
    <div>
      {view === 'Month' && renderMonthView()}
      {view === 'Week' && renderWeekView()}
      {view === 'Day' && renderDayView()}
    </div>
  );
}
