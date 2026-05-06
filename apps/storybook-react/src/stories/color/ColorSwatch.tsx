import { useState } from "react"
import "./ColorSwatch.css"
import { Paragraph } from "@marwes-ui/react"

export interface ColorSwatchProps {
  /** Display name of the color */
  name: string
  /** Hex color value */
  hex: string
  /** CSS variable name (e.g., --mw-color-primary-base) */
  cssVar: string
  /** Optional description */
  description?: string
  /** Optional usage examples */
  usage?: string
}

export function ColorSwatch({ name, hex, cssVar, description, usage }: ColorSwatchProps) {
  const [copied, setCopied] = useState<"hex" | "var" | null>(null)

  const copyToClipboard = (text: string, type: "hex" | "var") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  // Resolve readable text against the rendered swatch color, including alpha tokens.
  const getContrastColor = (hexColor: string): string => {
    const toLinear = (channel: number) => {
      const value = channel / 255
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    }
    const luminance = ([r, g, b]: [number, number, number]) =>
      0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
    const contrast = (
      foreground: [number, number, number],
      background: [number, number, number],
    ) => {
      const lighter = Math.max(luminance(foreground), luminance(background))
      const darker = Math.min(luminance(foreground), luminance(background))
      return (lighter + 0.05) / (darker + 0.05)
    }
    const compositeOverWhite = ([r, g, b, a]: [number, number, number, number]) =>
      [
        Math.round(r * a + 255 * (1 - a)),
        Math.round(g * a + 255 * (1 - a)),
        Math.round(b * a + 255 * (1 - a)),
      ] as [number, number, number]

    const rgbaMatch = hexColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/i)
    const rgba = rgbaMatch
      ? ([
          Number(rgbaMatch[1]),
          Number(rgbaMatch[2]),
          Number(rgbaMatch[3]),
          Number(rgbaMatch[4] ?? 1),
        ] as [number, number, number, number])
      : undefined

    const value = hexColor.replace("#", "")
    const normalized =
      value.length === 3
        ? value
            .split("")
            .map((part) => `${part}${part}`)
            .join("")
        : value
    const hexRgba = /^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(normalized)
      ? ([
          Number.parseInt(normalized.slice(0, 2), 16),
          Number.parseInt(normalized.slice(2, 4), 16),
          Number.parseInt(normalized.slice(4, 6), 16),
          normalized.length === 8 ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1,
        ] as [number, number, number, number])
      : undefined

    const background = rgba ?? hexRgba
    if (!background) return "#141414"

    const renderedBackground = compositeOverWhite(background)
    const black: [number, number, number] = [0, 0, 0]
    const white: [number, number, number] = [255, 255, 255]

    return contrast(black, renderedBackground) >= contrast(white, renderedBackground)
      ? "#141414"
      : "#FFFFFF"
  }

  const textColor = getContrastColor(hex)

  return (
    <div className="color-swatch">
      <div className="color-swatch__preview" style={{ backgroundColor: hex }}>
        <Paragraph style={{ color: textColor }}>{hex}</Paragraph>
      </div>

      <div className="color-swatch__info">
        <Paragraph>{name}</Paragraph>

        <div className="color-swatch__values">
          <button
            type="button"
            className="color-swatch__value"
            onClick={() => copyToClipboard(hex, "hex")}
            title="Click to copy hex value"
          >
            <Paragraph size="sm" className="color-swatch__value-label">
              HEX:
            </Paragraph>
            <Paragraph size="sm" className="color-swatch__value-text">
              {hex}
            </Paragraph>
            {copied === "hex" && <span className="color-swatch__copied">✓</span>}
          </button>

          <button
            type="button"
            className="color-swatch__value"
            onClick={() => copyToClipboard(cssVar, "var")}
            title="Click to copy CSS variable"
          >
            <Paragraph size="sm">CSS:</Paragraph>
            <Paragraph size="sm">{cssVar}</Paragraph>
            {copied === "var" && <span className="color-swatch__copied">✓</span>}
          </button>
        </div>

        {description && <Paragraph size="sm">{description}</Paragraph>}

        {usage && (
          <Paragraph size="sm">
            <strong>Usage:</strong> {usage}
          </Paragraph>
        )}
      </div>
    </div>
  )
}
