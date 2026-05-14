export function mergeClass(...parts: Array<string | false | null | undefined>): string | undefined {
  const className = parts.filter(Boolean).join(" ")
  return className.length > 0 ? className : undefined
}
