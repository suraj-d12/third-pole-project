/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Tailwind will scan all .js, .jsx, .ts, .tsx files in the src folder for classes
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',  // Customize or add colors
        secondary: '#14171A',
      },
      spacing: {
        '128': '32rem',      // Add custom spacing
      },
      borderRadius: {
        '4xl': '2rem',       // Add custom border radius
      },
    },
  },
  plugins: [],
}

