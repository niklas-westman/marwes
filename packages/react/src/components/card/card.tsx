import { createCardRecipe } from "@marwes-ui/core"
import type * as React from "react"

export interface CardProps {
  /** Optional title rendered in a header area above the body */
  title?: React.ReactNode
  /** Card body content */
  children?: React.ReactNode
  className?: string
  id?: string
  /** Data attributes for AI-friendly metadata (used by purpose variants). */
  dataAttributes?: Record<string, string>
}

export function Card(props: CardProps): React.ReactElement {
  const { title, children, className, id, dataAttributes } = props
  const kit = createCardRecipe(dataAttributes ? { dataAttributes } : {})

  return (
    <div
      id={id}
      className={[kit.className, className].filter(Boolean).join(" ")}
      {...kit.dataAttributes}
    >
      {title && (
        <div className="mw-card__header">
          <span className="mw-card__title">{title}</span>
        </div>
      )}
      <div className="mw-card__body">{children}</div>
    </div>
  )
}
