import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import Logo from '../components/orari/Logo';
import CalendarGrid from '../components/orari/CalendarGrid';
import AddEventModal from '../components/orari/AddEventModal';
import EventDetailsModal from '../components/orari/EventDetailsModal';
import { Button } from '../components/orari/Button';
import { useAppData } from '../context/AppDataContext';

/** Figma `Dashboard` — top bar: mobile logo | month | tabs + search + Add Event (right) */
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('Month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [prefilledDate, setPrefilledDate] = useState('');

  const { calendars, events, appendEvent, updateEvent, deleteEvent } = useAppData();

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const calendar = calendars.find((c) => c.name === event.category);
        return calendar?.enabled;
      }),
    [events, calendars],
  );

  const handleSaveEvent = (eventData) => {
    const category = calendars.find((c) => c.name === eventData.category);
    const newEvent = {
      id: Date.now().toString(),
      title: eventData.title,
      category: eventData.category,
      color: eventData.customColor || category?.color || '#3AAFA9',
      date: new Date(eventData.date),
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      notes: eventData.notes,
      recurring: eventData.recurring,
      recurringFrequency: eventData.recurringFrequency,
      customColor: eventData.customColor,
    };
    appendEvent(newEvent);
  };

  const openAddModal = (dateStr) => {
    setPrefilledDate(dateStr || '');
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-3 border-b border-orari-border bg-orari-surface px-4 lg:px-8">
        <div className="flex w-10 shrink-0 items-center lg:pointer-events-none lg:w-0 lg:min-w-0 lg:opacity-0">
          <div className="lg:hidden">
            <Logo variant="icon-only" size="small" />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="rounded-lg p-2 transition-colors hover:bg-orari-primary-light"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-orari-text-secondary" />
          </button>
          <h2 className="min-w-[140px] text-center font-semibold text-orari-text-primary">{format(currentDate, 'MMMM yyyy')}</h2>
          <button
            type="button"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="rounded-lg p-2 transition-colors hover:bg-orari-primary-light"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-orari-text-secondary" />
          </button>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-3">
          <div className="flex rounded-lg bg-orari-primary-light/50 p-1">
            {['Month', 'Week', 'Day'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors lg:px-4 ${
                  view === v
                    ? 'bg-orari-primary-light text-orari-primary'
                    : 'text-orari-text-secondary hover:text-orari-primary'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-orari-border bg-orari-background px-3 py-2 lg:flex">
            <Search className="h-4 w-4 text-orari-text-secondary" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-40 border-none bg-transparent text-sm text-orari-text-primary outline-none placeholder:text-orari-text-disabled"
            />
          </div>

          <Button variant="primary" size="md" type="button" className="inline-flex shrink-0 items-center gap-2" onClick={() => openAddModal('')}>
            <Plus className="hidden h-4 w-4 lg:inline" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="p-4 pb-20 lg:p-8 lg:pb-8">
        <CalendarGrid
          currentDate={currentDate}
          events={filteredEvents}
          onDateClick={(date) => {
            setCurrentDate(date);
            openAddModal(format(date, 'yyyy-MM-dd'));
          }}
          onEventClick={(event) => {
            setSelectedEvent(event);
            setIsEventDetailsModalOpen(true);
          }}
        />
      </div>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPrefilledDate('');
        }}
        onSave={handleSaveEvent}
        categories={calendars.map((c) => ({ name: c.name, color: c.color }))}
        prefilledDate={prefilledDate}
      />

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
