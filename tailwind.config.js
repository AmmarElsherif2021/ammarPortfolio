// tailwind.config.js
const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Retro palette
        "retro-red": "#ff3d5a",
        "retro-orange": "#ff6d1f",
        "retro-gold": "#ffb700",
        "retro-teal": "#00b3aa",
        "retro-violet": "#157c9c",
        "retro-ink": "#000000",
        "retro-ink-soft": "#31617c",
        "retro-ink-faint": "#4a7087",
        "retro-cream": "#FFFCF5",
        "retro-paper": "#FFFFFF",
        "retro-deep": "#035283",
        "retro-deep-2": "#014c6c",
        "retro-tint-1": "#ffa9a9",
        "retro-tint-2": "#f1b494",
        "retro-tint-3": "#f4d482",
        "retro-tint-4": "#a6e9e4",
        "retro-tint-5": "#b49de1",
        "retro-soft-1": "#e06174",
        "retro-soft-2": "#ec834a",
        "retro-soft-3": "#f5c344",
        "retro-soft-4": "#4bc8c2",
        "retro-soft-5": "#dc3f47",
      },
      fontFamily: {
        display: ["var(--font-squadaOne)", "sans-serif"],
        body: ["var(--font-martianMono)", "system-ui", "sans-serif"],
        mono: ["var(--font-martianMono)", "monospace"],
        poppins: ["var(--font-uniSans)", "system-ui", "sans-serif"],
        uniSans: ["var(--font-uniSans)", "system-ui", "sans-serif"],
        sans: ["var(--font-uniSans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "retro-xs": ["10px", { lineHeight: "1.4", letterSpacing: "0.15em" }],
        "retro-sm": ["12px", { lineHeight: "1.5", letterSpacing: "0.12em" }],
        "retro-base": ["14px", { lineHeight: "1.6" }],
        "retro-lg": ["18px", { lineHeight: "1.3" }],
        "retro-xl": ["24px", { lineHeight: "1.2" }],
        "retro-2xl": ["32px", { lineHeight: "1.1" }],
        "retro-3xl": ["48px", { lineHeight: "1" }],
      },
      borderRadius: {
        retro: "12px",
        "retro-lg": "16px",
        "retro-xl": "20px",
      },
      boxShadow: {
        comic: "3px 3px 0px #000000",
        "comic-lg": "5px 5px 0px #000000",
        "comic-xl": "7px 7px 0px #000000",
      },
      borderWidth: {
        3: "3px",
        4: "4px",
      },
      backgroundImage: {
        checker: "repeating-conic-gradient(#4a7087 0% 25%, #f4d482 0% 50%)",
        "checker-sm": "repeating-conic-gradient(#4a7087 0% 25%, #f4d482 0% 50%)",
        "diagonal-stripe": "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.14) 6px, rgba(255,255,255,0.14) 12px)",
        "grid-pattern": "linear-gradient(#4a7087 1px, transparent 1px), linear-gradient(90deg, #4a7087 1px, transparent 1px)",
      },
      backgroundSize: {
        "checker-sm": "8px 8px",
        "grid-sm": "20px 20px",
        "grid-md": "32px 32px",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "slide-in": "slide-in 0.35s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;