/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Tailwind will scan all .js, .jsx, .ts, .tsx files in the src folder for classes
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#38bdf8', // Light Blue 400
          dark: '#0284c7',    // Light Blue 600
        },
        secondary: {
          DEFAULT: '#22d3ee', // Cyan 400
          dark: '#0891b2',    // Cyan 600
        },
        dark: {
          900: '#0f172a',     // Slate 900
          800: '#1e293b',     // Slate 800
          700: '#334155',     // Slate 700
        },
        accent: '#f97316',    // Orange 500
      },
    },
  },
  plugins: [],
}

