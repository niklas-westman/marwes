import { ThemeMode } from "@marwes-ui/core";
import type { ThemePreference } from "@marwes-ui/core";
export type ThemeTarget = "provider" | "html" | "body";
export type ThemeAttribute = "class" | "data-theme" | "data-mode";
export declare function getSystemThemeMode(): ThemeMode;
export declare function subscribeToSystemThemeMode(onChange: (mode: ThemeMode) => void): () => void;
export declare function readStoredThemePreference(storageKey: string | false): ThemePreference | undefined;
export declare function writeStoredThemePreference(storageKey: string | false, preference: ThemePreference): void;
export declare function applyModeAttribute({ target, providerElement, mode, attribute, }: {
    target: ThemeTarget;
    providerElement: HTMLElement | null;
    mode: ThemeMode;
    attribute: ThemeAttribute;
}): void;
export declare function withoutModeTransitions(callback: () => void): void;
