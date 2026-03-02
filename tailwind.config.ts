import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        doula: {
          bg: "#0d0a0f",
          surface: "#140f12",
          border: "#2a2025",
          text: "#f0ebe8",
          muted: "#9a8880",
          accent: "#c9956e",
          "accent-dark": "#a0604a",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
