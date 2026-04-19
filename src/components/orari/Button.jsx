import React from 'react';

const baseStyles =
  'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orari-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-orari-primary text-white hover:bg-orari-primary/90',
  secondary: 'bg-white border border-orari-primary text-orari-primary hover:bg-orari-primary-light',
  accent: 'bg-orari-accent text-white hover:bg-orari-accent/90',
  ghost: 'bg-transparent text-orari-text-secondary hover:bg-orari-primary-light/50',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-6',
  lg: 'h-12 px-8',
};

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'primary', size = 'md', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});
