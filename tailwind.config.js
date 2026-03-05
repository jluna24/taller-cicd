/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          orange: '#FF9900',
          dark:   '#232F3E',
          darker: '#0f1117',
          card:   '#1a2233',
          border: '#2a3547',
        },
      },
    },
  },
  plugins: [],
}
