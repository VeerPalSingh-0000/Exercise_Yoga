// tailwind.config.js
export default {
  darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        screens: {
        'xs': '475px',
      },
      },
    },
    plugins: [],
  }
  