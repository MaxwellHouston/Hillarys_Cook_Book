/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      'mui-sm': '600px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        poppins: 'Poppins',
      },
    },
  },
  plugins: [],
}
