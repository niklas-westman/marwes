import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import ts from "typescript"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputPath = path.join(repoRoot, "artifacts/public-api.json")
const tsconfigPath = path.join(repoRoot, "tsconfig.base.json")

const adapters = [
  {
    framework: "react",
    package: "@marwes-ui/react",
    importPath: "@marwes-ui/react",
    entrypoint: "packages/react/src/index.ts",
  },
  {
    framework: "vue",
    package: "@marwes-ui/vue",
    importPath: "@marwes-ui/vue",
    entrypoint: "packages/vue/src/index.ts",
  },
  {
    framework: "svelte",
    package: "@marwes-ui/svelte",
    importPath: "@marwes-ui/svelte",
    entrypoint: "packages/svelte/src/lib/index.ts",
  },
]

function readCompilerOptions() {
  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
  if (config.error) {
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"))
  }

  return ts.parseJsonConfigFileContent(config.config, ts.sys, repoRoot).options
}

function sourceExportMetadata(sourceFile) {
  const metadata = new Map()

  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement) && statement.exportClause) {
      if (!ts.isNamedExports(statement.exportClause)) continue

      const source = ts.isStringLiteral(statement.moduleSpecifier)
        ? statement.moduleSpecifier.text
        : undefined
      for (const element of statement.exportClause.elements) {
        metadata.set(element.name.text, {
          source,
          typeOnly: statement.isTypeOnly || element.isTypeOnly,
        })
      }
      continue
    }

    const exported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    )
    if (!exported || !("name" in statement) || !statement.name) continue

    metadata.set(statement.name.text, {
      source: undefined,
      typeOnly: ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement),
    })
  }

  return metadata
}

function familyFromPath(value, registryFamilies) {
  if (!value) return undefined

  const normalized = value.replaceAll("\\", "/")
  const match = normalized.match(/\/components\/(?:atoms\/|molecules\/)?([^/]+)/)
  const family = match?.[1]?.replace(/\.(?:[cm]?[jt]sx?|svelte)$/, "")
  return family && registryFamilies.has(family) ? family : undefined
}

function resolveAlias(checker, symbol) {
  if (!(symbol.flags & ts.SymbolFlags.Alias)) return symbol

  const target = checker.getAliasedSymbol(symbol)
  return target.flags === ts.SymbolFlags.Unknown ? symbol : target
}

function classifyExport(name, metadata, target) {
  const isValue = Boolean(target.flags & ts.SymbolFlags.Value)
  if (metadata?.typeOnly || !isValue) return "type"
  if (target.flags & ts.SymbolFlags.Enum) return "enum"

  const fromCore = metadata?.source === "@marwes-ui/core"
  if (fromCore && /^[A-Z]/.test(name)) return "enum"

  if (/^[A-Z]/.test(name)) return "component"

  return "helper"
}

function buildPackageRecord(adapter, program, checker, registryFamilies) {
  const absoluteEntrypoint = path.join(repoRoot, adapter.entrypoint)
  const sourceFile = program.getSourceFile(absoluteEntrypoint)
  if (!sourceFile) throw new Error(`TypeScript program did not load ${adapter.entrypoint}`)

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) throw new Error(`TypeScript could not resolve ${adapter.entrypoint}`)

  const metadataByName = sourceExportMetadata(sourceFile)
  const exports = checker.getExportsOfModule(moduleSymbol).map((symbol) => {
    const metadata = metadataByName.get(symbol.name)
    const target = resolveAlias(checker, symbol)
    const declarationPaths = (target.declarations ?? []).map(
      (declaration) => declaration.getSourceFile().fileName,
    )
    const family =
      familyFromPath(metadata?.source, registryFamilies) ??
      declarationPaths
        .map((declarationPath) => familyFromPath(declarationPath, registryFamilies))
        .find(Boolean)

    return {
      name: symbol.name,
      kind: classifyExport(symbol.name, metadata, target),
      importPath: adapter.importPath,
      ...(family ? { family } : {}),
    }
  })

  exports.sort((left, right) => left.name.localeCompare(right.name, "en"))

  return {
    package: adapter.package,
    framework: adapter.framework,
    importPath: adapter.importPath,
    entrypoint: adapter.entrypoint,
    exports,
  }
}

export function buildPublicApi() {
  const registry = JSON.parse(
    readFileSync(path.join(repoRoot, "artifacts/component-registry.json"), "utf8"),
  )
  const registryFamilies = new Set(registry.families.map((entry) => entry.family))
  const compilerOptions = { ...readCompilerOptions(), noEmit: true }
  const program = ts.createProgram(
    adapters.map((adapter) => path.join(repoRoot, adapter.entrypoint)),
    compilerOptions,
  )
  const checker = program.getTypeChecker()

  return {
    schemaVersion: 1,
    packages: adapters.map((adapter) =>
      buildPackageRecord(adapter, program, checker, registryFamilies),
    ),
  }
}

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function main() {
  const generated = serialize(buildPublicApi())

  if (process.argv.includes("--check")) {
    const committed = readFileSync(outputPath, "utf8")
    if (committed !== generated) {
      throw new Error("Public API artifact is stale. Run pnpm consumer-api:generate.")
    }
    console.log("✓ Public API artifact is up to date")
    return
  }

  mkdirSync(path.dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, generated, "utf8")
  const exportCount = JSON.parse(generated).packages.reduce(
    (count, packageRecord) => count + packageRecord.exports.length,
    0,
  )
  console.log(`✓ Generated public API artifact with ${exportCount} adapter exports`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
