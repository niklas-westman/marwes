/**
 * React adapter for Marwes SkipLink.
 * Visually hidden anchor that becomes visible on focus, lets keyboard
 * users jump to a target landmark (typically <main>).
 */

import { createSkipLinkRecipe } from "@marwes-ui/core"
import type * as React from "react"

export interface SkipLinkProps {
  /** Anchor href, typically a fragment like "#main". */
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink(props: SkipLinkProps): React.ReactElement {
  const { href, children, className } = props
  const kit = createSkipLinkRecipe({ href, className })

  return (
    <a href={href} className={kit.className}>
      {children}
    </a>
  )
}
