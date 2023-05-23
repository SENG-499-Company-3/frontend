import { type Config } from "tailwindcss";

module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss"), 
    require("autoprefixer"),
    require("daisyui"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;

