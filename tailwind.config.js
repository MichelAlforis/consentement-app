/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette principale
        rose: {
          50: '#fef6f0',
          100: '#fdf2f8',
          200: '#fce7f3',
          300: '#f8a5c2',
          400: '#f78fb3',
          500: '#ec4899',
        },
        violet: {
          300: '#c4b5fd',
          400: '#a29bfe',
          500: '#8b5cf6',
          600: '#6c5ce7',
        },
        // Niveaux de confort
        comfort: {
          no: '#e74c3c',
          later: '#e67e22',
          curious: '#f1c40f',
          ok: '#2ecc71',
          love: '#9b59b6',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(248, 165, 194, 0.3)',
        'glow-violet': '0 0 40px rgba(162, 155, 254, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'phone': '0 25px 80px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
