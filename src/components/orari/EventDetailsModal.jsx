import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Tag, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './Button';
import ColorPicker from './ColorPicker';

export default function EventDetailsModal({ isOpen, onClose, event, onUpdate, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) setShowDeleteConfirm(false);
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const handleColorChange = (newColor) => {
    onUpdate(event.id, { color: newColor, customColor: newColor });
  };

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  return (
    <>
      <div className="orari-modal-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-0">
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-orari-surface shadow-orari-modal">
          <div className="flex items-center justify-between border-b border-orari-border p-6">
            <h3 className="text-[15px] font-semibold text-orari-text-primary">Event Details</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 transition-colors hover:bg-orari-primary-light"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-orari-text-secondary" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <div className="flex items-start gap-3">
                <div className="h-16 w-1 shrink-0 rounded-full" style={{ backgroundColor: event.customColor || event.color }} />
                <div className="flex-1">
                  <h2 className="mb-1 text-orari-text-primary">{event.title}</h2>
                  <div className="flex items-center gap-2 text-[13px] text-orari-text-secondary">
                    <Tag className="h-3.5 w-3.5" />
                    <span>{event.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-orari-text-secondary" />
                <div>
                  <p className="mb-0.5 text-[13px] text-orari-text-secondary">Date</p>
                  <p className="text-[15px] text-orari-text-primary">{format(event.date, 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>

              {(event.startTime || event.endTime) && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-orari-text-secondary" />
                  <div>
                    <p className="mb-0.5 text-[13px] text-orari-text-secondary">Time</p>
                    <p className="text-[15px] text-orari-text-primary">
                      {event.startTime || '--:--'} - {event.endTime || '--:--'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {event.notes && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-orari-text-secondary" />
                <div className="flex-1">
                  <p className="mb-1 text-[13px] text-orari-text-secondary">Notes</p>
                  <p className="whitespace-pre-wrap text-[15px] text-orari-text-primary">{event.notes}</p>
                </div>
              </div>
            )}

            {event.recurring && (
              <div className="rounded-lg bg-orari-primary-light/20 p-3">
                <p className="text-[13px] text-orari-text-primary">
                  Repeats {event.recurringFrequency?.toLowerCase() || 'weekly'}
                </p>
              </div>
            )}

            <div className="border-t border-orari-border pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-[13px] text-orari-text-secondary">Event Color</p>
                  <p className="text-[11px] text-orari-text-disabled">Customize the color for this event</p>
                </div>
                <ColorPicker currentColor={event.customColor || event.color} onColorChange={handleColorChange} size="lg" />
              </div>
            </div>
          </div>

          <div className="border-t border-orari-border p-6">
            {showDeleteConfirm ? (
              <div className="space-y-3">
                <p className="text-[15px] text-orari-text-primary">Are you sure you want to delete this event?</p>
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" type="button" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="h-10 flex-1 rounded-lg bg-orari-danger px-4 text-[13px] font-medium text-white transition-colors hover:bg-orari-danger/90"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" type="button" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
