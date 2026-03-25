import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        soil: "#8B4513",
        gold: "#C9901A",
        cream: "#F5EDD6",
        forest: "#2D5016",
        charcoal: "#1A1A1A",
        sand: "#E8D5A3",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["DM Sans", "sans-serif"],
        ewe: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
