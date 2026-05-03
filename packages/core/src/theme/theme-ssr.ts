import { themeModesToCSSRules } from "./theme-css"
import type { ThemeModeAttribute, ThemeModeRootTarget } from "./theme-css"
import { resolveThemeInput } from "./theme-normalize"
import { ThemeMode } from "./theme-types"
import type { ThemeInput, ThemeMode as ThemeModeValue, ThemePreference } from "./theme-types"

export type MarwesThemeScriptOptions = {
  storageKey?: string | false
  defaultPreference?: ThemePreference
  enableSystem?: boolean
  target?: ThemeModeRootTarget
  attribute?: ThemeModeAttribute
}

export type MarwesThemeStyleOptions = {
  lightTheme?: ThemeInput
  darkTheme?: ThemeInput
  selector?: string
  target?: ThemeModeRootTarget
  attribute?: ThemeModeAttribute
}

const mediaQuery = "(prefers-color-scheme: dark)"

export function createMarwesThemeScript({
  storageKey = false,
  defaultPreference = ThemeMode.light,
  enableSystem = true,
  target,
  attribute = "class",
}: MarwesThemeScriptOptions = {}): string {
  const config = serializeScriptData({
    storageKey,
    defaultPreference,
    enableSystem,
    target,
    attribute,
    mediaQuery,
  })

  return `(function(){try{var c=${config};var p=c.defaultPreference;if(c.storageKey){try{var s=window.localStorage.getItem(c.storageKey);if(s==="light"||s==="dark"||s==="system")p=s;}catch(_){}}var m="light";if(p==="light"||p==="dark"){m=p;}else if(c.enableSystem&&window.matchMedia&&window.matchMedia(c.mediaQuery).matches){m="dark";}function a(e){if(!e)return;if(c.attribute==="class"){e.classList.remove(m==="dark"?"light":"dark");e.classList.add(m);}else{e.setAttribute(c.attribute,m);}}if(c.target==="html")a(document.documentElement);else if(c.target==="body")a(document.body);var r=document.querySelectorAll("[data-marwes-theme]");for(var i=0;i<r.length;i++){var e=r[i];e.setAttribute("data-marwes-mode",m);e.classList.remove(m==="dark"?"mw-theme--light":"mw-theme--dark");e.classList.add("mw-theme--"+m);}}catch(_){}})();`
}

export function createMarwesThemeStyle({
  lightTheme,
  darkTheme,
  selector,
  target,
  attribute,
}: MarwesThemeStyleOptions = {}): string {
  const options = {
    light: resolveThemeInput({ ...(lightTheme ?? {}), mode: ThemeMode.light }),
    dark: resolveThemeInput({ ...(darkTheme ?? {}), mode: ThemeMode.dark }),
  }

  return themeModesToCSSRules({
    ...options,
    ...(selector === undefined ? {} : { selector }),
    ...(target === undefined ? {} : { rootTarget: target }),
    ...(attribute === undefined ? {} : { rootAttribute: attribute }),
  })
}

export function resolveServerThemeMode({
  preference = ThemeMode.light,
  systemFallback = ThemeMode.light,
}: {
  preference?: ThemePreference
  systemFallback?: ThemeModeValue
} = {}): ThemeModeValue {
  return preference === "system" ? systemFallback : preference
}

function serializeScriptData(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}
