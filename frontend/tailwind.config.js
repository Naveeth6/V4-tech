const autoprefixer = require("autoprefixer");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        border: "#e5e7eb", // Tailwind's default border color (gray-200)
        background: "#fff", // You can add more custom colors if needed
        foreground: "#222", // Example foreground
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
