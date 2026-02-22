/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF2FF",
          100: "#D6E0FF",
          500: "#2D5BFF",
          600: "#1E3FCC",
          700: "#1A2F99",
        },
        surface: "#FFFFFF",
        bg: "#F8F7F4",
        border: "#E8E6E1",
        "border-light": "#F0EEEA",
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
