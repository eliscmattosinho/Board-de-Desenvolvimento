import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Pega o tema armazenado ou default para "light"
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem("theme") || "light";
  });

  // Atualiza a classe no html e salva na sessionStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
