import type { Page } from "playwright"
import type { Expectation, Measurement } from "../contracts/report.js"

/** Normalize supported sRGB serializations to the same eight-bit channel precision as source compilation.
 * Alpha remains a separate paint property; never composite it against a background.
 */
export function normalizeSrgbColor(value: string): string | null {
  let channels: string[]
  let alpha = "1"
  const legacy = value.match(/^rgba?\(([^)]+)\)$/)?.[1]
  const srgb = value.match(/^color\(srgb\s+([^)]+)\)$/)?.[1]
  if (srgb) {
    const [color, opacity] = srgb.split("/")
    channels = (color ?? "").trim().split(/\s+/)
    alpha = opacity?.trim() ?? "1"
  } else if (legacy) {
    const [color, opacity] = legacy.split("/")
    const components = (color ?? "").trim().split(/[,\s]+/)
    if (components.length === 4) alpha = components.pop() ?? "1"
    else alpha = opacity?.trim() ?? "1"
    channels = components
  } else return null
  if (channels.length !== 3) return null
  const values = channels.map((component) =>
    component.endsWith("%")
      ? Number.parseFloat(component) * 2.55
      : Number(component) * (srgb ? 255 : 1),
  )
  const opacity = alpha.endsWith("%") ? Number.parseFloat(alpha) / 100 : Number(alpha)
  if (
    values.some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255) ||
    !Number.isFinite(opacity) ||
    opacity < 0 ||
    opacity > 1
  )
    return null
  return `rgba(${values.map((channel) => Math.round(channel)).join(", ")}, ${Number(opacity.toFixed(5))})`
}
export function normalizeLetterSpacing(
  value: string,
  textAlign: string,
  textAlignLast = "auto",
): number | null {
  if (value === "normal")
    return textAlign.startsWith("justify") || textAlignLast.startsWith("justify") ? null : 0
  return /^-?[0-9.]+px$/.test(value) ? Number.parseFloat(value) : null
}

