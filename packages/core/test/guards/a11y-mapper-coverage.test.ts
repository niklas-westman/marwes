/**
 * Guard: every family's resolved a11y object is connected to every adapter through a typed core
 * mapper, and adapters do not hand-map a11y fields to attributes any more.
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"
import * as core from "../../src/index"

const repoRoot = join(__dirname, "../../../..")
const atomsDir = join(repoRoot, "packages/core/src/components/atoms")

function listFiles(directory: string, matches: (path: string) => boolean): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) return listFiles(path, matches)
    return matches(path) ? [path] : []
  })
}

const isSource = (path: string): boolean =>
  !path.endsWith(".d.ts") && !/__tests__|\.test\./.test(path)

const coreSourceFiles = listFiles(atomsDir, (path) => path.endsWith(".ts") && isSource(path))

// Types named *A11y* that describe resolved a11y fields, discovered from core's type files.
const a11yTypeNames = coreSourceFiles
  .filter((path) => /(-types|\.types)\.ts$/.test(path))
  .flatMap((path) =>
    [...readFileSync(path, "utf8").matchAll(/export (?:interface|type) (\w*A11y\w*)\b/g)].map(
      (match) => match[1] as string,
    ),
  )
  .filter((name) => !name.endsWith("A11yIds"))

const mapperSource = coreSourceFiles
  .filter((path) => path.endsWith("-html-attributes.ts"))
  .map((path) => readFileSync(path, "utf8"))
  .join("\n")

const mapperNames = [...mapperSource.matchAll(/export const (to\w+HtmlAttributes) =/g)].map(
  (match) => match[1] as string,
)

type AdapterSources = { name: string; source: string; files: string[] }

function readAdapter(name: string, directory: string, extension: string): AdapterSources {
  const files = listFiles(
    join(repoRoot, directory),
    (path) => path.endsWith(extension) && isSource(path),
  )
  return { name, files, source: files.map((path) => readFileSync(path, "utf8")).join("\n") }
}

const adapters = [
  readAdapter("react", "packages/react/src/components", ".tsx"),
  readAdapter("vue", "packages/vue/src/components", ".ts"),
  readAdapter("svelte", "packages/svelte/src/lib/components", ".svelte"),
]

// Mappers for sub-parts only some adapters render, or rendered through a shared wrapper.
const mappersNotUsedByAdapter: Record<string, string[]> = {
  react: [],
  vue: [],
  svelte: [],
}

describe("a11y mapper coverage", () => {
  it("finds the core a11y types and mappers it is meant to guard", () => {
    expect(a11yTypeNames.length).toBeGreaterThan(30)
    expect(mapperNames.length).toBeGreaterThan(30)
  })

  it.each(a11yTypeNames)("%s has a typed HTML-attribute mapper", (typeName) => {
    expect(mapperSource).toContain(`defineHtmlAttributeMapper<${typeName}>`)
  })

  it.each(mapperNames)("%s is exported from the core entry point", (mapperName) => {
    expect(typeof (core as Record<string, unknown>)[mapperName]).toBe("function")
  })

  for (const adapter of adapters) {
    it(`every core mapper is used by the ${adapter.name} adapter`, () => {
      const unused = mapperNames.filter(
        (name) =>
          !adapter.source.includes(name) && !mappersNotUsedByAdapter[adapter.name]?.includes(name),
      )

      expect(unused).toEqual([])
    })

    it(`${adapter.name} adapter does not hand-map a11y fields to attributes`, () => {
      const manualMappings = adapter.files.flatMap((path) =>
        readFileSync(path, "utf8")
          .split("\n")
          .map((line, index) => ({ line: line.trim(), index: index + 1 }))
          .filter(({ line }) => /\ba11y\.\w+/.test(line))
          .filter(({ line }) => /(=\{|^"?[\w-]+"?: )/.test(line))
          .filter(({ line }) => !line.startsWith("//") && !line.startsWith("*"))
          .filter(({ line }) => !/Html\w*Attributes|import /.test(line))
          // Accordion ids are not attributes by name: they cross-reference trigger and panel.
          .filter(({ line }) => !/\.(triggerId|panelId)\b/.test(line))
          .map(({ line, index }) => `${relative(repoRoot, path)}:${index} ${line}`),
      )

      expect(manualMappings).toEqual([])
    })
  }
})
