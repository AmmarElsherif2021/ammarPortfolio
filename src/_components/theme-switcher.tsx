"use client";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // On mount, read the saved preference
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    // Tailwind darkMode: "class" looks for class="dark" on <html>
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="fixed top-4 right-4 z-50 rounded-full p-2 bg-accent-2 dark:bg-accent-7 transition-colors duration-200"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}