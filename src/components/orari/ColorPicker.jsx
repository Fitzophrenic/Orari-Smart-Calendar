import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

const PRESET_COLORS = [
  '#3AAFA9',
  '#4A6FA5',
  '#E8A838',
  '#6BAF8D',
  '#D95F5F',
  '#9B59B6',
  '#E67E22',
  '#1ABC9C',
  '#2ECC71',
  '#F39C12',
  '#E74C3C',
  '#3498DB',
  '#95A5A6',
  '#34495E',
  '#E91E63',
  '#00BCD4',
];

export default function ColorPicker({ currentColor, onColorChange, size = 'md' }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const handleColorSelect = (color) => {
    onColorChange(color);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`${sizeClasses[size]} cursor-pointer rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110`}
        style={{ backgroundColor: currentColor }}
        aria-label="Change color"
      />

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-max rounded-xl border border-orari-border bg-orari-surface p-3 shadow-orari-popover">
          <div className="grid w-40 grid-cols-4 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorSelect(color);
                }}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border-2 border-transparent transition-all hover:border-orari-primary"
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              >
                {currentColor === color && <Check className="h-4 w-4 text-white drop-shadow-md" strokeWidth={3} />}
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-orari-border pt-3">
            <label className="mb-1.5 block text-[11px] text-orari-text-secondary">Custom Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => {
                  e.stopPropagation();
                  onColorChange(e.target.value);
                }}
                className="h-8 w-8 cursor-pointer rounded border border-orari-border"
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => {
                  e.stopPropagation();
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    onColorChange(value);
                  }
                }}
                className="flex-1 rounded border border-orari-border px-2 py-1 text-[11px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
                placeholder="#3AAFA9"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
