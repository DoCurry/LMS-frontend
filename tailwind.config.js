/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "./**/*.html",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

