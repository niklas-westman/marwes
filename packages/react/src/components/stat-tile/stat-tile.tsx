import {
  type StatTileOptions,
  type StatTileTone,
  type StatTileTrendDirection,
  createStatTileRecipe,
} from "@marwes-ui/core"
import type * as React from "react"

export interface StatTileProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "title">,
    Pick<StatTileOptions, "dataAttributes"> {
  label: React.ReactNode
  value: React.ReactNode
  subtitle?: React.ReactNode
  trendValue?: React.ReactNode
  trendDirection?: StatTileTrendDirection
  tone?: StatTileTone
}

export function StatTile(props: StatTileProps): React.ReactElement {
  const {
    className,
    dataAttributes,
    label,
    value,
    subtitle,
    trendValue,
    trendDirection,
    tone,
    ...nativeArticleProps
  } = props
  const kit = createStatTileRecipe({
    ...(tone !== undefined ? { tone } : {}),
    ...(trendDirection !== undefined ? { trendDirection } : {}),
    ...(typeof trendValue === "string" ? { trendValue } : {}),
    ...(dataAttributes !== undefined ? { dataAttributes } : {}),
  })
  const mergedClassName = [kit.className, className].filter(Boolean).join(" ")

  return (
    <article {...nativeArticleProps} {...kit.dataAttributes} className={mergedClassName}>
      <div className={kit.slots.headerClassName}>
        <span className={kit.slots.labelClassName}>{label}</span>
        {trendValue ? (
          <span
            {...kit.trendDataAttributes}
            className={kit.slots.trendClassName}
            aria-label={kit.a11y.trendAriaLabel}
          >
            {kit.trendIcon ? (
              <span className={kit.slots.trendIconClassName} aria-hidden="true">
                {kit.trendIcon}
              </span>
            ) : null}
            <span className={kit.slots.trendValueClassName}>{trendValue}</span>
          </span>
        ) : null}
      </div>
      <div className={kit.slots.valueClassName}>{value}</div>
      {subtitle ? <div className={kit.slots.subtitleClassName}>{subtitle}</div> : null}
    </article>
  )
}
