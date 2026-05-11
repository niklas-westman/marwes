import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import {
  familySemanticsRegistry,
  purposeSemanticsRegistry,
} from "../packages/core/src/semantics/index"
import { type RegistryFamilySource, registryFamilySources } from "./component-registry-sources"

const repoRoot = resolve(import.meta.dirname, "..")

type GenerationMode = "write" | "check"

const mode: GenerationMode = process.argv.includes("--check") ? "check" : "write"
const outputRoot =
  mode === "check" ? mkdtempSync(join(tmpdir(), "marwes-component-registry-")) : repoRoot

interface FamilyMeta {
  $schema?: string
  family: string
  displayName: string
  axe?: {
    roadmapAnchors?: string[]
  }
}

function resolveRepoPath(relativeRepoPath: string): string {
  return resolve(repoRoot, relativeRepoPath)
}

function pathExists(relativeRepoPath: string | null): boolean {
  return relativeRepoPath ? existsSync(resolveRepoPath(relativeRepoPath)) : false
}

function relativePath(path: string): string {
  return path.replace(`${repoRoot}/`, "")
}

function isGeneratedSourceArtifact(relativeRepoPath: string): boolean {
  if (!/^packages\/[^/]+\/src\//.test(relativeRepoPath)) return false

  return /\.(?:d\.ts|js|js\.map|d\.ts\.map)$/.test(relativeRepoPath)
}

function listFilesRecursively(relativeDirPath: string): string[] {
  if (!pathExists(relativeDirPath)) return []

  const absoluteDirPath = resolveRepoPath(relativeDirPath)
  const discoveredPaths: string[] = []

  function visitDirectory(absolutePath: string): void {
    for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
      const absoluteEntryPath = join(absolutePath, entry.name)

      if (entry.isDirectory()) {
        visitDirectory(absoluteEntryPath)
        continue
      }

      if (entry.isFile()) {
        const discoveredPath = relativePath(absoluteEntryPath)

        if (!isGeneratedSourceArtifact(discoveredPath)) {
          discoveredPaths.push(discoveredPath)
        }
      }
    }
  }

  visitDirectory(absoluteDirPath)
  return discoveredPaths.sort((left, right) => left.localeCompare(right))
}

function existingPaths(paths: string[]): string[] {
  return paths.filter((path) => pathExists(path))
}

function readJsonFile<T>(relativeRepoPath: string): T {
  return JSON.parse(readFileSync(resolveRepoPath(relativeRepoPath), "utf8")) as T
}

