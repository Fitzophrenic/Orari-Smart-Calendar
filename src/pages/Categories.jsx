import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import Logo from '../components/orari/Logo';
import { Switch } from '../components/orari/Switch';
import { Button } from '../components/orari/Button';
import ColorPicker from '../components/orari/ColorPicker';

const handleFilter = () => {};

/** Figma `Categories.tsx` — shell (sidebar / bottom nav) provided by `OrariAppLayout` */
export default function Categories() {
  const [calendars, setCalendars] = useState([
    {
      name: 'Academic',
      color: '#4A6FA5',
      enabled: true,
      eventCount: 12,
      subcategories: [
        { name: 'Classes', enabled: true, eventCount: 8 },
        { name: 'Club Meetings', enabled: true, eventCount: 4 },
      ],
    },
    { name: 'Work', color: '#E8A838', enabled: true, eventCount: 4 },
    {
      name: 'Fitness',
      color: '#6BAF8D',
      enabled: true,
      eventCount: 8,
      subcategories: [
        { name: 'Fitness Schedule', enabled: true, eventCount: 5 },
        { name: 'Training Sessions', enabled: true, eventCount: 3 },
      ],
    },
    { name: 'Social', color: '#D95F5F', enabled: true, eventCount: 6 },
    { name: 'Personal', color: '#3AAFA9', enabled: true, eventCount: 3 },
  ]);

  const [expandedCategories, setExpandedCategories] = useState(() => new Set([0, 2]));
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [deletingSubcategory, setDeletingSubcategory] = useState(null);
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const toggleExpand = (index) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleCalendar = (index) => {
    const updated = [...calendars];
    updated[index].enabled = !updated[index].enabled;
    setCalendars(updated);
  };

  const toggleSubcategory = (categoryIndex, subIndex) => {
    const updated = [...calendars];
    if (updated[categoryIndex].subcategories) {
      updated[categoryIndex].subcategories[subIndex].enabled = !updated[categoryIndex].subcategories[subIndex].enabled;
      setCalendars(updated);
    }
  };

  const handleAddCategory = () => {
    handleFilter();
    if (newCategoryName.trim()) {
      const colors = ['#4A6FA5', '#E8A838', '#6BAF8D', '#D95F5F', '#3AAFA9'];
      const newCategory = {
        name: newCategoryName,
        color: colors[Math.floor(Math.random() * colors.length)],
        enabled: true,
        eventCount: 0,
      };
      setCalendars([...calendars, newCategory]);
      setNewCategoryName('');
      setIsAdding(false);
    }
  };

  const handleAddSubcategory = (categoryIndex) => {
    handleFilter();
    if (newSubcategoryName.trim()) {
      const updated = [...calendars];
      if (!updated[categoryIndex].subcategories) {
        updated[categoryIndex].subcategories = [];
      }
      updated[categoryIndex].subcategories.push({
        name: newSubcategoryName,
        enabled: true,
        eventCount: 0,
      });
      setCalendars(updated);
      setNewSubcategoryName('');
      setAddingSubcategoryTo(null);
    }
  };

  const handleDeleteCategory = (index) => {
    const updated = calendars.filter((_, i) => i !== index);
    setCalendars(updated);
    setDeletingIndex(null);
  };

  const handleDeleteSubcategory = (categoryIndex, subIndex) => {
    const updated = [...calendars];
    const deletedSubcategory = updated[categoryIndex].subcategories[subIndex];
    updated[categoryIndex].subcategories = updated[categoryIndex].subcategories.filter((_, i) => i !== subIndex);
    updated[categoryIndex].eventCount -= deletedSubcategory.eventCount;
    setCalendars(updated);
    setDeletingSubcategory(null);
  };

  const handleCategoryColorChange = (index, newColor) => {
    handleFilter();
    const updated = [...calendars];
    updated[index].color = newColor;
    setCalendars(updated);
  };

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-orari-border bg-orari-surface px-4 lg:hidden">
        <Logo variant="icon-only" size="small" />
        <h2 className="font-semibold text-orari-text-primary">Categories</h2>
        <div className="w-8" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-4xl p-6 pb-24 lg:p-10 lg:pb-10">
        <h1 className="mb-8">My Calendars</h1>

        <div className="divide-y divide-orari-border rounded-xl bg-orari-surface shadow-orari-card">
          {calendars.map((calendar, index) => (
            <div key={index}>
              {deletingIndex === index ? (
                <div className="bg-orari-danger/5 p-5">
                  <p className="mb-3 text-[15px] text-orari-text-primary">
                    This will move {calendar.eventCount} event{calendar.eventCount !== 1 ? 's' : ''} to Uncategorized. Continue?
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="sm" type="button" onClick={() => setDeletingIndex(null)}>
                      Cancel
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(index)}
                      className="h-9 rounded-lg bg-orari-danger px-4 text-[13px] font-medium text-white transition-colors hover:bg-orari-danger/90"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="group flex items-center justify-between p-5 transition-colors hover:bg-orari-primary-light/20">
                    <div className="flex flex-1 items-center gap-4">
                      {calendar.subcategories && calendar.subcategories.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => toggleExpand(index)}
                          className="rounded p-1 transition-colors hover:bg-orari-primary-light"
                          aria-label={expandedCategories.has(index) ? 'Collapse' : 'Expand'}
                        >
                          {expandedCategories.has(index) ? (
                            <ChevronDown className="h-4 w-4 text-orari-text-secondary" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-orari-text-secondary" />
                          )}
                        </button>
                      ) : (
                        <div className="w-6" aria-hidden="true" />
                      )}
                      <ColorPicker
                        currentColor={calendar.color}
                        onColorChange={(newColor) => handleCategoryColorChange(index, newColor)}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="text-[15px] text-orari-text-primary">{calendar.name}</div>
                        <div className="text-[13px] text-orari-text-secondary">
                          {calendar.eventCount} event{calendar.eventCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {calendar.subcategories && calendar.subcategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setAddingSubcategoryTo(index)}
                          className="rounded-lg p-2 opacity-0 transition-all hover:bg-orari-primary-light group-hover:opacity-100"
                          aria-label="Add subcategory"
                        >
                          <Plus className="h-4 w-4 text-orari-primary" />
                        </button>
                      )}
                      <button
                        type="button"
                        className="rounded-lg p-2 opacity-0 transition-all hover:bg-orari-primary-light group-hover:opacity-100"
                        onClick={() => setDeletingIndex(index)}
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-4 w-4 text-orari-danger" />
                      </button>
                      <Switch checked={calendar.enabled} onCheckedChange={() => toggleCalendar(index)} />
                    </div>
                  </div>

                  {calendar.subcategories && expandedCategories.has(index) && (
                    <div className="bg-orari-background/50">
                      {calendar.subcategories.map((subcategory, subIndex) => (
                        <div key={subIndex}>
                          {deletingSubcategory?.categoryIndex === index && deletingSubcategory?.subIndex === subIndex ? (
                            <div className="ml-10 border-l-2 border-orari-primary/20 bg-orari-danger/5 px-5 py-3">
                              <p className="mb-2 text-[13px] text-orari-text-primary">
                                This will move {subcategory.eventCount} event{subcategory.eventCount !== 1 ? 's' : ''} to{' '}
                                {calendar.name}. Continue?
                              </p>
                              <div className="flex gap-2">
                                <Button variant="secondary" size="sm" type="button" onClick={() => setDeletingSubcategory(null)}>
                                  Cancel
                                </Button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubcategory(index, subIndex)}
                                  className="h-8 rounded-lg bg-orari-danger px-3 text-[13px] font-medium text-white transition-colors hover:bg-orari-danger/90"
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="group/sub ml-10 flex items-center justify-between border-l-2 border-orari-primary/20 px-5 py-3 transition-colors hover:bg-orari-primary-light/10">
                              <div className="flex flex-1 items-center gap-3">
                                <ColorPicker
                                  currentColor={calendar.color}
                                  onColorChange={(newColor) => handleCategoryColorChange(index, newColor)}
                                  size="sm"
                                />
                                <div className="flex-1">
                                  <div className="text-[13px] text-orari-text-primary">{subcategory.name}</div>
                                  <div className="text-[11px] text-orari-text-secondary">
                                    {subcategory.eventCount} event{subcategory.eventCount !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-lg p-1.5 opacity-0 transition-all hover:bg-orari-primary-light group-hover/sub:opacity-100"
                                  onClick={() => setDeletingSubcategory({ categoryIndex: index, subIndex })}
                                  aria-label="Delete subcategory"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-orari-danger" />
                                </button>
                                <Switch
                                  checked={subcategory.enabled}
                                  onCheckedChange={() => toggleSubcategory(index, subIndex)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {addingSubcategoryTo === index && (
                        <div className="ml-10 flex items-center gap-2 border-l-2 border-orari-primary/20 bg-orari-primary-light/10 px-5 py-3">
                          <input
                            type="text"
                            placeholder="Subcategory name"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            className="flex-1 rounded-lg border border-orari-border bg-white px-3 py-1.5 text-[13px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddSubcategory(index);
                              if (e.key === 'Escape') setAddingSubcategoryTo(null);
                            }}
                            autoFocus
                          />
                          <Button variant="primary" size="sm" type="button" onClick={() => handleAddSubcategory(index)}>
                            Add
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => {
                              setAddingSubcategoryTo(null);
                              setNewSubcategoryName('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3">
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orari-border bg-orari-surface p-5 font-medium text-orari-text-secondary transition-all hover:border-orari-primary hover:bg-orari-primary-light/30 hover:text-orari-primary"
            >
              <Plus className="h-5 w-5" />
              <span className="text-[13px]">Add new category</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-orari-surface p-5 shadow-orari-card">
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 rounded-lg border border-orari-border bg-white px-4 py-2 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                  if (e.key === 'Escape') setIsAdding(false);
                }}
                autoFocus
              />
              <Button variant="primary" size="sm" type="button" onClick={handleAddCategory}>
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategoryName('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
