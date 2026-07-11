import { existsSync, readFileSync, readdirSync } from "node:fs"
import { type ReflectionConfigInput, defineReflection } from "reflection-check"

type AdapterName = "react" | "vue" | "svelte"

type ViewportSize = {
  width: number
  height: number
}

type ComponentFraming = {
  rootSelector?: string
  background?: string
  align?: "center" | "start"
  padding?: number
}

type ComponentProbes = {
  parts: Record<
    string,
    {
      selector: string
      bounds?: boolean
      styles?: string[]
      cssVariables?: string[]
      text?: boolean
    }
  >
}

type FigmaBaselineCase = {
  caseId: string
  mode: string
  figmaFileKey: string
  figmaNodeId: string
  figmaFrameName?: string
  exportScale: 1
  viewport: string
  viewportSize: ViewportSize
  framing?: ComponentFraming
  baseline: string
  portalPath?: string
  comparison?: {
    threshold?: {
      maxDiffPixels?: number
      maxDiffPixelRatio?: number
    }
    strict?: boolean
    blocking?: boolean
    toleranceReason?: string
  }
}

type FigmaReflectionContract = {
  schemaVersion: 1
  family: string
  baselineRoot: string
  figmaFileKey: string
  cases: FigmaBaselineCase[]
}

type MarwesReflectionOptions = {
  adapter: AdapterName
  port: number
}

const reflectionFamiliesRoot = new URL(
  "./packages/design-governance/reflection-families/",
  import.meta.url,
)

const portalEntryByAdapter: Record<AdapterName, string> = {
  react: "./tests/reflection/react-portal.tsx",
  vue: "./tests/reflection/vue-portal.ts",
  svelte: "./tests/reflection/svelte-portal.ts",
}

const portalViteConfigByAdapter: Record<AdapterName, string> = {
  react: "./apps/storybook-react/reflection.vite.config.ts",
  vue: "./apps/storybook-vue/reflection.vite.config.ts",
  svelte: "./apps/storybook-svelte/reflection.vite.config.ts",
}

const loadReflectionContracts = () =>
  readdirSync(reflectionFamiliesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const contractUrl = new URL(`${entry.name}/reflection-contract.json`, reflectionFamiliesRoot)
      if (!existsSync(contractUrl)) return undefined
      return JSON.parse(readFileSync(contractUrl, "utf8")) as FigmaReflectionContract
    })
    .filter((contract): contract is FigmaReflectionContract => contract !== undefined)

const reflectionContracts = loadReflectionContracts()

const portalPathForCase = (family: string, baselineCase: FigmaBaselineCase) => {
  if (baselineCase.portalPath) return baselineCase.portalPath

  if (baselineCase.figmaFrameName) {
    return `/${baselineCase.figmaFrameName.replace(/^\/+/, "")}`
  }

  const familyPrefix = `${family}.`
  const caseName = baselineCase.caseId.startsWith(familyPrefix)
    ? baselineCase.caseId.slice(familyPrefix.length)
    : baselineCase.caseId

  return `/reflection/${family}/${caseName}/${baselineCase.mode}`
}

const runtimeProbesForCase = (): ComponentProbes => ({
  parts: {
    frame: {
      selector: "#reflection-root",
      bounds: true,
      styles: ["backgroundColor", "display", "padding"],
    },
    theme: {
      selector: "#reflection-case-root [data-marwes-theme]",
      bounds: true,
      styles: ["color", "fontFamily", "fontSize", "fontWeight", "lineHeight"],
      cssVariables: [
        "--mw-color-primary-base",
        "--mw-color-surface-primary",
        "--mw-color-text-primary",
        "--mw-radius-sm",
        "--mw-space-2",
      ],
    },
  },
})

const baselineCases = (adapter: AdapterName) =>
  reflectionContracts.flatMap((contract) =>
    contract.cases.map((baselineCase) => ({
      id: `${adapter}.${baselineCase.caseId}.${baselineCase.mode}`,
      path: portalPathForCase(contract.family, baselineCase),
      viewport: baselineCase.viewport,
      viewportSize: baselineCase.viewportSize,
      framing: {
        background: "#ffffff",
        align: "center" as const,
        padding: 0,
        ...baselineCase.framing,
        rootSelector: "#reflection-root",
      },
      baselineRoot: contract.baselineRoot,
      baseline: baselineCase.baseline,
      threshold: baselineCase.comparison?.threshold ?? {
        maxDiffPixels: 0,
        maxDiffPixelRatio: 0,
      },
      strict: baselineCase.comparison?.strict ?? true,
      blocking: baselineCase.comparison?.blocking,
      probes: runtimeProbesForCase(),
      stateNote: [
        `${baselineCase.caseId} ${baselineCase.mode} must match the exported Figma frame ${baselineCase.figmaFrameName ?? baselineCase.figmaNodeId} through the Reflection portal.`,
        baselineCase.comparison?.toleranceReason,
      ]
        .filter(Boolean)
        .join(" "),
    })),
  )

export function defineMarwesReflection({
  adapter,
  port,
}: MarwesReflectionOptions): ReflectionConfigInput {
  const readyUrl = `http://127.0.0.1:${port}`

  return defineReflection({
    project: `marwes-${adapter}`,
    contracts: {
      component: {
        enabled: true,
        portal: {
          entry: portalEntryByAdapter[adapter],
          readyUrl,
          reuseExisting: true,
          timeoutMs: 120_000,
          viteConfig: portalViteConfigByAdapter[adapter],
        },
        cases: baselineCases(adapter),
      },
    },
  })
}
