import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF8",
        surface: "#FFFFFF",
        border: "#E7E4DF",
        ink: "#1C1B1A",
        muted: "#76726A",
        primary: {
          DEFAULT: "#4338CA",
          light: "#6366F1",
          dark: "#312E81",
          tint: "#EEF0FD",
        },
        danger: {
          DEFAULT: "#DC4C4C",
          tint: "#FBE9E7",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28, 27, 26, 0.04), 0 1px 1px rgba(28, 27, 26, 0.03)",
        cardHover: "0 4px 14px rgba(28, 27, 26, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
