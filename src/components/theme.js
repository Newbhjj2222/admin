'use client';

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [primary, setPrimary] = useState("#2563eb");
  const [font, setFont] = useState("sans");
  const [fontSize, setFontSize] = useState("base");

  /* =========================
     📥 LOAD FROM COOKIES
  ========================= */
  useEffect(() => {
    const savedTheme = Cookies.get("theme");
    const savedPrimary = Cookies.get("primary");
    const savedFont = Cookies.get("font");
    const savedFontSize = Cookies.get("fontSize");

    if (savedTheme) setTheme(savedTheme);
    if (savedPrimary) setPrimary(savedPrimary);
    if (savedFont) setFont(savedFont);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  /* =========================
     🎨 APPLY + SAVE TO COOKIES
  ========================= */
  useEffect(() => {
    const root = document.documentElement;

    // 🌗 Dark / Light
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

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

    /* 💾 SAVE COOKIES (7 days) */
    Cookies.set("theme", theme, { expires: 7 });
    Cookies.set("primary", primary, { expires: 7 });
    Cookies.set("font", font, { expires: 7 });
    Cookies.set("fontSize", fontSize, { expires: 7 });

  }, [theme, primary, font, fontSize]);

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
