import { ThemeMode } from "@marwes-ui/react"

const siteThemeStorageKey = "marwes-site-theme"

function getInitialThemeMode(): ThemeMode {
  if (typeof document === "undefined") return ThemeMode.light
  const root = document.documentElement
  return root.dataset.marwesMode === ThemeMode.dark || root.classList.contains("dark")
    ? ThemeMode.dark
    : ThemeMode.light
}

export { getInitialThemeMode, siteThemeStorageKey }