export function compareMeasurement(
  expectation: Expectation,
  actual: Measurement["actual"],
  diagnostic?: string,
): Measurement {
  const delta =
    typeof actual === "number" && typeof expectation.expected === "number"
      ? actual - expectation.expected
      : null
  const pass =
    !diagnostic &&
    actual !== null &&
    (delta === null ? actual === expectation.expected : Math.abs(delta) <= expectation.tolerance)
  return {
    ...expectation,
    actual,
    delta,
    outcome: pass ? "passed" : "failed",
    ...(diagnostic
      ? { diagnostic }
      : !pass
        ? { diagnostic: `${expectation.part}.${expectation.property} differs from Figma` }
        : {}),
  }
}
export async function measure(page: Page, expectations: Expectation[]): Promise<Measurement[]> {
  const results: Measurement[] = []
  for (const expectation of expectations) {
    const observation = await page.evaluate(({ selector, property }) => {
      const pseudo = selector.match(/::(before|after)$/)?.[0]
      const baseSelector = pseudo ? selector.slice(0, -pseudo.length) : selector
      const elements = document.querySelectorAll(baseSelector)
      if (elements.length !== 1)
        return {
          actual: null,
          diagnostic: `Selector ${selector} matched ${elements.length} elements; exactly one required`,
        }
      const element = elements[0] as HTMLElement
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element, pseudo)
      if (
        pseudo &&
        (["none", "normal"].includes(style.content) ||
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.visibility === "collapse" ||
          Number(style.opacity) === 0)
      )
        return { actual: null, diagnostic: "Pseudo-element paint is not generated or visible" }
      if (
        pseudo &&
        (property === "text" ||
          property === "visible" ||
          property.startsWith("bounds.") ||
          property === "relativeX" ||
          property === "relativeY")
      )
        return {
          actual: null,
          diagnostic:
            "Pseudo-element geometry/content measurement is not supported; use independent visual proof",
        }
      if (property === "text") return { actual: element.textContent ?? "" }
      if (property === "visible")
        return {
          actual:
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            Number(style.opacity) > 0,
        }
      if (property.startsWith("bounds.")) {
        const field = property.slice(7) as "width" | "height" | "x" | "y"
        return field in rect
          ? { actual: rect[field] }
          : { actual: null, diagnostic: `Unsupported bounds field ${field}` }
      }
      if (property === "relativeX" || property === "relativeY") {
        const parent = element.parentElement?.getBoundingClientRect()
        return parent
          ? { actual: property === "relativeX" ? rect.x - parent.x : rect.y - parent.y }
          : { actual: null, diagnostic: "Missing parent" }
      }
      if (property === "insetStrokeWidth" || property === "insetStrokeColor") {
        const shadow = style.boxShadow
        if (shadow === "none") return { actual: property === "insetStrokeWidth" ? 0 : null }
        const paint = shadow.match(/^(rgba?\([^)]*\)|color\([^)]*\))/)?.[0]
        const rest = paint ? shadow.slice(paint.length).trim() : ""
        const lengths = rest
          .replace(/\binset\b/g, "")
          .trim()
          .split(/\s+/)
        const spread = lengths[3]
        if (
          !paint ||
          spread === undefined ||
          !rest.includes("inset") ||
          lengths.length !== 4 ||
          lengths.slice(0, 3).some((n) => Number.parseFloat(n) !== 0) ||
          !lengths.every((n) => /^-?[0-9.]+px$/.test(n))
        )
          return {
            actual: null,
            diagnostic:
              "Unsupported inset stroke: requires one zero-offset, zero-blur, inset shadow",
          }
        return {
          actual: property === "insetStrokeWidth" ? Number.parseFloat(spread) : paint,
        }
      }
      const value = (style as unknown as Record<string, string>)[property]
      if (!value) return { actual: null, diagnostic: `Unsupported computed property ${property}` }
      if (property === "fontFamily")
        return { actual: (value.split(",")[0] ?? "").replace(/["']/g, "").trim() }
      if (property === "letterSpacing")
        return { actual: value, textAlign: style.textAlign, textAlignLast: style.textAlignLast }
      if (/^-?[0-9.]+(?:px)?$/.test(value)) return { actual: Number.parseFloat(value) }
      return { actual: value }
    }, expectation)
    let actual = observation.actual
    let diagnostic = observation.diagnostic
    if (
      typeof actual === "string" &&
      (expectation.property.endsWith("Color") ||
        ["color", "stroke", "fill"].includes(expectation.property))
    ) {
      actual = normalizeSrgbColor(actual)
      if (actual === null)
        diagnostic = "Unsupported computed paint serialization; supported proof requires sRGB"
    }
    if (expectation.property === "letterSpacing" && typeof actual === "string") {
      actual = normalizeLetterSpacing(
        actual,
        observation.textAlign ?? "",
        observation.textAlignLast ?? "auto",
      )
      if (actual === null)
        diagnostic = "Unsupported normal tracking on justified text; explicit layout proof required"
    }
    results.push(compareMeasurement(expectation, actual, diagnostic))
  }
  return results
}

export async function measureFonts(
  page: Page,
  expectations: Expectation[],
): Promise<Measurement[]> {
  const rows: Measurement[] = []
  for (const font of expectations.filter((item) => item.property === "fontFamily")) {
    const weight =
      expectations.find((item) => item.part === font.part && item.property === "fontWeight")
        ?.expected ?? 400
    const loaded = await page.evaluate(
      ({ family, weight }) =>
        [...document.fonts].some((face) => {
          const weights = face.weight.split(/\s+/).map(Number)
          return (
            face.family.replace(/["']/g, "") === family &&
            face.status === "loaded" &&
            face.style === "normal" &&
            (weights.length === 2
              ? Number(weight) >= (weights[0] ?? Number.NaN) &&
                Number(weight) <= (weights[1] ?? Number.NaN)
              : Number(weight) === weights[0])
          )
        }),
      { family: String(font.expected), weight: Number(weight) },
    )
    rows.push(
      compareMeasurement(
        { ...font, property: "fontLoaded", expected: true, comparison: "exact", tolerance: 0 },
        loaded,
        loaded
          ? undefined
          : `Required ${font.expected} normal weight ${weight} font face has not loaded`,
      ),
    )
  }
  return rows
}
