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
        // ── Frozen Cartography ──────────────────────────────
        paper: {
          DEFAULT: '#f4f1ea', // warm printed paper
          light: '#faf8f3',
          dim: '#eae4d8',     // panels / plates
          deep: '#ded5c3',    // hairline rules / borders
        },
        ink: {
          DEFAULT: '#1a2230', // primary text
          soft: '#414b5c',    // secondary text
          faint: '#767f90',   // captions / muted
        },
        glacier: {
          DEFAULT: '#1f5f8b', // structural accent
          light: '#4a90b8',
          deep: '#123f5e',
          wash: '#dce7ef',    // tint fills
        },
        terracotta: {
          DEFAULT: '#b5462f', // alert / loss / danger data ONLY
          light: '#cd6a52',
          deep: '#8a3220',
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
        plate: '0 1px 0 rgba(255,255,255,0.6) inset, 0 18px 40px -24px rgba(26,34,48,0.45)',
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
