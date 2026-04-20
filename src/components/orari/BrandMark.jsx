import React from 'react';
import logoStartup from '../../assets/logo.png';
import logoOnBackground from '../../assets/logo-on-background.png';

/**
 * App logo — plain `<img>`, no blend/filter or mix-blend (avoids dark “box” artifacts on bars).
 * `default`: `logo.png` — Get Started (`/`) only.
 * `onBackground`: `logo-on-background.png` — Sign-In, Sign-Up, and dashboard marks.
 */
export function BrandMark({ className = '', alt = 'Orari', variant = 'default' }) {
  const src = variant === 'onBackground' ? logoOnBackground : logoStartup;
  return (
    <img
      src={src}
      alt={alt}
      width={256}
      height={256}
      decoding="async"
      className={`block h-auto w-auto object-contain ${className}`}
    />
  );
}
