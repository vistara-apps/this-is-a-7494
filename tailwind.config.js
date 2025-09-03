/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(225 10% 95%)',
        accent: 'hsl(175 80% 45%)',
        primary: 'hsl(220 80% 50%)',
        surface: 'hsl(0 0% 100%)',
        'text-primary': 'hsl(220 20% 20%)',
        'text-secondary': 'hsl(220 10% 40%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0 0% 0% / 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 350ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}