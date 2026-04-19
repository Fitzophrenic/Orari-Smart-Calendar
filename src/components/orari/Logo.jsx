import React from 'react';

const iconSizes = {
  small: 'w-8 h-8',
  medium: 'w-10 h-10',
  large: 'w-12 h-12',
};

const textSizes = {
  small: 'text-xl',
  medium: 'text-2xl',
  large: 'text-3xl',
};

function IconPlaceholder({ size }) {
  const labelSize = size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px';
  return (
    <div
      className={`${iconSizes[size]} flex items-center justify-center rounded-lg`}
      style={{ background: 'var(--orari-primary-gradient)' }}
    >
      <span className="font-bold text-white" style={{ fontFamily: 'var(--font-display)', fontSize: labelSize }}>
        O
      </span>
    </div>
  );
}

export default function Logo({ variant = 'full', size = 'medium' }) {
  if (variant === 'icon-only') {
    return <IconPlaceholder size={size} />;
  }

  return (
    <div className="flex items-center gap-3">
      <IconPlaceholder size={size} />
      <span className={`${textSizes[size]} text-orari-primary`} style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        Orari
      </span>
    </div>
  );
}
