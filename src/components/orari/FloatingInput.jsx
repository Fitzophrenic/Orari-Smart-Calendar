import React, { useEffect, useState } from 'react';

/** Figma `Input.tsx` — floating label, pt-6 pb-2 when labeled */
export function FloatingInput({ label, type = 'text', className = '', onChange, value, ...rest }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));

  useEffect(() => {
    setHasValue(Boolean(value));
  }, [value]);

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          className={`pointer-events-none absolute left-4 transition-all ${
            isFocused || hasValue ? 'top-2 text-xs text-orari-primary' : 'top-1/2 -translate-y-1/2 text-sm text-orari-text-secondary'
          }`}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        className={`w-full rounded-lg border border-orari-border bg-white text-[15px] text-orari-text-primary focus:border-orari-primary focus:outline-none focus:ring-2 focus:ring-orari-primary ${
          label ? 'px-4 pb-2 pt-6' : 'px-4 py-3'
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== '');
        }}
        onChange={(e) => {
          setHasValue(e.target.value !== '');
          onChange?.(e);
        }}
        {...rest}
      />
    </div>
  );
}
