import type { Adapter } from "./recipes"

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Keep offsets stable so imports can be read from the original source while
// comments and string examples cannot count as rendered application code.
function maskNonCode(source: string, maskStrings = true): string {
  return source.replace(
    /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`/g,
    (match) => {
      const isString = ['"', "'", "`"].includes(match[0] ?? "")
      return !maskStrings && isString ? match : match.replace(/[^\r\n]/g, " ")
    },
  )
}

function runtimeBindings(source: string, code: string, packageName: string, exported: string) {
  const names: string[] = []
  const namespaces: string[] = []
  const importSource = maskNonCode(source, false)
  const pattern = /^import\s+([^;]*?)\s+from\s*(["'])([^"']+)\2/
  for (const position of code.matchAll(/\bimport\b/g)) {
    const match = importSource.slice(position.index).match(pattern)
    if (!match || match[3] !== packageName) continue
    const bindings = maskNonCode(match[1] ?? "").trim()
    if (/^type\b/.test(bindings)) continue
    const namespace = bindings.match(/\*\s+as\s+([A-Za-z_$][\w$]*)/)
    if (namespace?.[1]) namespaces.push(namespace[1])
    for (const binding of (bindings.match(/\{([^}]*)\}/)?.[1] ?? "").split(",")) {
      const named = binding
        .trim()
        .match(new RegExp(`^${escapeRegExp(exported)}(?:\\s+as\\s+([A-Za-z_$][\\w$]*))?$`))
      if (named) names.push(named[1] ?? exported)
    }
    if (packageName === "react") {
      const defaultBinding = bindings.match(/^([A-Za-z_$][\w$]*)\s*(?:,|$)/)
      if (defaultBinding?.[1]) namespaces.push(defaultBinding[1])
    }
  }
  return [...names, ...namespaces.map((name) => `${name}.${exported}`)]
}

/** Recognize common static provider wiring, not arbitrary runtime component factories. */
export function hasConfiguredProvider(source: string, adapter: Adapter): boolean {
  const code = maskNonCode(source)
  const providers = runtimeBindings(source, code, `@marwes-ui/${adapter}`, "MarwesProvider")
  const renderers =
    adapter === "react"
      ? runtimeBindings(source, code, "react", "createElement")
      : adapter === "vue"
        ? runtimeBindings(source, code, "vue", "h")
        : []
  return providers.some((provider) => {
    const tags = [provider]
    if (adapter === "vue" && !provider.includes(".")) {
      tags.push(provider.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase())
    }
    if (tags.some((name) => new RegExp(`<\\s*${escapeRegExp(name)}(?:\\s|/?>)`).test(code))) {
      return true
    }
    return renderers.some((renderer) =>
      new RegExp(
        `(?:^|[^\\w$.])${escapeRegExp(renderer)}\\s*\\(\\s*${escapeRegExp(provider)}\\s*[,)]`,
      ).test(code),
    )
  })
}
