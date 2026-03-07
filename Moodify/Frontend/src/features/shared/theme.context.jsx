import { createContext, useContext, useEffect, useState } from "react";

const MODE_KEY = "moodify_theme_mode";
const COLOR_KEY = "moodify_theme_color";

/* ── Color palettes ─────────────────────────────────────
   Each has a light and dark gradient for the page background.
──────────────────────────────────────────────────────── */
export const COLOR_THEMES = [
  {
    id: "mint-peach",
    label: "Mint Peach",
    emoji: "🌿",
    light:
      "linear-gradient(135deg, #b8e8d0 0%, #daf0e8 30%, #f0ece4 65%, #f5d0be 100%)",
    dark: "linear-gradient(135deg, #081a10 0%, #0d2018 30%, #141420 65%, #1a0e0a 100%)",
  },
  {
    id: "lavender",
    label: "Lavender Dusk",
    emoji: "💜",
    light:
      "linear-gradient(135deg, #d8ccf0 0%, #ece6fb 30%, #fce8f2 65%, #f8c8d8 100%)",
    dark: "linear-gradient(135deg, #0e0a1e 0%, #160e2a 30%, #1e1028 65%, #160a16 100%)",
  },
  {
    id: "ocean",
    label: "Ocean Breeze",
    emoji: "🌊",
    light:
      "linear-gradient(135deg, #a8d8d4 0%, #d4eeec 30%, #deeef8 65%, #b0d4f0 100%)",
    dark: "linear-gradient(135deg, #041620 0%, #072028 30%, #0a1c2e 65%, #050e18 100%)",
  },
  {
    id: "sunset",
    label: "Sunset Glow",
    emoji: "🌅",
    light:
      "linear-gradient(135deg, #ffd0a0 0%, #ffecd8 30%, #fce4ea 65%, #f8c8d4 100%)",
    dark: "linear-gradient(135deg, #1e0c00 0%, #281400 30%, #1e1016 65%, #180a0e 100%)",
  },
  {
    id: "forest",
    label: "Forest Mist",
    emoji: "🌲",
    light:
      "linear-gradient(135deg, #bce0bc 0%, #dcf0dc 30%, #eaf4e8 65%, #d0e8c8 100%)",
    dark: "linear-gradient(135deg, #061206 0%, #0a1c0a 30%, #0e180e 65%, #081208 100%)",
  },
  {
    id: "rose",
    label: "Rose Gold",
    emoji: "🌹",
    light:
      "linear-gradient(135deg, #f4c0c8 0%, #fae0e4 30%, #fdeef2 65%, #f8d4c0 100%)",
    dark: "linear-gradient(135deg, #1e0810 0%, #280e16 30%, #1e0c12 65%, #180808 100%)",
  },
];

/* ── Context ─────────────────────────────────────────── */
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(MODE_KEY);
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [colorId, setColorId] = useState(
    () => localStorage.getItem(COLOR_KEY) || "mint-peach",
  );

  useEffect(() => {
    const palette =
      COLOR_THEMES.find((t) => t.id === colorId) || COLOR_THEMES[0];
    const bg = isDark ? palette.dark : palette.light;

    // 1. Set background directly — most reliable, highest priority
    document.body.style.background = bg;
    document.body.style.backgroundAttachment = "fixed";

    // 2. Set data-theme for SCSS [data-theme="dark"] overrides
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );

    // 3. Persist
    localStorage.setItem(MODE_KEY, isDark ? "dark" : "light");
    localStorage.setItem(COLOR_KEY, colorId);
  }, [isDark, colorId]);

  const toggleTheme = () => setIsDark((d) => !d);
  const setColorTheme = (id) => setColorId(id);

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, colorId, setColorTheme, COLOR_THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
