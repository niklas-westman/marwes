import type { ReactNode } from "react"

import { useRevealOnScroll } from "../hooks/use-reveal-on-scroll"

type RevealProps = {
  children: ReactNode
}

/**
 * Wraps a section with a scroll-triggered fade-up. The wrapper is a plain
 * <div> so it inherits into whatever flex/grid parent it's placed in; the
 * fade CSS lives in GlobalStyle and keys off `data-reveal`.
 */
function Reveal({ children }: RevealProps): JSX.Element {
  const { ref, state } = useRevealOnScroll<HTMLDivElement>()
  return (
    <div ref={ref} data-reveal={state}>
      {children}
    </div>
  )
}

export { Reveal }
export type { RevealProps }
