// ─── Matrix type ─────────────────────────────────────────────────────────────
type Mat3 = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
]

// ─── Matrix constants (Björn Ottosson's Oklab, 2020) ─────────────────────────
// sRGB linear → XYZ-D65
const M_RGB_TO_XYZ: Mat3 = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.072175],
  [0.0193339, 0.119192, 0.9503041],
]

// XYZ-D65 → Oklab LMS cone responses
const M_XYZ_TO_LMS: Mat3 = [
  [0.8189330101, 0.3618667424, -0.1288597137],
  [0.0329845436, 0.9293118715, 0.0361456387],
  [0.0482003018, 0.2643662691, 0.633851707],
]

// Oklab LMS (after cube-root) → Lab
const M_LMS_TO_LAB: Mat3 = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
]

// Inverse matrices (pre-computed exact inverses)
const M_LAB_TO_LMS: Mat3 = [
  [1.0, 0.3963377774, 0.2158037573],
  [1.0, -0.1055613458, -0.0638541728],
  [1.0, -0.0894841775, -1.291485548],
]

const M_LMS_TO_XYZ: Mat3 = [
  [1.2270138511, -0.5577999807, 0.281256149],
  [-0.0405801784, 1.1122568696, -0.0716766787],
  [-0.0763812845, -0.4214819784, 1.5861632204],
]

const M_XYZ_TO_RGB: Mat3 = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.969266, 1.8760108, 0.041556],
  [0.0556434, -0.2040259, 1.0572252],
]

// ─── Matrix helper ────────────────────────────────────────────────────────────

function matMul(matrix: Mat3, vec: [number, number, number]): [number, number, number] {
  const [row0, row1, row2] = matrix
  return [
    row0[0] * vec[0] + row0[1] * vec[1] + row0[2] * vec[2],
    row1[0] * vec[0] + row1[1] * vec[1] + row1[2] * vec[2],
    row2[0] * vec[0] + row2[1] * vec[1] + row2[2] * vec[2],
  ]
}

// ─── Ticket 1: parseHex + rgbToHex ───────────────────────────────────────────

/**
 * Parses a #RRGGBB or #RGB hex string into [r, g, b] integers (0–255).
 */
export function parseHex(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "")
  const expanded =
    cleaned.length === 3
      ? cleaned.charAt(0).repeat(2) + cleaned.charAt(1).repeat(2) + cleaned.charAt(2).repeat(2)
      : cleaned
  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ]
}

/**
 * Converts a [r, g, b] tuple (0–255) to an uppercase #RRGGBB hex string.
 * Channels are clamped to [0, 255] before conversion.
 */
export function rgbToHex(rgb: [number, number, number]): string {
  const toHexChannel = (channel: number): string =>
    Math.round(Math.max(0, Math.min(255, channel)))
      .toString(16)
      .toUpperCase()
      .padStart(2, "0")
  return `#${toHexChannel(rgb[0])}${toHexChannel(rgb[1])}${toHexChannel(rgb[2])}`
}

// ─── Ticket 2: OKLCH pipeline + adjustLightness ──────────────────────────────

/**
 * Expands an sRGB channel (0–1) to linear light (removes gamma compression).
 * IEC 61966-2-1 transfer function.
 */
export function linearize(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

/**
 * Compresses a linear-light channel (0–1) back to sRGB (applies gamma).
 * IEC 61966-2-1 inverse transfer function.
 */
export function delinearize(channel: number): number {
  return channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055
}

/**
 * Converts sRGB [r, g, b] (0–255) to OKLCH [L, C, h].
 * L: perceptual lightness (0–1), C: chroma (≥0), h: hue angle (radians).
 */
export function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const linearRgb: [number, number, number] = [
    linearize(r / 255),
    linearize(g / 255),
    linearize(b / 255),
  ]
  const xyz = matMul(M_RGB_TO_XYZ, linearRgb)
  const lms = matMul(M_XYZ_TO_LMS, xyz)
  const lmsCubeRoot: [number, number, number] = [
    Math.cbrt(lms[0]),
    Math.cbrt(lms[1]),
    Math.cbrt(lms[2]),
  ]
  const [labL, labA, labB] = matMul(M_LMS_TO_LAB, lmsCubeRoot)
  const chroma = Math.sqrt(labA * labA + labB * labB)
  // Treat near-zero chroma as achromatic (hue is undefined — set to 0)
  const hue = chroma < 0.0001 ? 0 : Math.atan2(labB, labA)
  return [labL, chroma, hue]
}

/**
 * Converts OKLCH [L, C, h] back to sRGB [r, g, b] (0–255, clamped).
 */
export function oklchToRgb(L: number, C: number, h: number): [number, number, number] {
  const labA = C * Math.cos(h)
  const labB = C * Math.sin(h)
  const lmsCubeRoot = matMul(M_LAB_TO_LMS, [L, labA, labB])
  const lms: [number, number, number] = [
    lmsCubeRoot[0] ** 3,
    lmsCubeRoot[1] ** 3,
    lmsCubeRoot[2] ** 3,
  ]
  const xyz = matMul(M_LMS_TO_XYZ, lms)
  const linearRgb = matMul(M_XYZ_TO_RGB, xyz)
  return [
    Math.round(Math.max(0, Math.min(255, delinearize(linearRgb[0]) * 255))),
    Math.round(Math.max(0, Math.min(255, delinearize(linearRgb[1]) * 255))),
    Math.round(Math.max(0, Math.min(255, delinearize(linearRgb[2]) * 255))),
  ]
}

/**
 * Shifts the OKLCH lightness of a hex color by `delta` (−1 to +1).
 * Negative delta = darker, positive delta = lighter.
 * Equal deltas produce equal perceived lightness changes regardless of hue.
 */
export function adjustLightness(hex: string, delta: number): string {
  const [r, g, b] = parseHex(hex)
  const [L, C, h] = rgbToOklch(r, g, b)
  const newL = Math.max(0, Math.min(1, L + delta))
  return rgbToHex(oklchToRgb(newL, C, h))
}

// ─── Ticket 3: setAlpha ───────────────────────────────────────────────────────

/**
 * Returns an rgba() CSS string for the given hex color at the specified alpha (0–1).
 */
export function setAlpha(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

// ─── Ticket 4: WCAG functions + pickContrastColor ────────────────────────────

/**
 * Computes WCAG relative luminance (0–1) for a hex color.
 * Formula: IEC 61966-2-1 — 0.2126R + 0.7152G + 0.0722B (linear channels).
 */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex)
  const linearR = linearize(r / 255)
  const linearG = linearize(g / 255)
  const linearB = linearize(b / 255)
  return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB
}

/**
 * Computes the WCAG contrast ratio between two hex colors (1–21).
 * Order-independent: contrastRatio(a, b) === contrastRatio(b, a).
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const L1 = relativeLuminance(hex1)
  const L2 = relativeLuminance(hex2)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Returns the label color (#141414 or #FFFFFF) that achieves higher contrast
 * against the given base color. Uses WCAG relative luminance — mathematically
 * correct for accessibility, unlike a flat lightness threshold.
 */
export function pickContrastColor(base: string): "#141414" | "#FFFFFF" {
  const contrastWithDark = contrastRatio(base, "#141414")
  const contrastWithLight = contrastRatio(base, "#FFFFFF")
  return contrastWithDark >= contrastWithLight ? "#141414" : "#FFFFFF"
}
