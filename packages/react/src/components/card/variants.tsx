import type * as React from "react"
import { Card, type CardProps } from "./card"

export type ProductCardProps = CardProps

export function ProductCard(props: ProductCardProps): React.ReactElement {
  return (
    <Card
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "product-card",
      }}
    />
  )
}

export type ProfileCardProps = CardProps

export function ProfileCard(props: ProfileCardProps): React.ReactElement {
  return (
    <Card
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "profile-card",
      }}
    />
  )
}

export interface StatCardProps extends CardProps {
  /** Primary metric value rendered with metric-tile semantics. */
  value?: React.ReactNode
  /** Supporting label or explanatory note for the metric. */
  note?: React.ReactNode
  /** Optional trend, status, or comparison content. */
  meta?: React.ReactNode
}

export function StatCard(props: StatCardProps): React.ReactElement {
  const { value, note, meta, children, ...cardProps } = props
  const hasMetricTileContent = value !== undefined || note !== undefined || meta !== undefined

  return (
    <Card
      {...cardProps}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "stat-card",
      }}
    >
      {hasMetricTileContent ? (
        <div className="mw-stat-card__metric" data-slot="metric-tile">
          {value !== undefined ? <strong className="mw-stat-card__value">{value}</strong> : null}
          {note !== undefined ? <span className="mw-stat-card__note">{note}</span> : null}
          {meta !== undefined ? <span className="mw-stat-card__meta">{meta}</span> : null}
        </div>
      ) : (
        children
      )}
    </Card>
  )
}
