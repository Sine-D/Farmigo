/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-wheel': {
          '0%': { opacity: '1', top: '6px' },
          '100%': { opacity: '0', top: '20px' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'scroll-wheel': 'scroll-wheel 2s infinite',
      }
    },
  },
  plugins: [],
}
