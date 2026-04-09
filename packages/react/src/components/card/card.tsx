import { createCardRecipe } from "@marwes-ui/core"
import type * as React from "react"

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional title rendered above the body content */
  title?: React.ReactNode
  /** Card body content */
  children?: React.ReactNode
  /** Data attributes for AI-friendly metadata (used by purpose variants). */
  dataAttributes?: Record<string, string>
}

export function Card(props: CardProps): React.ReactElement {
  const { title, children, className, dataAttributes, ...nativeDivProps } = props
  const kit = createCardRecipe(dataAttributes ? { dataAttributes } : {})

  return (
    <div
      {...nativeDivProps}
      {...kit.dataAttributes}
      className={[kit.className, className].filter(Boolean).join(" ")}
    >
      {title ? (
        <div className="mw-card__header">
          <span className="mw-card__title">{title}</span>
        </div>
      ) : null}
      <div className="mw-card__body">{children}</div>
    </div>
  )
}
