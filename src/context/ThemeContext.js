// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from 'react';

const THEME_STORAGE_KEY = 'kanbanThemePreference';

// Create Context object
const ThemeContext = createContext(undefined); // Initialize with undefined

// Create Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage only on client-side
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
    }
    // Default to light if no valid theme found or on server-side
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Ensure theme is only 'light' or 'dark'
    const currentTheme = theme === 'dark' ? 'dark' : 'light';

    root.classList.remove('light', 'dark'); // Remove both classes
    root.classList.add(currentTheme); // Add the correct one

    // Save theme preference to localStorage
    try {
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (error) {
        console.error("Failed to save theme to localStorage", error);
    }

  }, [theme]); // Re-run effect when theme changes

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Memoize the context value
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]); // Include toggleTheme in dependency array

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for consuming the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};