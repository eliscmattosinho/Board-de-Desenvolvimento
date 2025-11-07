import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`theme-toggle-wrapper ${theme}`} onClick={toggleTheme}>
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="toggle-label">{theme === "dark" ? "🌙" : "☀️"}</span>
        </div>
      </div>
    </div>
  );
}
