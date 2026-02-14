import { useState } from "react";
import "./ColorSwatch.css";
import { Paragraph } from "@marwes/react";

export interface ColorSwatchProps {
  /** Display name of the color */
  name: string;
  /** Hex color value */
  hex: string;
  /** CSS variable name (e.g., --mw-primary) */
  cssVar: string;
  /** Optional description */
  description?: string;
  /** Optional usage examples */
  usage?: string;
}

export function ColorSwatch({
  name,
  hex,
  cssVar,
  description,
  usage,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState<"hex" | "var" | null>(null);

  const copyToClipboard = (text: string, type: "hex" | "var") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Calculate contrast ratio for text color
  const getContrastColor = (hexColor: string): string => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 165 ? "#000000" : "#FFFFFF";
  };

  const textColor = getContrastColor(hex);

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
            <Paragraph size="sm" style={{ color: textColor }}>
              HEX:
            </Paragraph>
            <Paragraph size="sm" style={{ color: textColor }}>
              {hex}
            </Paragraph>
            {copied === "hex" && (
              <span className="color-swatch__copied">✓</span>
            )}
          </button>

          <button
            type="button"
            className="color-swatch__value"
            onClick={() => copyToClipboard(cssVar, "var")}
            title="Click to copy CSS variable"
          >
            <Paragraph size="sm">CSS:</Paragraph>
            <Paragraph size="sm">{cssVar}</Paragraph>
            {copied === "var" && (
              <span className="color-swatch__copied">✓</span>
            )}
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
  );
}
