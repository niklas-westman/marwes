import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { parse } from "svelte/compiler"
import ts from "typescript"
import { buildPublicApi } from "./generate-public-api.mjs"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function scriptSources(filename, source) {
  if (!filename.endsWith(".svelte")) return [source]
  // Parse only scripts, never component props/template expressions as TypeScript.
  const ast = parse(source)
  return [ast.instance, ast.module].filter(Boolean).map((script) => {
    const { start, end } = script.content
    return `${"\n".repeat(source.slice(0, start).split("\n").length - 1)}${source.slice(start, end)}`
  })
}

export function createFixtureImportChecker() {
  // Reuse the live source-based consumer API authority, not a second export inventory.
  const publicApi = new Map(buildPublicApi().packages.map((record) => [record.package, record]))
  const configPath = path.join(repoRoot, "tsconfig.base.json")
  const config = ts.readConfigFile(configPath, ts.sys.readFile)
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"))
  const options = ts.parseJsonConfigFileContent(config.config, ts.sys, repoRoot).options
  const privateExports = new Map()

  function exportsFor(filename) {
    if (privateExports.has(filename)) return privateExports.get(filename)
    let records
    if (filename.endsWith(".svelte")) {
      // Svelte's component is a default export. Named exports must be in its module script.
      const source = readFileSync(filename, "utf8")
      const moduleScript = parse(source).module
      const moduleSource = moduleScript
        ? source.slice(moduleScript.content.start, moduleScript.content.end)
        : ""
      const virtualFilename = `${filename}.ts`
      const host = ts.createCompilerHost(options)
      const getSourceFile = host.getSourceFile.bind(host)
      host.getSourceFile = (name, languageVersion, ...rest) =>
        name === virtualFilename
          ? ts.createSourceFile(name, moduleSource, languageVersion, true)
          : getSourceFile(name, languageVersion, ...rest)
      records = moduleExports(ts.createProgram([virtualFilename], options, host), virtualFilename)
      records.set("default", { runtime: true })
    } else {
      records = moduleExports(ts.createProgram([filename], options), filename)
    }
    privateExports.set(filename, records)
    return records
  }

  return function checkFixture({ filename, source, adapter }) {
    const errors = []
    const report = (node, sourceFile, message) => {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
      errors.push(`${path.relative(repoRoot, filename)}:${line}: ${message}`)
    }
    for (const script of scriptSources(filename, source)) {
      const sourceFile = ts.createSourceFile(
        filename,
        script,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      )
      for (const diagnostic of sourceFile.parseDiagnostics) {
        errors.push(
          `${path.relative(repoRoot, filename)}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`,
        )
      }
      for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
          continue
        const specifier = statement.moduleSpecifier.text
        const packageRecord = publicApi.get(specifier)
        const importedAdapter = specifier.match(/^@marwes-ui\/(react|vue|svelte)(?:\/|$)/)?.[1]
        if (importedAdapter && importedAdapter !== adapter) {
          report(
            statement,
            sourceFile,
            `${adapter} fixture imports the ${importedAdapter} adapter (${specifier})`,
          )
        }
        let exports
        if (packageRecord) {
          exports = new Map(
            packageRecord.exports.map((record) => [
              record.name,
              { runtime: record.kind !== "type" },
            ]),
          )
        } else if (specifier.startsWith(".") || specifier.startsWith("@marwes-ui/")) {
          const resolved = ts.resolveModuleName(specifier, filename, options, ts.sys).resolvedModule
            ?.resolvedFileName
          const sveltePath = path.resolve(path.dirname(filename), specifier)
          const target =
            resolved ??
            (specifier.endsWith(".svelte") && existsSync(sveltePath) ? sveltePath : undefined)
          if (!target) {
            report(statement, sourceFile, `Cannot resolve fixture import ${specifier}`)
            continue
          }
          const privateAdapter = target
            .replaceAll("\\", "/")
            .match(/\/packages\/(react|vue|svelte)\//)?.[1]
          if (privateAdapter && privateAdapter !== adapter) {
            report(
              statement,
              sourceFile,
              `${adapter} fixture imports private ${privateAdapter} implementation (${specifier})`,
            )
          }
          exports = exportsFor(target)
        } else {
          continue
        }
        const clause = statement.importClause
        if (!clause) continue
        const imports = []
        if (clause.name)
          imports.push({ name: "default", node: clause.name, typeOnly: clause.isTypeOnly })
        if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
          for (const element of clause.namedBindings.elements) {
            imports.push({
              name: (element.propertyName ?? element.name).text,
              node: element,
              typeOnly: clause.isTypeOnly || element.isTypeOnly,
            })
          }
        }
        for (const imported of imports) {
          const exported = exports.get(imported.name)
          if (!exported || (!imported.typeOnly && !exported.runtime)) {
            report(
              imported.node,
              sourceFile,
              `${specifier} has no ${imported.typeOnly ? "" : "runtime "}export ${imported.name}`,
            )
          }
        }
      }
    }
    return errors
  }
}

function moduleExports(program, filename) {
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(filename)
  const symbol = sourceFile && checker.getSymbolAtLocation(sourceFile)
  if (!symbol) return new Map()
  return new Map(
    checker.getExportsOfModule(symbol).map((exported) => {
      const typeOnly = exported.declarations?.some(
        (declaration) =>
          ts.isExportSpecifier(declaration) &&
          (declaration.isTypeOnly || declaration.parent.parent.isTypeOnly),
      )
      const target =
        exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
      return [exported.name, { runtime: !typeOnly && Boolean(target.flags & ts.SymbolFlags.Value) }]
    }),
  )
}

function main() {
  const checkFixture = createFixtureImportChecker()
  const fixtureRoot = path.join(repoRoot, "tests/reflection")
  const files = readdirSync(fixtureRoot).filter((file) => /\.(?:tsx?|svelte)$/.test(file))
  const errors = files.flatMap((file) => {
    const adapter = file.match(/^(react|vue|svelte)-/)?.[1]
    if (!adapter) throw new Error(`Unknown Reflection fixture adapter: ${file}`)
    const filename = path.join(fixtureRoot, file)
    return checkFixture({ filename, source: readFileSync(filename, "utf8"), adapter })
  })
  if (errors.length)
    throw new Error(`Reflection fixture import validation failed:\n${errors.join("\n")}`)
  console.log(`✓ Reflection fixture imports checked (${files.length} files)`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
