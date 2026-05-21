import type { DrawerOptions, DrawerPlacement, DrawerSize } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface DrawerProps extends DrawerOptions {
  id?: string
  title?: string
  description?: string
  children?: Snippet
  footer?: Snippet<[{ close: () => void }]>
  onclose?: () => void
  class?: string
  panelClass?: string
  dataAttributes?: Record<string, string>
}

export type { DrawerPlacement, DrawerSize }
