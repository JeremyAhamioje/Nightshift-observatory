/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#04060a',
        deep: '#07090f',
        space: '#0a0e18',
        panel: 'rgba(8,11,20,0.88)',
        'panel-border': 'rgba(255,255,255,0.07)',
        star: '#f5f8ff',
        moon: '#c8d4e8',
        cloud: '#7a8fa8',
        muted: '#3d5070',
        accent: '#4d9ef7',
        'accent-dim': 'rgba(77,158,247,0.15)',
        warm: '#e8a44a',
        'warm-dim': 'rgba(232,164,74,0.12)',
        red: '#e85c4a',
        green: '#4ae8a4',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
      boxShadow: {
        panel: '0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        glow: '0 0 24px rgba(77,158,247,0.2)',
        'glow-lg': '0 0 60px rgba(77,158,247,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-slower': 'spin 20s linear infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
