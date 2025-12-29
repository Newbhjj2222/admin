'use client';

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState("light");
  const [primary, setPrimary] = useState("#2563eb");
  const [font, setFont] = useState("sans");
  const [fontSize, setFontSize] = useState("base");

  /* =========================
     🌗 SYSTEM THEME DETECT
  ========================= */
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  /* =========================
     📥 LOAD FROM COOKIES / SYSTEM
  ========================= */
  useEffect(() => {
    const savedTheme = Cookies.get("theme");
    const themeMode = Cookies.get("themeMode"); // user | system

    const savedPrimary = Cookies.get("primary");
    const savedFont = Cookies.get("font");
    const savedFontSize = Cookies.get("fontSize");

    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (themeMode !== "user") {
      setThemeState(getSystemTheme());
    }

    if (savedPrimary) setPrimary(savedPrimary);
    if (savedFont) setFont(savedFont);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  /* =========================
     🔁 LISTEN SYSTEM CHANGE
     (only if user didn't choose)
  ========================= */
  useEffect(() => {
    const themeMode = Cookies.get("themeMode");
    if (themeMode === "user") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setThemeState(media.matches ? "dark" : "light");

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  /* =========================
     🎨 APPLY + SAVE
  ========================= */
  useEffect(() => {
    const root = document.documentElement;

    // 🌗 Dark / Light
    document.body.classList.toggle("dark", theme === "dark");

    // 🎨 Primary color
    root.style.setProperty("--primary", primary);

    // 🔤 Font family
    root.style.setProperty(
      "--font-sans",
      font === "sans"
        ? "Inter, Arial, sans-serif"
        : font === "display"
        ? "Poppins, sans-serif"
        : font === "serif"
        ? "Georgia, serif"
        : "Courier New, monospace"
    );

    // 🔠 Font size
    const sizes = {
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
    };
    root.style.setProperty("--text-base", sizes[fontSize]);

    // 💾 Save
    Cookies.set("theme", theme, { expires: 7 });
    Cookies.set("primary", primary, { expires: 7 });
    Cookies.set("font", font, { expires: 7 });
    Cookies.set("fontSize", fontSize, { expires: 7 });

  }, [theme, primary, font, fontSize]);

  /* =========================
     👤 USER THEME CHANGE
  ========================= */
  const setTheme = (value) => {
    Cookies.set("themeMode", "user", { expires: 7 }); // 🔒 lock system
    setThemeState(value);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        primary,
        setPrimary,
        font,
        setFont,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
