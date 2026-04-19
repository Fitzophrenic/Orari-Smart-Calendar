import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Switch } from './Switch';
import ColorPicker from './ColorPicker';

export default function AddEventModal({ isOpen, onClose, onSave, categories, prefilledDate }) {
  const titleInputRef = useRef(null);

  const [eventData, setEventData] = useState({
    title: '',
    category: categories[0]?.name || '',
    date: prefilledDate || '',
    startTime: '',
    endTime: '',
    notes: '',
    recurring: false,
    recurringFrequency: 'Weekly',
    reminder: false,
    reminderOptions: {
      oneDayBefore: false,
      oneHourBefore: false,
    },
    customColor: categories[0]?.color || '#3AAFA9',
  });

  useEffect(() => {
    const selectedCategory = categories.find((cat) => cat.name === eventData.category);
    if (selectedCategory) {
      setEventData((prev) => ({ ...prev, customColor: selectedCategory.color }));
    }
  }, [eventData.category, categories]);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && prefilledDate) {
      setEventData((prev) => ({ ...prev, date: prefilledDate }));
    }
  }, [isOpen, prefilledDate]);

  useEffect(() => {
    if (eventData.startTime && !eventData.endTime) {
      const [hours, minutes] = eventData.startTime.split(':');
      const endHour = (parseInt(hours, 10) + 1).toString().padStart(2, '0');
      setEventData((prev) => ({ ...prev, endTime: `${endHour}:${minutes}` }));
    }
  }, [eventData.startTime]);

  const isTitleEmpty = eventData.title.trim() === '';

  if (!isOpen) return null;

  const handleSave = () => {
    if (isTitleEmpty) return;
    onSave(eventData);
    onClose();
  };

  return (
    <>
      <div className="orari-modal-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-0">
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-orari-surface shadow-orari-modal">
          <div className="flex items-center justify-between border-b border-orari-border p-6">
            <h3 className="text-[15px] font-semibold text-orari-text-primary">Add Event</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 transition-colors hover:bg-orari-primary-light"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-orari-text-secondary" />
            </button>
          </div>

          <div className="space-y-4 p-6">
            <div>
              <label className="mb-2 block text-[13px] text-orari-text-secondary">Event Title</label>
              <input
                ref={titleInputRef}
                type="text"
                className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] text-orari-text-secondary">Category</label>
              <select
                className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                value={eventData.category}
                onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[13px] text-orari-text-secondary">
                Event Color <span className="text-orari-text-disabled">(Optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <ColorPicker
                  currentColor={eventData.customColor}
                  onColorChange={(newColor) => setEventData({ ...eventData, customColor: newColor })}
                  size="lg"
                />
                <span className="text-[13px] text-orari-text-secondary">Customize event color or use category default</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] text-orari-text-secondary">Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[13px] text-orari-text-secondary">Start Time</label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                  value={eventData.startTime}
                  onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] text-orari-text-secondary">End Time</label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                  value={eventData.endTime}
                  onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] text-orari-text-secondary">
                Notes <span className="text-orari-text-disabled">(Optional)</span>
              </label>
              <textarea
                className="w-full resize-none rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                rows={3}
                value={eventData.notes}
                onChange={(e) => setEventData({ ...eventData, notes: e.target.value })}
                placeholder="Add any additional details"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg p-4 transition-colors">
                <span className="text-[15px] text-orari-text-primary">Recurring Event</span>
                <Switch
                  checked={eventData.recurring}
                  onCheckedChange={(checked) => setEventData({ ...eventData, recurring: checked })}
                />
              </div>

              {eventData.recurring && (
                <div className="pl-4">
                  <select
                    className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                    value={eventData.recurringFrequency}
                    onChange={(e) => setEventData({ ...eventData, recurringFrequency: e.target.value })}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg p-4 transition-colors">
                <span className="text-[15px] text-orari-text-primary">Set Reminder</span>
                <Switch
                  checked={eventData.reminder}
                  onCheckedChange={(checked) => setEventData({ ...eventData, reminder: checked })}
                />
              </div>

              {eventData.reminder && (
                <div className="space-y-2 pl-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={eventData.reminderOptions.oneDayBefore}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          reminderOptions: { ...eventData.reminderOptions, oneDayBefore: e.target.checked },
                        })
                      }
                      className="h-4 w-4 rounded border-orari-border text-orari-primary focus:ring-orari-primary"
                    />
                    <span className="text-[13px] text-orari-text-primary">1 day before</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={eventData.reminderOptions.oneHourBefore}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          reminderOptions: { ...eventData.reminderOptions, oneHourBefore: e.target.checked },
                        })
                      }
                      className="h-4 w-4 rounded border-orari-border text-orari-primary focus:ring-orari-primary"
                    />
                    <span className="text-[13px] text-orari-text-primary">1 hour before</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-orari-border p-6">
            <div className="mb-2 flex gap-3">
              <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" type="button" onClick={handleSave} disabled={isTitleEmpty}>
                Save Event
              </Button>
            </div>
            {isTitleEmpty && (
              <p className="mt-2 text-center text-[13px] text-orari-text-secondary">Add a title to save</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
