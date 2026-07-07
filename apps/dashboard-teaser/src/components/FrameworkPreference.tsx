import { createContext, useCallback, useContext, useState } from "react"
import type { ReactNode } from "react"

import type { Framework } from "../sections/installation-recipes"

const STORAGE_KEY = "marwes-dashboard-framework"
const DEFAULT_FRAMEWORK: Framework = "react"

function isFramework(value: unknown): value is Framework {
  return value === "react" || value === "vue" || value === "svelte"
}

function readStoredFramework(): Framework {
  if (typeof window === "undefined") return DEFAULT_FRAMEWORK
  const stored = window.sessionStorage.getItem(STORAGE_KEY)
  return isFramework(stored) ? stored : DEFAULT_FRAMEWORK
}

type FrameworkContextValue = {
  framework: Framework
  setFramework: (value: Framework) => void
}

const FrameworkContext = createContext<FrameworkContextValue | null>(null)

function FrameworkPreferenceProvider({ children }: { children: ReactNode }): JSX.Element {
  const [framework, setFrameworkState] = useState<Framework>(readStoredFramework)

  const setFramework = useCallback((value: Framework) => {
    setFrameworkState(value)
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, value)
    }
  }, [])

  return (
    <FrameworkContext.Provider value={{ framework, setFramework }}>
      {children}
    </FrameworkContext.Provider>
  )
}

function useFrameworkPreference(): FrameworkContextValue {
  const ctx = useContext(FrameworkContext)
  if (!ctx) {
    throw new Error("useFrameworkPreference must be used inside FrameworkPreferenceProvider")
  }
  return ctx
}

export { FrameworkPreferenceProvider, useFrameworkPreference }
