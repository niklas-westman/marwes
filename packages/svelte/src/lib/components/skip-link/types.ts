import type { Snippet } from "svelte"

export interface SkipLinkProps {
  /** Anchor href, typically a fragment like "#main". */
  href: string
  children: Snippet
  class?: string
}
