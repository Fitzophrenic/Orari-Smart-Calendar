/** @type {import('tailwindcss').Config} */
/** Tokens mirror Figma Make `src/styles/theme.css` (High-Fidelity UI Design). */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orari: {
          primary: '#3AAFA9',
          'primary-light': '#E8F5F7',
          accent: '#6BAF8D',
          warning: '#E8A838',
          danger: '#D95F5F',
          background: '#F9F8F6',
          surface: '#FFFFFF',
          border: '#E4E2DE',
          'text-primary': '#1A1A2E',
          'text-secondary': '#6B6B80',
          'text-disabled': '#B0AFBB',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        caption: ['11px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      borderRadius: {
        'orari-card': '12px',
        'orari-input': '8px',
        lg: '0.75rem',
      },
      boxShadow: {
        'orari-card': '0px 2px 8px rgba(0, 0, 0, 0.06)',
        'orari-modal': '0px 8px 32px rgba(0, 0, 0, 0.12)',
        'orari-popover': '0px 4px 16px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        'orari-web-margin': '40px',
        'orari-mobile-margin': '24px',
        'orari-card-padding': '20px',
        'orari-element-gap': '16px',
        'orari-sidebar': '240px',
        'orari-topbar': '64px',
        'orari-bottomnav': '64px',
      },
      letterSpacing: {
        'orari-wide': '0.025em',
      },
    },
  },
  plugins: [],
};
