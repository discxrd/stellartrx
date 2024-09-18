/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'background': 'rgba(0, 0, 0, 0)',
      'container': '#0E0E10',
      'foreground': '#ECEDEE',
      'primary-30': '#36234A',
      'error': '#F31260',
      'success': '#17C964',

      'primary': '#F9F9F9',
      'on-primary': '#292929',
    
      'secondary': '#9353D3',
      'on-secondary': '#ECEDEE'
    },
    extend: {},
  },
  plugins: [],
}