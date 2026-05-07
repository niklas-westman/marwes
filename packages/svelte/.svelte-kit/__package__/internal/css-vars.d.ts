import type { CssVars } from "@marwes-ui/core";
export type SvelteStyleInput = string | Record<string, string | number | null | undefined> | null | undefined;
export declare function cssVarsToStyle(vars: CssVars | undefined): string | undefined;
export declare function styleObjectToString(style: Record<string, string | number | null | undefined> | undefined): string | undefined;
export declare function mergeStyle(...parts: Array<string | undefined>): string | undefined;
