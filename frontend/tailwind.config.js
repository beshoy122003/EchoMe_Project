/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: "#a259ff",
        },
        blue: {
          500: "#3b82f6",
        },
        glass: "rgba(255, 255, 255, 0.06)",
      },
      backdropBlur: {
        xl: "20px",
      },
      animation: {
        "gradient-move": "gradient-move 15s ease infinite",
      },
    },
  },
  plugins: [],
};
