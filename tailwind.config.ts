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
        // OS Dark Theme
        os: {
          bg: '#07070f',
          surface: '#0d0d1a',
          card: '#11111f',
          border: '#1a1a2e',
          borderLight: '#252540',
          accent: '#6366f1',
          accentDim: '#4f46e5',
          accentGlow: 'rgba(99,102,241,0.15)',
          success: '#10b981',
          successDim: 'rgba(16,185,129,0.15)',
          warning: '#f59e0b',
          warningDim: 'rgba(245,158,11,0.15)',
          danger: '#ef4444',
          dangerDim: 'rgba(239,68,68,0.15)',
          muted: '#94a3b8',
          text: '#e2e8f0',
          textDim: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(99,102,241,0.2)',
        'glow-success': '0 0 20px rgba(16,185,129,0.2)',
        'glow-danger': '0 0 20px rgba(239,68,68,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
