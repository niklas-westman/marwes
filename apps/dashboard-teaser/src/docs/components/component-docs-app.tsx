import { MarwesProvider, ThemeMode, useThemeMode } from "@marwes-ui/react"
import type { ComponentType } from "react"
import { useEffect, useLayoutEffect } from "react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

import { GlobalStyle } from "../../theme/global-style"
import type {
  ComponentDocsPageModel,
  FrameworkDocsEntry,
  PublicApiExport,
} from "./component-docs-model"
import { ComponentDocsPage } from "./component-docs-page"
import { getFamilyShowcase } from "./family-showcases"

interface LegacyFrameworkDocsEntry extends Omit<FrameworkDocsEntry, "exports"> {
  components?: string[]
  types?: string[]
  exports?: PublicApiExport[]
}

function normalizeFrameworkEntry(entry: LegacyFrameworkDocsEntry): FrameworkDocsEntry {
  if (Array.isArray(entry.exports)) return entry as FrameworkDocsEntry

  return {
    framework: entry.framework,
    packageName: entry.packageName,
    example: entry.example,
    exports: [
      ...(entry.components ?? []).map((name) => ({ name, kind: "component" as const })),
      ...(entry.types ?? []).map((name) => ({ name, kind: "type" as const })),
    ],
  }
}

function parseComponentDocsPageModel(source: unknown): ComponentDocsPageModel {
  if (!source || typeof source !== "object") {
    throw new TypeError("Component documentation model must be an object")
  }
  const candidate = source as Record<string, unknown>
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.family !== "string" ||
    typeof candidate.title !== "string" ||
    !Array.isArray(candidate.frameworks) ||
    !Array.isArray(candidate.sections)
  ) {
    throw new TypeError("Component documentation model does not match schema version 1")
  }

  return {
    ...(source as ComponentDocsPageModel),
    frameworks: (candidate.frameworks as LegacyFrameworkDocsEntry[]).map(normalizeFrameworkEntry),
  }
}

function readEmbeddedComponentDocsPageModel(
  documentRoot: Document = document,
): ComponentDocsPageModel {
  const source = documentRoot.getElementById("component-docs-model")
  if (!source?.textContent) {
    throw new Error("Missing #component-docs-model JSON")
  }

  try {
    return parseComponentDocsPageModel(JSON.parse(source.textContent))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TypeError("Component documentation model contains invalid JSON", { cause: error })
    }
    throw error
  }
}

function getInitialThemeMode(): ThemeMode {
  if (typeof document === "undefined") return ThemeMode.light
  const root = document.documentElement
  return root.dataset.marwesMode === ThemeMode.dark || root.classList.contains("dark")
    ? ThemeMode.dark
    : ThemeMode.light
}

function SiteThemeMetadata(): null {
  const { mode } = useThemeMode()
  useEffect(() => {
    document.documentElement.dataset.marwesMode = mode
    document.documentElement.style.colorScheme = mode
  }, [mode])
  return null
}

function StaticFallbackHandoff(): null {
  useLayoutEffect(() => {
    document.getElementById("root")?.removeAttribute("data-static-docs")
    let targetId = ""
    try {
      targetId = decodeURIComponent(window.location.hash.replace(/^#/, ""))
    } catch {
      return
    }
    const target = targetId ? document.getElementById(targetId) : null
    if (!target?.scrollIntoView) return

    const previousScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = "auto"
    target.scrollIntoView()
    document.documentElement.style.scrollBehavior = previousScrollBehavior
  }, [])
  return null
}

function ComponentDocsApp({
  model,
  Showcase,
}: {
  model: ComponentDocsPageModel
  Showcase?: ComponentType
}): JSX.Element {
  const ResolvedShowcase = Showcase ?? getFamilyShowcase(model.family)

  return (
    <MarwesProvider
      defaultMode={getInitialThemeMode()}
      storageKey="marwes-site-theme"
      target="html"
      disableTransitionOnChange
    >
      {(theme) => (
        <StyledThemeProvider theme={theme}>
          <StaticFallbackHandoff />
          <SiteThemeMetadata />
          <GlobalStyle />
          <ComponentDocsPage model={model} Showcase={ResolvedShowcase} />
        </StyledThemeProvider>
      )}
    </MarwesProvider>
  )
}

export {
  ComponentDocsApp,
  getInitialThemeMode,
  parseComponentDocsPageModel,
  readEmbeddedComponentDocsPageModel,
}
