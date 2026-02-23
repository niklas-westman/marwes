import type { CSSProperties, VNodeChild } from "vue"

export type StyleWithVars = CSSProperties & Record<`--mw-${string}`, string>

export function mergeClassNames(...parts: Array<unknown>): string {
  return parts.filter(Boolean).join(" ")
}

export function mergeStyles(...stylesInput: Array<unknown>): CSSProperties | undefined {
  const styles = stylesInput.filter(Boolean)
  if (styles.length === 0) {
    return undefined
  }

  return Object.assign({}, ...styles) as CSSProperties
}

export function omitAttrs(
  attrs: Record<string, unknown>,
  omittedKeys: readonly string[],
): Record<string, unknown> {
  const nextAttrs: Record<string, unknown> = {}

  for (const [attrName, attrValue] of Object.entries(attrs)) {
    if (omittedKeys.includes(attrName)) {
      continue
    }
    nextAttrs[attrName] = attrValue
  }

  return nextAttrs
}

export function getDefaultSlotChildren(slots: { default?: () => VNodeChild[] }):
  | VNodeChild[]
  | undefined {
  return slots.default?.()
}
