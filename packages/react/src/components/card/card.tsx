import { createCardRecipe } from "@marwes-ui/core"
import type * as React from "react"

export interface CardProps {
  /** Optional title rendered in a header area above the body */
  title?: React.ReactNode
  /** Card body content */
  children?: React.ReactNode
  className?: string
  id?: string
}

export function Card(props: CardProps): React.ReactElement {
  const { title, children, className, id } = props
  const kit = createCardRecipe()

  return (
    <div id={id} className={[kit.className, className].filter(Boolean).join(" ")}>
      {title && (
        <div className="mw-card__header">
          <span className="mw-card__title">{title}</span>
        </div>
      )}
      <div className="mw-card__body">{children}</div>
    </div>
  )
}
