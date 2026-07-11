import type { CardOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface CardProps extends CardOptions {
  /** Optional title rendered above the body content */
  title?: Snippet | string
  /** Card body content */
  children?: Snippet
  class?: string
  id?: string
  ariaDisabled?: boolean | "true" | "false"
}

export type ProductCardProps = CardProps
export type ProfileCardProps = CardProps
export type StatCardProps = CardProps
