import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, peaceful palette
        grace: {
          cream: "#FAF7F2",
          warm: "#F5EFE4",
          gold: "#C9A96E",
          "gold-light": "#E8D5B0",
          brown: "#8B6F47",
          "brown-deep": "#5C4A2A",
          sage: "#8A9E8C",
          "sage-light": "#C8D8C9",
          muted: "#9B8E82",
          text: "#3D3228",
          "text-soft": "#6B5F55",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};

export default config;