function writeJson(relativeOutputPath: string, data: unknown): void {
  const absoluteOutputPath = resolve(outputRoot, relativeOutputPath)
  mkdirSync(dirname(absoluteOutputPath), { recursive: true })
  writeFileSync(absoluteOutputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

function stripSchemaField<T extends Record<string, unknown>>(data: T): Omit<T, "$schema"> {
  const { $schema: _schema, ...rest } = data
  return rest
}

function getPurposeAttributesForFamily(family: string): Record<string, Record<string, string>> {
  return Object.values(purposeSemanticsRegistry)
    .filter((purposeSemantics) => purposeSemantics.family === family)
    .sort((left, right) => left.purpose.localeCompare(right.purpose))
    .reduce<Record<string, Record<string, string>>>((purposeAttributes, purposeSemantics) => {
      purposeAttributes[purposeSemantics.purpose] = Object.fromEntries(
        Object.entries(purposeSemantics.attributes).map(([attributeName, attributeValue]) => [
          attributeName,
          String(attributeValue),
        ]),
      )
      return purposeAttributes
    }, {})
}

function discoverRegistryFamilies(): Array<{
  familyDir: string
  metaPath: string
  meta: FamilyMeta
}> {
  const familiesRoot = resolveRepoPath("docs/registry/families")

  if (!existsSync(familiesRoot)) return []

  return readdirSync(familiesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const familyDir = `docs/registry/families/${entry.name}`
      const metaPath = `${familyDir}/registry.meta.json`

      if (!pathExists(metaPath)) {
        throw new Error(`Missing registry meta file: ${metaPath}`)
      }

      const meta = readJsonFile<FamilyMeta>(metaPath)
      return { familyDir, metaPath, meta }
    })
    .sort((left, right) => left.meta.family.localeCompare(right.meta.family))
}

function buildSemanticsOutput(
  family: string,
  source: RegistryFamilySource,
): {
  coverageLevel: "canonical" | "family-local" | "none"
  dataComponent: string | null
  canonicalAttributes: string[]
  allowedPurposes: string[]
  purposeAttributes: Record<string, Record<string, string>>
  sourceOfTruthPaths: string[]
  notes: string[]
} {
  const familySemantics = familySemanticsRegistry[family]

  if (familySemantics) {
    return {
      coverageLevel: "canonical",
      dataComponent: familySemantics.baseAttributes["data-component"],
      canonicalAttributes: [...familySemantics.canonicalAttributes],
      allowedPurposes: [...familySemantics.allowedPurposes],
      purposeAttributes: getPurposeAttributesForFamily(family),
      sourceOfTruthPaths: [
        "packages/core/src/semantics/family-semantics.ts",
        "packages/core/src/semantics/purpose-semantics.ts",
      ],
      notes: [familySemantics.notes],
    }
  }

  if (source.semantics) {
    return {
      coverageLevel: source.semantics.coverageLevel,
      dataComponent: source.semantics.dataComponent,
      canonicalAttributes: [...source.semantics.canonicalAttributes],
      allowedPurposes: [...source.semantics.allowedPurposes],
      purposeAttributes: { ...source.semantics.purposeAttributes },
      sourceOfTruthPaths: [...source.semantics.sourceOfTruthPaths],
      notes: [...(source.semantics.notes ?? [])],
    }
  }

  return {
    coverageLevel: "none",
    dataComponent: null,
    canonicalAttributes: [],
    allowedPurposes: [],
    purposeAttributes: {},
    sourceOfTruthPaths: [],
    notes: ["No semantic registry source has been configured for this family yet."],
  }
}

function buildGeneratedFamilyRegistry(
  family: string,
  meta: FamilyMeta,
  source: RegistryFamilySource,
): Record<string, unknown> {
  const auditPaths = [source.auditIndexPath]
  if (source.familyAuditDocPath && pathExists(source.familyAuditDocPath)) {
    auditPaths.push(source.familyAuditDocPath)
  }

  const figmaReferencePaths = [
    ...source.figma.componentJsons,
    ...source.figma.curatedReferences,
    ...source.figma.pageReferences,
  ]
  const semantics = buildSemanticsOutput(family, source)

  return {
    $schema: "../../schema/component-family.generated.schema.json",
    family,
    generationStatus: "generated",
    links: {
      referenceDocs: existingPaths(source.referenceDocs),
      guides: existingPaths(source.guides),
      audits: existingPaths(auditPaths),
      roadmap: (meta.axe?.roadmapAnchors ?? []).slice(),
      core: listFilesRecursively(source.coreDir),
      presets: existingPaths(source.presetPaths),
      react: listFilesRecursively(source.reactDir),
      vue: listFilesRecursively(source.vueDir),
      storybookReact: listFilesRecursively(source.storybookReactDir),
      storybookVue: listFilesRecursively(source.storybookVueDir),
      contracts: existingPaths(source.contractPaths),
    },
    semantics,
    design: {
      componentJsons: [...source.figma.componentJsons],
      curatedReferences: [...source.figma.curatedReferences],
      pageReferences: [...source.figma.pageReferences],
      nodeReferences: { ...source.figma.nodeReferences },
      figmaTokens: [...source.figma.figmaTokens],
      figmaStates: {
        baseVariants: [...source.figma.figmaStates.baseVariants],
        interactionStates: [...source.figma.figmaStates.interactionStates],
      },
    },
    coverage: {
      react: pathExists(source.reactDir),
      vue: pathExists(source.vueDir),
      storybookReact: pathExists(source.storybookReactDir),
      storybookVue: pathExists(source.storybookVueDir),
      contractsPresent: source.contractPaths.every((contractPath) => pathExists(contractPath)),
      auditDocPresent: source.familyAuditDocPath ? pathExists(source.familyAuditDocPath) : false,
      figmaReferencesPresent: figmaReferencePaths.length > 0,
    },
    notes: [
      ...semantics.notes,
      `Generated from docs/registry/families/${family}/registry.meta.json and scripts/generate-component-registry.ts.`,
    ],
  }
}

function buildRegistryArtifact(
  families: Array<{
    family: string
    familyDir: string
    metaPath: string
    generatedPath: string
    meta: FamilyMeta
    generated: Record<string, unknown>
  }>,
): Record<string, unknown> {
  return {
    $schema: "../docs/registry/schema/component-registry.schema.json",
    version: 1,
    families: families.map((familyEntry) => ({
      family: familyEntry.family,
      readmePath: `${familyEntry.familyDir}/README.md`,
      metaPath: familyEntry.metaPath,
      generatedPath: familyEntry.generatedPath,
      visualPaths: listFilesRecursively(`${familyEntry.familyDir}/visuals`),
      previewPaths: listFilesRecursively(`${familyEntry.familyDir}/previews`),
      meta: stripSchemaField(familyEntry.meta),
      generated: stripSchemaField(familyEntry.generated),
    })),
  }
}

function compareGeneratedFile(relativeOutputPath: string): void {
  const generatedFilePath = resolve(outputRoot, relativeOutputPath)
  const committedFilePath = resolveRepoPath(relativeOutputPath)

  if (!existsSync(committedFilePath)) {
    throw new Error(`Missing committed file: ${relativeOutputPath}`)
  }

  const generatedContents = readFileSync(generatedFilePath, "utf8")
  const committedContents = readFileSync(committedFilePath, "utf8")
  const generatedData = JSON.parse(generatedContents) as unknown
  const committedData = JSON.parse(committedContents) as unknown

  if (JSON.stringify(generatedData) !== JSON.stringify(committedData)) {
    throw new Error(
      `Registry artifact is stale: ${relativeOutputPath}. Run: pnpm registry:generate`,
    )
  }
}

const discoveredFamilies = discoverRegistryFamilies().map(({ familyDir, metaPath, meta }) => {
  const source = registryFamilySources[meta.family]

  if (!source) {
    throw new Error(`Missing registry source config for family: ${meta.family}`)
  }

  const generated = buildGeneratedFamilyRegistry(meta.family, meta, source)
  const generatedPath = `${familyDir}/registry.generated.json`

  writeJson(generatedPath, generated)

  return {
    family: meta.family,
    familyDir,
    metaPath,
    generatedPath,
    meta,
    generated,
  }
})

writeJson("artifacts/component-registry.json", buildRegistryArtifact(discoveredFamilies))

if (mode === "check") {
  try {
    for (const familyEntry of discoveredFamilies) {
      compareGeneratedFile(familyEntry.generatedPath)
    }

    compareGeneratedFile("artifacts/component-registry.json")
    console.log("✓ Component registry artifacts are up to date")
  } finally {
    rmSync(outputRoot, { recursive: true, force: true })
  }
} else {
  const familyLabel = discoveredFamilies.length === 1 ? "family" : "families"
  console.log(`✓ Generated component registry for ${discoveredFamilies.length} ${familyLabel}`)
}
