"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Theme, lightTheme, darkTheme } from "./data";

interface ThemeCtx { theme: Theme; isDark: boolean; toggle: () => void; }
const Ctx = createContext<ThemeCtx>({ theme: lightTheme, isDark: false, toggle: () => {} });
export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);
  useEffect(() => { localStorage.setItem("theme", isDark ? "dark" : "light"); }, [isDark]);
  const theme = isDark ? darkTheme : lightTheme;
  return <Ctx.Provider value={{ theme, isDark, toggle: () => setIsDark(p => !p) }}>{children}</Ctx.Provider>;
}
