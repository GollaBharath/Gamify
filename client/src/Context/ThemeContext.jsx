/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Synchronously initialize state from localStorage to prevent layout flash on refresh
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme === "dark" : true;
    }
    return true;
  });

  useEffect(() => {
    // Update the document class and save preference
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};