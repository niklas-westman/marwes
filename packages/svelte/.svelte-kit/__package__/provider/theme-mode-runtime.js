import { ThemeMode, isThemePreference } from "@marwes-ui/core";
const mediaQuery = "(prefers-color-scheme: dark)";
export function getSystemThemeMode() {
    if (typeof window === "undefined")
        return ThemeMode.light;
    return window.matchMedia?.(mediaQuery).matches ? ThemeMode.dark : ThemeMode.light;
}
export function subscribeToSystemThemeMode(onChange) {
    if (typeof window === "undefined" || !window.matchMedia)
        return () => { };
    const media = window.matchMedia(mediaQuery);
    const listener = (event) => {
        onChange(event.matches ? ThemeMode.dark : ThemeMode.light);
    };
    if (media.addEventListener) {
        media.addEventListener("change", listener);
    }
    else {
        media.addListener?.(listener);
    }
    return () => {
        if (media.removeEventListener) {
            media.removeEventListener("change", listener);
        }
        else {
            media.removeListener?.(listener);
        }
    };
}
export function readStoredThemePreference(storageKey) {
    if (!storageKey || typeof window === "undefined")
        return undefined;
    try {
        const value = window.localStorage.getItem(storageKey);
        return isThemePreference(value) ? value : undefined;
    }
    catch {
        return undefined;
    }
}
export function writeStoredThemePreference(storageKey, preference) {
    if (!storageKey || typeof window === "undefined")
        return;
    try {
        window.localStorage.setItem(storageKey, preference);
    }
    catch {
        // Ignore unavailable storage.
    }
}
export function applyModeAttribute({ target, providerElement, mode, attribute, }) {
    const element = getTargetElement(target, providerElement);
    if (!element)
        return;
    if (attribute === "class") {
        const oppositeMode = mode === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
        element.classList.remove(oppositeMode);
        element.classList.add(mode);
        return;
    }
    element.setAttribute(attribute, mode);
}
export function withoutModeTransitions(callback) {
    if (typeof document === "undefined" || typeof window === "undefined") {
        callback();
        return;
    }
    const style = document.createElement("style");
    style.dataset.marwesDisableTransitions = "true";
    style.textContent = "* { transition: none !important; }";
    document.head.appendChild(style);
    callback();
    window.getComputedStyle(document.body);
    window.requestAnimationFrame(() => {
        style.remove();
    });
}
function getTargetElement(target, providerElement) {
    if (target === "provider")
        return providerElement;
    if (typeof document === "undefined")
        return null;
    return target === "html" ? document.documentElement : document.body;
}
