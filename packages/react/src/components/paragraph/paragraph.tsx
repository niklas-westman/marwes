/**
 * React adapter for Marwes Paragraph component.
 * - Renders semantic <p> using the core paragraph recipe.
 * - Supports size variants: sm/md/lg.
 */

import * as React from "react";
import { paragraphRecipe } from "@marwes/core";
import type { ParagraphOptions, ParagraphSize } from "@marwes/core";
import type { CssVars } from "@marwes/core";
import { useTheme } from "../../provider/use-theme";

type StyleWithVars = React.CSSProperties & CssVars;

export type ParagraphProps = ParagraphOptions & {
  /**
   * Size variant.
   * @default "md"
   */
  size?: ParagraphSize;

  /**
   * Content of the paragraph.
   */
  children?: React.ReactNode;

  /**
   * Additional CSS class names.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

/**
 * Paragraph
 *
 * Semantic text block rendered as `<p>`.
 * Supports size variants for different text contexts.
 *
 * @example Basic usage
 * ```tsx
 * <Paragraph>This is a standard paragraph.</Paragraph>
 * ```
 *
 * @example With size variant
 * ```tsx
 * <Paragraph size="sm">Small text for disclaimers.</Paragraph>
 * <Paragraph size="lg">Emphasized lead paragraph.</Paragraph>
 * ```
 *
 * @example With ID
 * ```tsx
 * <Paragraph id="intro">Introduction text.</Paragraph>
 * ```
 */
export function Paragraph(props: ParagraphProps): React.ReactElement {
  const { children, className: customClassName, style: customStyle, ...opts } = props;
  const theme = useTheme();

  const kit = paragraphRecipe(opts, theme);

  const style = { ...(kit.vars as StyleWithVars), ...customStyle };
  const className = customClassName
    ? `${kit.className} ${customClassName}`
    : kit.className;

  return (
    <p id={kit.a11y.id} className={className} style={style}>
      {children}
    </p>
  );
}
