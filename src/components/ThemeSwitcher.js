'use client';

import { useTheme } from "@/components/theme";
import {
  FaMoon,
  FaSun,
  FaPalette,
  FaFont,
  FaTextHeight,
} from "react-icons/fa";

const ThemeSwitcher = () => {
  const {
    theme,
    setTheme,
    setPrimary,
    font,
    setFont,
    fontSize,
    setFontSize,
  } = useTheme();

  return (
    <div className="themeBox">
      {/* Dark / Light */}
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>

      {/* Colors */}
      <div className="colors">
        <FaPalette />
        <span onClick={() => setPrimary("#2563eb")} />
        <span onClick={() => setPrimary("#16a34a")} />
        <span onClick={() => setPrimary("#9333ea")} />
        <span onClick={() => setPrimary("#dc2626")} />
      </div>

      {/* Fonts */}
      <div className="fonts">
        <FaFont />
        <select value={font} onChange={(e) => setFont(e.target.value)}>
          <option value="sans">Sans</option>
          <option value="display">Display</option>
          <option value="serif">Serif</option>
          <option value="mono">Mono</option>
        </select>
      </div>

      {/* Font size */}
      <div className="fontSize">
        <FaTextHeight />
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="sm">Small</option>
          <option value="base">Normal</option>
          <option value="lg">Large</option>
          <option value="xl">Extra</option>
        </select>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
