// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      // Define colors using CSS variables for themeability
      // These names can be used in Tailwind classes like bg-primary, text-primary, etc.
      colors: {
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        tertiary: "var(--bg-tertiary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-heading": "var(--text-heading)",
        "text-inverted": "var(--text-inverted)",
        "text-link": "var(--text-link)",
        "text-tertiary": "var(--text-tertiary)",
        "border-color": "var(--border-color)",
        "border-card": "var(--border-card)",
        "input-bg": "var(--input-bg)",
        "input-border": "var(--input-border)",
        "button-primary-bg": "var(--button-primary-bg)",
        "button-primary-hover-bg": "var(--button-primary-hover-bg)",
        "button-secondary-bg": "var(--button-secondary-bg)",
        "button-secondary-hover-bg": "var(--button-secondary-hover-bg)",
        "button-secondary-text": "var(--button-secondary-text)",
        "header-todo": "var(--header-todo-bg)",
        "header-inprogress": "var(--header-inprogress-bg)",
        "header-done": "var(--header-done-bg)",
        "delete-btn-text": "var(--delete-btn-text)",
        "delete-btn-hover-text": "var(--delete-btn-hover-text)",
        "delete-btn-hover-bg": "var(--delete-btn-hover-bg)",
        "overdue-text": "var(--overdue-text)",
        "overdue-icon": "var(--overdue-icon)",
        "drag-over-bg": "var(--drag-over-bg)",
        "drag-over-outline": "var(--drag-over-outline)",
        "scrollbar-track": "var(--scrollbar-track)",
        "scrollbar-thumb": "var(--scrollbar-thumb)",
        "scrollbar-thumb-hover": "var(--scrollbar-thumb-hover)",
      },
      fontFamily: {
        // Ensure Inter font is used
        sans: ["Inter", "sans-serif"],
        heading: ["Funnel Display", "sans-serif"],
      },
      scale: {
        // Add scale for button press animation
        96: ".96",
        97: ".97",
      },
    },
  },
  plugins: [],
};
