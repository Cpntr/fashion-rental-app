/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: { fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } } },
      animation: { fadeIn: 'fadeIn 0.4s ease-out' },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        kenburns: 'kenburns 8s ease-in-out forwards',
        pulseHeart: 'pulseHeart 0.6s ease-in-out',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseHeart: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
