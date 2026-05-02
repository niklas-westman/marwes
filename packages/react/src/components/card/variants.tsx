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

export type StatCardProps = CardProps

export function StatCard(props: StatCardProps): React.ReactElement {
  return (
    <Card
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "stat-card",
      }}
    />
  )
}
