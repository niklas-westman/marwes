import { useEffect, useState } from "react"

function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent): void => setMatches(event.matches)
    mq.addEventListener("change", handler)
    setMatches(mq.matches)
    return () => mq.removeEventListener("change", handler)
  }, [query])

  return matches
}

function useIsCompactBreakpoint(): boolean {
  return useMatchMedia("(max-width: 1199px)")
}

function useIsMobileBreakpoint(): boolean {
  return useMatchMedia("(max-width: 767px)")
}

export { useIsCompactBreakpoint, useIsMobileBreakpoint }
