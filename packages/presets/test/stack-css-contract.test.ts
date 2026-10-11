/**
 * CSS contract: verifies the firstEdition stack stylesheet maps every declared
 * Stack value to the right flex declaration, scopes every selector to the
 * family, and takes gap/padding only from token-backed vars.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  stackAlignItemsValues,
  stackDirections,
  stackJustifyContentValues,
  stackWraps,
} from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const stackCssPath = resolve(pkgDir, "src/firstEdition/stack.css")
const stylesCssPath = resolve(pkgDir, "src/firstEdition/styles.css")

type CssRule = { selector: string; body: string }

function readStackCss(): string {
  return readFileSync(stackCssPath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")
}

function parseRules(css: string): CssRule[] {
  return [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map((match) => ({
    // Normalise formatter line breaks so selectors compare in their single-line form.
    selector: (match[1] ?? "")
      .replace(/\s+/g, " ")
      .replace(/\(\s+/g, "(")
      .replace(/\s+\)/g, ")")
      .trim(),
    body: (match[2] ?? "").replace(/\s+/g, " ").trim(),
  }))
}

function findRule(rules: CssRule[], selector: string): CssRule | undefined {
  return rules.find((rule) => rule.selector === selector)
}

function splitSelectorList(selector: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ""
  for (const character of selector) {
    if (character === "(") depth += 1
    if (character === ")") depth -= 1
    if (character === "," && depth === 0) {
      parts.push(current.trim())
      current = ""
      continue
    }
    current += character
  }
  parts.push(current.trim())
  return parts
}

const flexStartMapping: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  "space-evenly": "space-evenly",
}

describe("firstEdition stack css contract", () => {
  const rules = parseRules(readStackCss())

  it("is imported by styles.css after spacing.css", () => {
    const styles = readFileSync(stylesCssPath, "utf8")
    const spacingIndex = styles.indexOf('@import "./spacing.css";')
    const stackIndex = styles.indexOf('@import "./stack.css";')

    expect(spacingIndex).toBeGreaterThan(-1)
    expect(stackIndex).toBeGreaterThan(spacingIndex)
  })

  it("lays out the base stack from token-backed vars only", () => {
    const base = findRule(rules, ".mw-stack")

    expect(base?.body).toContain("display: flex;")
    expect(base?.body).toContain("row-gap: var(--mw-stack-row-gap);")
    expect(base?.body).toContain("column-gap: var(--mw-stack-column-gap);")
    expect(base?.body).toContain(
      "padding: var(--mw-stack-padding-top) var(--mw-stack-padding-right) var(--mw-stack-padding-bottom) var(--mw-stack-padding-left);",
    )
  })

  it.each(stackDirections)("maps direction %s to flex-direction", (direction) => {
    const rule = findRule(rules, `.mw-stack[data-direction="${direction}"]`)
    expect(rule?.body).toBe(`flex-direction: ${direction};`)
  })

  it.each(stackAlignItemsValues)("maps alignItems %s to align-items", (value) => {
    const rule = findRule(rules, `.mw-stack[data-align-items="${value}"]`)
    expect(rule?.body).toBe(`align-items: ${flexStartMapping[value]};`)
  })

  it.each(stackJustifyContentValues)("maps justifyContent %s to justify-content", (value) => {
    const rule = findRule(rules, `.mw-stack[data-justify-content="${value}"]`)
    expect(rule?.body).toBe(`justify-content: ${flexStartMapping[value]};`)
  })

  it.each(stackWraps)("maps wrap %s to flex-wrap", (wrap) => {
    const rule = findRule(rules, `.mw-stack[data-wrap="${wrap}"]`)
    expect(rule?.body).toBe(`flex-wrap: ${wrap};`)
  })

  describe("child sizing", () => {
    const child = ":is(.mw-stack-item, .mw-stack)"
    const hugOrFix = (axis: string) =>
      `:is([data-${axis}-sizing="hug"], [data-${axis}-sizing="fix"])`
    const axes = [
      { direction: "row", main: "horizontal", cross: "vertical", crossSize: "height" },
      { direction: "column", main: "vertical", cross: "horizontal", crossSize: "width" },
    ] as const

    it.each(axes)("$direction parent: main-axis fill grows, hug/fix keeps its size", (axis) => {
      const parent = `.mw-stack[data-direction="${axis.direction}"] >`
      expect(findRule(rules, `${parent} ${child}[data-${axis.main}-sizing="fill"]`)?.body).toBe(
        "flex: 1 1 0;",
      )
      expect(findRule(rules, `${parent} ${child}${hugOrFix(axis.main)}`)?.body).toBe(
        "flex: 0 0 auto;",
      )
    })

    it.each(axes)("$direction parent: cross-axis fill stretches, hug/fix fits content", (axis) => {
      const parent = `.mw-stack[data-direction="${axis.direction}"] >`
      expect(findRule(rules, `${parent} ${child}[data-${axis.cross}-sizing="fill"]`)?.body).toBe(
        "align-self: stretch;",
      )
      expect(findRule(rules, `${parent} ${child}${hugOrFix(axis.cross)}`)?.body).toBe(
        `align-self: auto; ${axis.crossSize}: fit-content;`,
      )
    })

    it("has no parent-level stretch, so a hug or fix child always fits its content", () => {
      expect(findRule(rules, '.mw-stack[data-align-items="stretch"]')).toBeUndefined()
      const stackRules = rules.filter((rule) =>
        splitSelectorList(rule.selector).some((selector) => /^\.mw-stack(?![\w-])/.test(selector)),
      )
      for (const rule of stackRules) {
        expect(rule.body).not.toContain("align-items: stretch;")
      }
      for (const axis of axes) {
        const parent = `.mw-stack[data-direction="${axis.direction}"] >`
        expect(findRule(rules, `${parent} ${child}${hugOrFix(axis.cross)}`)?.body).toContain(
          `${axis.crossSize}: fit-content;`,
        )
      }
    })

    it("aligns StackItem content by its declared sizing", () => {
      expect(findRule(rules, `.mw-stack-item${hugOrFix("horizontal")}`)?.body).toBe(
        "align-items: flex-start;",
      )
      expect(findRule(rules, '.mw-stack-item[data-horizontal-sizing="fill"]')?.body).toBe(
        "align-items: stretch;",
      )
      expect(findRule(rules, '.mw-stack-item[data-vertical-sizing="fill"] > *')?.body).toBe(
        "flex: 1 1 auto;",
      )
    })
  })

  it("roots every selector in .mw-stack or .mw-stack-item", () => {
    for (const rule of rules) {
      for (const selector of splitSelectorList(rule.selector)) {
        expect(selector).toMatch(/^\.mw-stack(-item)?(?![\w-])/)
      }
    }
  })

  it("takes spacing values only from --mw-stack-* or --mw-spacing-* vars", () => {
    for (const rule of rules) {
      for (const declaration of rule.body.split(";").filter(Boolean)) {
        const [property = "", value = ""] = declaration.split(":").map((part) => part.trim())
        if (!/^(row-gap|column-gap|gap|padding)/.test(property)) continue
        for (const token of value.split(/\s+/)) {
          expect(token).toMatch(/^var\(--mw-(stack|spacing)-[\w-]+\)$/)
        }
      }
    }
  })

  it("contains no px literals", () => {
    expect(readStackCss()).not.toMatch(/\d+px/)
  })
})
