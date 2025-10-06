/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'horror-tarot-header',
    'horror-tarot-title',
    'header-subtitle',
    'header-icons',
    'audio-control-corner',
    'button-row-spaced',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
