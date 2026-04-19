import React from 'react';

const THUMB_TRAVEL = '1rem';

export function Switch({ checked, onCheckedChange, className = '', ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orari-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-orari-primary' : 'bg-orari-text-disabled/30'
      } ${className}`}
      {...props}
    >
      <span
        className="pointer-events-none absolute left-[2px] top-1/2 h-4 w-4 rounded-full bg-white shadow-lg transition-transform duration-200 ease-out"
        style={{
          transform: checked ? `translate(${THUMB_TRAVEL}, -50%)` : 'translate(0, -50%)',
        }}
      />
    </button>
  );
}
