/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-background)',
        card: 'var(--bg-card)',
        border: 'var(--border-color)',
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
        },
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
