/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a', // Very dark black
        surface: '#121212', // Slightly lighter black for cards
        primary: {
          DEFAULT: '#6d28d9', // Purple 700
          hover: '#5b21b6',
          light: '#8b5cf6',
        },
        secondary: {
          DEFAULT: '#2563eb', // Blue 600
          hover: '#1d4ed8',
          light: '#3b82f6',
        },
        accent: '#f472b6', // Pinkish for alerts
      }
    },
  },
  plugins: [],
}
