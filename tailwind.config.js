const colors = require('tailwindcss/colors')

module.exports = {
  prefix: '',
  // purge: {
  //   enabled: true,
  //   content: [
  //     './src/**/*.{html,ts}',
  //   ]
  // },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'blue-gray': colors.blueGray,
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
