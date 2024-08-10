// tailwind.config.js
const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
     extend: {
      height: {
        '16': '80px', // Custom value for h-16
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
  important: true,
};