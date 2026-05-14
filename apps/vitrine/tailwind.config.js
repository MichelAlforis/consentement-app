/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        oui: {
          bg: '#0d0714',
          card: '#1a1128',
          'card-hover': '#221436',
          border: '#2e1f46',
          violet: '#8b5cf6',
          'violet-light': '#a78bfa',
          pink: '#ec4899',
          'text': '#f8fafc',
          muted: '#94a3b8',
          subtle: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(139, 92, 246, 0.08)',
        'card-hover': '0 8px 40px rgba(139, 92, 246, 0.18)',
        'violet': '0 0 60px rgba(139, 92, 246, 0.25)',
        'pink': '0 0 60px rgba(236, 72, 153, 0.2)',
        'phone': '0 30px 90px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.15)',
      },
    },
  },
  plugins: [],
};
