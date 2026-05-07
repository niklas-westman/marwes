import type { FontLoadingConfig, ResolvedTheme } from "@marwes-ui/core";
export declare function themeToRootStyle(theme: ResolvedTheme): Record<string, string>;
export declare function applyThemeToElement(element: HTMLElement, theme: ResolvedTheme): void;
export declare function loadThemeFonts(theme: ResolvedTheme, config?: FontLoadingConfig): void;
export declare function resetThemeRuntimeState(): void;
