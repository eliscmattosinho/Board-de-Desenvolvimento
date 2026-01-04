import React from "react";
import { useTheme } from "@context/ThemeContext";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle-wrapper ${theme}`}
      onClick={toggleTheme}
      type="button"
      aria-label={`Mudar para modo ${theme === "dark" ? "claro" : "escuro"}`}
      title={`Tema atual: ${theme}`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="toggle-label" aria-hidden="true">
            {theme === "dark" ? "🌙" : "☀️"}
          </span>
        </div>
      </div>
    </button>
  );
}
