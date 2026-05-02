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
        // Jasma brand palette
        cream: {
          DEFAULT: "#FAF7F2",
          50: "#FDFCFA",
          100: "#FAF7F2",
          200: "#F0E8DC",
        },
        beige: {
          DEFAULT: "#E8DDD0",
          100: "#F5EFE7",
          200: "#E8DDD0",
          300: "#D4C4B0",
        },
        terracotta: {
          DEFAULT: "#C4622D",
          50: "#F9EDE6",
          100: "#EDCAB8",
          200: "#D9946B",
          300: "#C4622D",
          400: "#A3491F",
          500: "#7D3316",
        },
        gold: {
          DEFAULT: "#C9A84C",
          50: "#FAF4E3",
          100: "#F0DFA0",
          200: "#D9BC68",
          300: "#C9A84C",
          400: "#A88A38",
          500: "#7D6523",
        },
        charcoal: {
          DEFAULT: "#1C1C1E",
          100: "#3A3A3C",
          200: "#2C2C2E",
          300: "#1C1C1E",
        },
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-jasma":
          "linear-gradient(135deg, #FAF7F2 0%, #E8DDD0 50%, #F5EFE7 100%)",
        "gradient-terracotta":
          "linear-gradient(135deg, #C4622D 0%, #A3491F 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #C9A84C 0%, #A88A38 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "jasma": "0 4px 24px rgba(196, 98, 45, 0.12)",
        "jasma-lg": "0 8px 48px rgba(196, 98, 45, 0.18)",
        "gold": "0 4px 24px rgba(201, 168, 76, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
