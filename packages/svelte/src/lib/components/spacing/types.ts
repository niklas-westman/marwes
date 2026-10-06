import type { SpacingOptions } from "@marwes-ui/core"
import type { HTMLAttributes } from "svelte/elements"

export interface SpacingProps
  extends SpacingOptions,
    Omit<HTMLAttributes<HTMLDivElement>, "class" | "style" | "children" | "id"> {
  class?: string
  style?: string | undefined
}

/** Spacer is an alias for Spacing. */
export type SpacerProps = SpacingProps
