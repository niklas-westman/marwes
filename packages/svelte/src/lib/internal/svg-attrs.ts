/**
 * Convert camelCase SVG attribute names to kebab-case.
 * React JSX does this automatically; Svelte needs it explicitly.
 *
 * e.g. strokeDasharray → stroke-dasharray
 *      strokeWidth → stroke-width
 *      strokeLinecap → stroke-linecap
 */
export function svgAttrsToKebab(attrs: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(attrs)) {
    const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
    result[kebabKey] = value
  }
  return result
}
