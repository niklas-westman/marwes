/**
 * Convert camelCase SVG attribute names to kebab-case.
 * React JSX does this automatically; Svelte needs it explicitly.
 *
 * e.g. strokeDasharray → stroke-dasharray
 *      strokeWidth → stroke-width
 *      strokeLinecap → stroke-linecap
 */
export function svgAttrsToKebab(attrs) {
    const result = {};
    for (const [key, value] of Object.entries(attrs)) {
        const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        result[kebabKey] = value;
    }
    return result;
}
