import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // JARVIS Dark Theme
        os: {
          bg:           '#050B16',
          surface:      '#081222',
          card:         '#0C1828',
          border:       '#112035',
          borderLight:  '#1A3050',
          accent:       '#00C7D6',   // cyan primario
          accentDim:    '#009EAA',
          accentGlow:   'rgba(0,199,214,0.12)',
          gold:         '#D4AF37',   // solo logros/hitos
          goldDim:      'rgba(212,175,55,0.12)',
          success:      '#22c55e',
          successDim:   'rgba(34,197,94,0.12)',
          warning:      '#f59e0b',
          warningDim:   'rgba(245,158,11,0.12)',
          danger:       '#ef4444',
          dangerDim:    'rgba(239,68,68,0.12)',
          muted:        '#7E93B5',
          text:         '#EEF3F9',
          textDim:      '#48587A',
        }
      },
      fontFamily: {
        sans:   ['Inter', 'system-ui', 'sans-serif'],
        serif:  ['Fraunces', 'Georgia', 'serif'],
        mono:   ['Fragment Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-accent':  '0 0 20px rgba(0,199,214,0.25)',
        'glow-gold':    '0 0 20px rgba(212,175,55,0.25)',
        'glow-success': '0 0 20px rgba(34,197,94,0.2)',
        'glow-danger':  '0 0 20px rgba(239,68,68,0.2)',
        'card':         '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover':   '0 8px 32px rgba(0,0,0,0.7)',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':      'fadeIn 0.3s ease-in-out',
        'slide-in':     'slideIn 0.3s ease-out',
        'pulse-gold':   'pulseGold 2s ease-in-out infinite',
        'shimmer':      'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0)', opacity: '1' },
          '50%':      { boxShadow: '0 0 16px 4px rgba(212,175,55,0.4)', opacity: '0.9' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
