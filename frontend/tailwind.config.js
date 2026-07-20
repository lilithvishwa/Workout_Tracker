/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "#F7F3E9",     // warm base background (light mode)
        pine: {
          DEFAULT: "#1F3D36", // deep green - primary
          light: "#2E5449",
          dark: "#122421",
        },
        ember: {
          DEFAULT: "#D9782D", // streak/fire accent
          light: "#F0A05C",
          dark: "#B45F1E",
        },
        clay: "#B5482F",       // missed / break state
        moss: "#7C9A82",       // rest day / secondary
        ink: "#182420",        // near-black text
        dusk: {
          DEFAULT: "#0F1815",  // dark mode background
          card: "#182420",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        stamp: "10px",
      },
    },
  },
  plugins: [],
};
