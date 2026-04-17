import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { existsSync, mkdirSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import {
  canonicalSemanticAttributeRegistry,
  familySemanticsRegistry,
  purposeSemanticsRegistry,
} from "../packages/core/src/semantics/index"

const repoRoot = resolve(import.meta.dirname, "..")

type GenerationMode = "write" | "check"

const mode: GenerationMode = process.argv.includes("--check") ? "check" : "write"
const outputRoot =
  mode === "check"
    ? mkdtempSync(join(tmpdir(), "marwes-artifacts-"))
    : resolve(repoRoot, "artifacts")

interface FamilyArtifactSource {
  displayName: string
  familyDir: string
  reactComponentDir: string
  vueComponentDir: string
  presetCssPath: string | null
  reactStoryDir: string | null
  vueStoryDir: string | null
  contractPaths: string[]
  figmaReferences: string[]
}

const familyArtifactSources: Record<string, FamilyArtifactSource> = {
  button: {
    displayName: "Button",
    familyDir: "packages/core/src/components/atoms/button",
    reactComponentDir: "packages/react/src/components/button",
    vueComponentDir: "packages/vue/src/components/button",
    presetCssPath: "packages/presets/src/firstEdition/button.css",
    reactStoryDir: "apps/storybook-react/src/stories/button",
    vueStoryDir: "apps/storybook-vue/src/stories/button",
    contractPaths: ["tests/contracts/button.contract.ts"],
    figmaReferences: [".figma/marwes/components/button.json"],
  },
  badge: {
    displayName: "Badge",
    familyDir: "packages/core/src/components/atoms/badge",
    reactComponentDir: "packages/react/src/components/badge",
    vueComponentDir: "packages/vue/src/components/badge",
    presetCssPath: "packages/presets/src/firstEdition/badge.css",
    reactStoryDir: "apps/storybook-react/src/stories/badge",
    vueStoryDir: "apps/storybook-vue/src/stories/badge",
    contractPaths: ["tests/contracts/badge.contract.ts"],
    figmaReferences: [".figma/marwes/components/badge.json"],
  },
  avatar: {
    displayName: "Avatar",
    familyDir: "packages/core/src/components/atoms/avatar",
    reactComponentDir: "packages/react/src/components/avatar",
    vueComponentDir: "packages/vue/src/components/avatar",
    presetCssPath: "packages/presets/src/firstEdition/avatar.css",
    reactStoryDir: "apps/storybook-react/src/stories/avatar",
    vueStoryDir: "apps/storybook-vue/src/stories/avatar",
    contractPaths: [
      "tests/contracts/avatar.contract.ts",
      "tests/contracts/avatar-badge.contract.ts",
      "tests/contracts/avatar-group.contract.ts",
    ],
    figmaReferences: [".figma/marwes/components/avatar.json"],
  },
  toast: {
    displayName: "Toast",
    familyDir: "packages/core/src/components/atoms/toast",
    reactComponentDir: "packages/react/src/components/toast",
    vueComponentDir: "packages/vue/src/components/toast",
    presetCssPath: null,
    reactStoryDir: "apps/storybook-react/src/stories/toast",
    vueStoryDir: "apps/storybook-vue/src/stories/toast",
    contractPaths: ["tests/contracts/toast.contract.ts"],
    figmaReferences: [".figma/marwes/components/toast.json"],
  },
  dialog: {
    displayName: "Dialog",
    familyDir: "packages/core/src/components/atoms/dialog",
    reactComponentDir: "packages/react/src/components/dialog",
    vueComponentDir: "packages/vue/src/components/dialog",
    presetCssPath: null,
    reactStoryDir: "apps/storybook-react/src/stories/dialog",
    vueStoryDir: "apps/storybook-vue/src/stories/dialog",
    contractPaths: ["tests/contracts/dialog.contract.ts"],
    figmaReferences: [".figma/marwes/components/dialog.json"],
  },
}

function relativePath(path: string): string {
  return path.replace(`${repoRoot}/`, "")
}

function pathExists(relativeRepoPath: string | null): boolean {
  return relativeRepoPath ? existsSync(resolve(repoRoot, relativeRepoPath)) : false
}

function writeJson(relativeOutputPath: string, data: unknown): void {
  const absoluteOutputPath = resolve(outputRoot, relativeOutputPath)
  mkdirSync(dirname(absoluteOutputPath), { recursive: true })
  writeFileSync(absoluteOutputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

function buildComponentManifest(): unknown {
  return {
    version: 1,
    components: Object.values(familySemanticsRegistry).map((familySemantics) => {
      const familySource = familyArtifactSources[familySemantics.family]
      const familyPurposes = Object.values(purposeSemanticsRegistry)
        .filter((purposeSemantics) => purposeSemantics.family === familySemantics.family)
        .map((purposeSemantics) => purposeSemantics.purpose)
        .sort()

      return {
        name: familySource.displayName,
        family: familySemantics.family,
        component: familySemantics.baseAttributes["data-component"],
        defaultLayer: familySemantics.defaultLayer,
        canonicalAttributes: familySemantics.canonicalAttributes,
        semanticAttributes: canonicalSemanticAttributeRegistry
          .filter((attributeDefinition) =>
            familySemantics.canonicalAttributes.includes(attributeDefinition.name),
          )
          .map((attributeDefinition) => attributeDefinition.name),
        purposeWrappers: familyPurposes,
        frameworks: ["react", "vue"],
        sourcePaths: {
          core: familySource.familyDir,
          react: familySource.reactComponentDir,
          vue: familySource.vueComponentDir,
          presetCss: familySource.presetCssPath,
        },
      }
    }),
  }
}

function buildPurposeRegistry(): unknown {
  return {
    version: 1,
    purposes: Object.values(purposeSemanticsRegistry)
      .map((purposeSemantics) => ({
        name: purposeSemantics.purpose,
        family: purposeSemantics.family,
        layer: purposeSemantics.layer,
        attributes: purposeSemantics.attributes,
        frameworks: [...purposeSemantics.supportedFrameworks],
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  }
}

function buildFrameworkParityMatrix(): unknown {
  return {
    version: 1,
    families: Object.values(familySemanticsRegistry).map((familySemantics) => {
      const familySource = familyArtifactSources[familySemantics.family]
      const reactSupported = pathExists(familySource.reactComponentDir)
      const vueSupported = pathExists(familySource.vueComponentDir)
      const contractCoverage = familySource.contractPaths.every((contractPath) =>
        pathExists(contractPath),
      )
      const storyCoverage = Boolean(
        pathExists(familySource.reactStoryDir) && pathExists(familySource.vueStoryDir),
      )

      return {
        family: familySemantics.family,
        react: reactSupported,
        vue: vueSupported,
        metadataParity: reactSupported && vueSupported,
        contractCoverage,
        storyCoverage,
      }
    }),
  }
}

function buildDesignProvenanceMap(): unknown {
  return {
    version: 1,
    families: Object.values(familySemanticsRegistry).map((familySemantics) => {
      const familySource = familyArtifactSources[familySemantics.family]

      return {
        family: familySemantics.family,
        figma: familySource.figmaReferences,
        source: {
          core: familySource.familyDir,
          react: familySource.reactComponentDir,
          vue: familySource.vueComponentDir,
        },
        presetCss: familySource.presetCssPath,
        stories: {
          react: familySource.reactStoryDir,
          vue: familySource.vueStoryDir,
        },
        contracts: familySource.contractPaths,
      }
    }),
  }
}

function expectedArtifactPaths(): string[] {
  return [
    "component-manifest.json",
    "purpose-registry.json",
    "framework-parity.json",
    "design-provenance.json",
  ]
}

function compareArtifacts(): void {
  for (const artifactPath of expectedArtifactPaths()) {
    const generatedFilePath = resolve(outputRoot, artifactPath)
    const committedFilePath = resolve(repoRoot, "artifacts", artifactPath)

    if (!existsSync(committedFilePath)) {
      throw new Error(`Missing committed artifact: artifacts/${artifactPath}`)
    }

    const generatedContents = readFileSync(generatedFilePath, "utf8")
    const committedContents = readFileSync(committedFilePath, "utf8")
    const generatedData = JSON.parse(generatedContents) as unknown
    const committedData = JSON.parse(committedContents) as unknown

    if (JSON.stringify(generatedData) !== JSON.stringify(committedData)) {
      throw new Error(`Artifact is stale: artifacts/${artifactPath}. Run: pnpm artifacts:generate`)
    }
  }
}

writeJson("component-manifest.json", buildComponentManifest())
writeJson("purpose-registry.json", buildPurposeRegistry())
writeJson("framework-parity.json", buildFrameworkParityMatrix())
writeJson("design-provenance.json", buildDesignProvenanceMap())

if (mode === "check") {
  try {
    compareArtifacts()
    console.log("✓ Trust artifacts are up to date")
  } finally {
    rmSync(outputRoot, { recursive: true, force: true })
  }
} else {
  console.log(`✓ Generated trust artifacts in ${relativePath(outputRoot)}`)
}
