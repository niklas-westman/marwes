/**
 * Convert camelCase SVG attribute names to kebab-case.
 * React JSX does this automatically; Svelte needs it explicitly.
 *
 * e.g. strokeDasharray → stroke-dasharray
 *      strokeWidth → stroke-width
 *      strokeLinecap → stroke-linecap
 */
export declare function svgAttrsToKebab(attrs: Record<string, string>): Record<string, string>;
