// src/lib/fonts.ts
import localFont from "next/font/local";

// ─── Uni Sans ──────────────────────────────────────────────────────────────────
export const uniSans = localFont({
  src: [
    {
      path: "../../public/assets/fonts/uniSans/UniSansThin.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/uniSans/UniSansBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-uniSans",
  display: "swap",
});

// ─── Martian Mono ─────────────────────────────────────────────────────────────
// All weights and widths (normal, condensed, semi‑condensed, semi‑expanded)
export const martianMono = localFont({
  src: [
    // ── Normal width ──
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono-Thin.ttf",
      weight: "100",
      style: "thin",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono-ExtraLight.ttf",
      weight: "200",
      style: "extra-light",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono-Light.ttf",
      weight: "300",
      style: "light",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono-Regular.ttf",
      weight: "400",
      style: "regular",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono-Medium.ttf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono-SemiBold.ttf",
      weight: "600",
      style: "semi-bold",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono-ExtraBold.ttf",
      weight: "800",
      style: "extra-bold",
    },

    // ── Condensed ──
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_Condensed-Thin.ttf",
      weight: "100",
      style: "condensed-thin",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_Condensed-ExtraLight.ttf",
      weight: "200",
      style: "condensed-extra-light",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_Condensed-Light.ttf",
      weight: "300",
      style: "condensed-light",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_Condensed-Regular.ttf",
      weight: "400",
      style: "condensed-Regular",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_Condensed-Medium.ttf",
      weight: "500",
      style: "condensed-medium  ",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_Condensed-SemiBold.ttf",
      weight: "600",
      style: "condensed-semi-bold",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_Condensed-Bold.ttf",
      weight: "700",
      style: "condensed-bold  ",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_Condensed-ExtraBold.ttf",
      weight: "800",
      style: "condensed-extra-bold ",
    },

    // ── Semi‑Condensed ──
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiCondensed-Thin.ttf",
      weight: "100",
      style: "semi-condensed-thin",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiCondensed-ExtraLight.ttf",
      weight: "200",
      style: "semi-condensed-extra-light",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiCondensed-Light.ttf",
      weight: "300",
      style: "semi-condensed-light",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiCondensed-Regular.ttf",
      weight: "400",
      style: "semi-condensed-Regular",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiCondensed-Medium.ttf",
      weight: "500",
      style: "semi-condensed-medium",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiCondensed-SemiBold.ttf",
      weight: "600",
      style: "semi-condensed-semi-bold",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiCondensed-Bold.ttf",
      weight: "700",
      style: "semi-condensed-bold",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiCondensed-ExtraBold.ttf",
      weight: "800",
      style: "semi-condensed-extra-bold",
    },

    // ── Semi‑Expanded ──
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiExpanded-Thin.ttf",
      weight: "100",
      style: "semi-expanded-thin",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiExpanded-ExtraLight.ttf",
      weight: "200",
      style: "semi-expanded-extra-light",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiExpanded-Light.ttf",
      weight: "300",
      style: "semi-expanded-light",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiExpanded-Regular.ttf",
      weight: "400",
      style: "semi-expanded-Regular",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiExpanded-Medium.ttf",
      weight: "500",
      style: "semi-expanded-medium",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiExpanded-SemiBold.ttf",
      weight: "600",
      style: "semi-expanded-semi-bold",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiExpanded-Bold.ttf",
      weight: "700",
      style: "semi-expanded-bold",
    },
    {
      path: "../../public/assets/fonts/Martian_Mono/static/MartianMono_SemiExpanded-ExtraBold.ttf",
      weight: "800",
      style: "semi-expanded-extra-bold",
    },
  ],
  variable: "--font-martianMono",
  display: "swap",
});

// ─── Squada One ──────────────────────────────────────────────────────────────
export const squadaOne = localFont({
  src: "../../public/assets/fonts/Squada_One/SquadaOne-Regular.ttf",
  weight: "500",
  style: "normal",
  variable: "--font-squadaOne",
  display: "swap",
});
