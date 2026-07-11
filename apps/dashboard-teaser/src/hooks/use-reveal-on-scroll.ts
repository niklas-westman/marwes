import { type RefObject, useEffect, useRef, useState } from "react"

type RevealState = "pending" | "in"

/**
 * Attaches an IntersectionObserver to the returned ref and flips state to
 * "in" the first time the element enters the viewport. Falls back to
 * immediate reveal in environments without IntersectionObserver (jsdom,
 * SSR) so tests and non-DOM contexts don't get stuck at opacity 0.
 */
function useRevealOnScroll<T extends HTMLElement>(): {
  ref: RefObject<T | null>
  state: RevealState
} {
  const ref = useRef<T | null>(null)
  const [state, setState] = useState<RevealState>("pending")

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setState("in")
      return
    }
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("in")
            observer.disconnect()
            return
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, state }
}

export { useRevealOnScroll }
export type { RevealState }
