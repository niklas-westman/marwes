export type DOMAttrs = Record<string, string | number | boolean | undefined>

export function cleanAttrs(attrs: DOMAttrs | undefined): DOMAttrs {
  if (!attrs) return {}
  return Object.fromEntries(Object.entries(attrs).filter(([, value]) => value !== undefined))
}
