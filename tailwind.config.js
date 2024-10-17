/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      light: {
        background: '#ffffff',
        text: '#333333'
        // ... other light mode colors
      },
      dark: {
        background: '#151515',
        text: '#ffffff'
        // ... other dark mode colors
      },
      primary: '#00B152'
    },
    extend: {}
  },
  plugins: []
};
