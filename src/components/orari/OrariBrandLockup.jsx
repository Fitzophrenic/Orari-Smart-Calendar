import React from 'react';
import { BrandMark } from './BrandMark';

const montserrat = { fontFamily: 'var(--font-brand-title)' };

/**
 * Startup / auth: logo + “Orari” + “RECLAIM YOUR TIME.” (Montserrat 700).
 * `compact` + hub classes enable `.orari-landing-root` / `.orari-signup-root` / `.orari-login-root` short-height scaling in CSS.
 * `logoVariant="onBackground"` uses the sign-in / dashboard mark (`logo-on-background.png`).
 * `logoInWhiteBadge`: wraps only the mark in `bg-white` + rounded padding (Sign-In card) to match the asset canvas.
 */
export function OrariBrandLockup({
  className = '',
  logoClassName = '',
  compact = false,
  logoVariant = 'default',
  logoInWhiteBadge = false,
}) {
  const hub = compact;

  const logoSizeClasses = logoInWhiteBadge
    ? compact
      ? 'w-52 max-h-[7.5rem] sm:w-56 sm:max-h-[8.25rem]'
      : 'w-48 max-h-[7rem] sm:w-52 sm:max-h-[8rem]'
    : compact
      ? 'w-56 max-h-[8.5rem] sm:w-64 sm:max-h-[9.5rem]'
      : 'w-64 sm:w-72';

  const mark = (
    <BrandMark
      variant={logoVariant}
      className={`max-w-full object-contain ${logoSizeClasses} ${logoClassName}`}
    />
  );

  const logoBlock = logoInWhiteBadge ? (
    <div className="orari-brand-logo-badge rounded-2xl bg-[#ffffff] p-4">{mark}</div>
  ) : (
    mark
  );

  const titleMargin = compact
    ? logoInWhiteBadge
      ? 'orari-brand-title-orari mt-1 text-6xl leading-[0.98] sm:text-6xl'
      : 'orari-brand-title-orari -mt-1 text-5xl leading-[1.05] sm:mt-0 sm:text-6xl'
    : 'mt-4 text-4xl sm:text-5xl';

  const subtitleMargin = compact
    ? logoInWhiteBadge
      ? 'orari-brand-subtitle mt-0.5 text-xl tracking-[0.1em] sm:text-xl'
      : 'orari-brand-subtitle mt-1 text-lg tracking-[0.12em] sm:text-xl'
    : logoInWhiteBadge
      ? 'mt-2 text-base tracking-[0.18em] sm:text-lg'
      : 'mt-2 text-base tracking-[0.18em] sm:text-lg';

  return (
    <div
      className={`flex w-full flex-col items-center text-center ${
        hub ? 'orari-brand-hub shrink-0' : 'justify-center'
      } ${className}`}
    >
      {logoBlock}
      <p className={`font-bold text-orari-text-primary ${titleMargin}`} style={{ ...montserrat, fontWeight: 700 }}>
        Orari
      </p>
      <p
        className={`w-full font-bold uppercase text-orari-text-secondary ${subtitleMargin}`}
        style={{ ...montserrat, fontWeight: 700 }}
      >
        RECLAIM YOUR TIME.
      </p>
    </div>
  );
}
