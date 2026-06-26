/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          blue: '#00B8FF',
          'blue-dim': '#0090CC',
          yellow: '#FFD400',
          'yellow-dim': '#C9A800',
          purple: '#A855F7',
          'purple-dim': '#8B45D9',
          black: '#050505',
          surface: '#0C0C0C',
          card: '#111111',
          border: 'rgba(255,255,255,0.08)',
          muted: '#8A8A96',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 24px rgba(0, 184, 255, 0.25)',
        'glow-blue-lg': '0 0 36px rgba(0, 184, 255, 0.35), 0 0 64px rgba(0, 184, 255, 0.12)',
        'glow-yellow': '0 0 24px rgba(255, 212, 0, 0.2)',
        'glow-yellow-lg': '0 0 36px rgba(255, 212, 0, 0.3), 0 0 64px rgba(255, 212, 0, 0.1)',
        'glow-purple': '0 0 24px rgba(168, 85, 247, 0.28)',
        brutal: '4px 4px 0 rgba(0, 184, 255, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'glow-breathe-blue': {
          '0%, 100%': {
            boxShadow:
              '0 0 12px rgba(0, 184, 255, 0.15), inset 0 0 12px rgba(0, 184, 255, 0.04)',
          },
          '50%': {
            boxShadow:
              '0 0 28px rgba(0, 184, 255, 0.28), inset 0 0 20px rgba(0, 184, 255, 0.06)',
          },
        },
        'glow-breathe-yellow': {
          '0%, 100%': {
            boxShadow: '0 0 12px rgba(255, 212, 0, 0.12)',
          },
          '50%': {
            boxShadow: '0 0 26px rgba(255, 212, 0, 0.26)',
          },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left': 'slide-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slide-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        blink: 'blink 1.4s ease-in-out infinite',
        'glow-breathe-blue': 'glow-breathe-blue 4s ease-in-out infinite',
        'glow-breathe-yellow': 'glow-breathe-yellow 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
