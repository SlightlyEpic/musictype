/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/*.{vue,js,ts,jsx,tsx}',
    './public/**/*.{vue,js,ts,jsx,tsx}',
    './public/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        agave: ['agave'],
        barlow: ['barlow']
      },
      colors: {
        't-darkest': '#071A26',
        't-darker': '#1B4859',
        't-dark': '#346773',
        't-light': '#6A9BA6',
        't-lightest': '#B0D1D9'
      },
      boxShadow: {
        'lbar': '0 0.25rem 0 0 #6A9BA6'
      }
    },
  },
  plugins: [],
}
