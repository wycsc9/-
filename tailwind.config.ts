import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#b60d3d",
        "primary-dim": "#a20033",
        "primary-container": "#ff7386",
        "on-primary": "#ffefef",
        secondary: "#006479",
        "secondary-dim": "#00576a",
        "secondary-container": "#77dfff",
        "on-secondary": "#e0f6ff",
        "on-secondary-container": "#004e60",
        tertiary: "#6d5a00",
        "tertiary-container": "#fdd404",
        "on-tertiary-container": "#594a00",
        surface: "#f5f6f7",
        "surface-container-low": "#eff1f2",
        "surface-container": "#e6e8ea",
        "surface-container-high": "#e0e3e4",
        "surface-container-highest": "#dadddf",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#dadddf",
        "on-surface": "#2c2f30",
        "on-surface-variant": "#595c5d",
        "outline-variant": "#abadae",
        ink: "#2c2f30",
        slate: "#595c5d"
      },
      boxShadow: {
        panel: "0 12px 32px rgba(44, 47, 48, 0.08)"
      },
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "sans-serif"],
        body: ["'Be Vietnam Pro'", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        headline: ["'Plus Jakarta Sans'", "sans-serif"],
        label: ["'Plus Jakarta Sans'", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
