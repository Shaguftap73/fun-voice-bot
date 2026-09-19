/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0f0f13",
        panel: "#17171d",
        accent: "#e0a72e",
      },
    },
  },
  plugins: [],
};