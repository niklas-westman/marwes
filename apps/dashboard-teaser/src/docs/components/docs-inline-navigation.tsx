import { createContext } from "react"
import type { ReactNode } from "react"

// The shell owns scrollspy; page heroes place its compact navigation after the intro.
export const DocsInlineNavigationContext = createContext<ReactNode>(null)
