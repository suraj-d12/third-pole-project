/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Frozen Cartography type system
        display: ['Fraunces', 'Georgia', 'serif'],   // atlas headings
        sans: ['Inter', 'system-ui', 'sans-serif'],   // body / UI
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'], // captions / data readouts
        heading: ['Outfit', 'sans-serif'],            // legacy (data/blog pages, pre-redesign)
      },
      colors: {
        // ── Void Cartography (strict dark) ──────────────────
        // Same semantic names as the old paper system so every
        // existing class flips to dark without edits.
        paper: {
          DEFAULT: '#000000', // the black canvas
          light: '#0b0e13',   // lifted surfaces
          dim: '#07090d',     // panels / plates
          deep: '#1d2430',    // hairline rules / borders
        },
        ink: {
          DEFAULT: '#edf2f7', // primary text
          soft: '#a9b4c2',    // secondary text
          faint: '#6d7889',   // captions / muted
        },
        glacier: {
          DEFAULT: '#5aa7d6', // structural accent (lifted for black)
          light: '#8cc6e8',
          deep: '#2f6f9d',
          wash: '#0d2334',    // tint fills
        },
        terracotta: {
          DEFAULT: '#d0603f', // alert / loss / danger data ONLY
          light: '#e08663',
          deep: '#a03a20',
        },
        // ── Legacy dark tokens (data/blog pages, retired in Pass 2) ──
        primary: { DEFAULT: '#38bdf8', dark: '#0284c7' },
        secondary: { DEFAULT: '#22d3ee', dark: '#0891b2' },
        dark: { 900: '#0f172a', 800: '#1e293b', 700: '#334155' },
        accent: '#f97316',
      },
      letterSpacing: {
        widest: '0.25em',
      },
      boxShadow: {
        plate: '0 1px 0 rgba(255,255,255,0.05) inset, 0 18px 40px -24px rgba(0,0,0,0.9)',
      },
      backgroundImage: {
        'paper-grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        'draw-line': 'drawLine 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
      },
    },
  },
  plugins: [],
}
