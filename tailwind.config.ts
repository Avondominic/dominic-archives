import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        luxury: {
          black: "#0A0A0F",
          void: "#06060A",
          surface: "#111118",
          muted: "#1A1A24",
          border: "#2A2A3A",
          accent: "#C9A84C",
          "accent-dim": "#8A6F2E",
          platinum: "#E8E8F0",
          silver: "#A0A0B0",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-luxury":
          "linear-gradient(135deg, #0A0A0F 0%, #111118 50%, #0A0A0F 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #C9A84C 0%, #E8D5A3 50%, #C9A84C 100%)",
        "gradient-radial-dark":
          "radial-gradient(ellipse at center, #1A1A24 0%, #0A0A0F 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "loader-bar": {
          "0%": { width: "0%", opacity: "0.6" },
          "60%": { opacity: "1" },
          "100%": { width: "100%", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease forwards",
        "fade-in": "fade-in 0.6s ease forwards",
        shimmer: "shimmer 2.5s linear infinite",
        "loader-bar": "loader-bar 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
