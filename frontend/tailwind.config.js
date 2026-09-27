/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080a0e",
        foreground: "#f5f5f5",
        card: {
          DEFAULT: "#0f1119",
          foreground: "#f5f5f5",
        },
        popover: {
          DEFAULT: "#0f1119",
          foreground: "#f5f5f5",
        },
        primary: {
          DEFAULT: "#00c805",
          foreground: "#080a0e",
        },
        secondary: {
          DEFAULT: "#1a1f2e",
          foreground: "#f5f5f5",
        },
        muted: {
          DEFAULT: "#2d3142",
          foreground: "#8b8f99",
        },
        accent: {
          DEFAULT: "#00c805",
          foreground: "#080a0e",
        },
        destructive: {
          DEFAULT: "#ff4444",
          foreground: "#f5f5f5",
        },
        border: "#1a1f2e",
        input: "#0f1119",
        ring: "#00c805",
      },
      borderRadius: {
        lg: "0.625rem",
        md: "calc(0.625rem - 2px)",
        sm: "calc(0.625rem - 4px)",
      },
    },
  },
  plugins: [],
};
