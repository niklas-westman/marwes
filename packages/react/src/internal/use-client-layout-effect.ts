import { useEffect, useLayoutEffect } from "react"

// Keep pre-paint DOM synchronization in browsers; layout effects cannot run on the server.
export const useClientLayoutEffect: typeof useLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect
