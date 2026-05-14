#!/usr/bin/env node
/**
 * Generate Introduction.mdx files from shared doc contracts.
 *
 * Usage:
 *   tsx scripts/generate-storybook-docs.ts           # generate all
 *   tsx scripts/generate-storybook-docs.ts --check   # check for drift (CI)
 */

import * as fs from "node:fs"
import * as path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const DOCS_DIR = path.join(ROOT, "packages/core/src/storybook/docs")
const EXAMPLES_DIR = path.join(DOCS_DIR, "examples")

const STORYBOOKS: Record<string, { dir: string; framework: string }> = {
  react: {
    dir: path.join(ROOT, "apps/storybook-react/src/stories"),
    framework: "react",
  },
  svelte: {
    dir: path.join(ROOT, "apps/storybook-svelte/src/stories"),
    framework: "svelte",
  },
  vue: {
    dir: path.join(ROOT, "apps/storybook-vue/src/stories"),
    framework: "vue",
  },
}

interface DynamicList {
  tag: "ol" | "ul"
  source: string
}

interface Subsection {
  heading: string
  body?: string
  dynamicList?: DynamicList
  bullets?: string[]
}

interface Section {
  heading: string
  body?: string
  exampleKey?: string
  note?: string
  subsections?: Subsection[]
}

interface ComponentRef {
  name: string
  description: string
  meta?: string
}

interface ComponentRefGroup {
  group: string
  components: ComponentRef[]
}

interface AccessibilityNote {
  exampleKey?: string
}

interface DocContract {
  family: string
  title: string
  storybookTitle: string
  imports?: string[]
  intro: string
  sections: Section[]
  accessibilityNotes?: Array<string | AccessibilityNote>
  componentReference?: ComponentRefGroup[]
  storyCoverage?: string[]
}

type ExampleMap = Record<string, string>

async function loadExamples(family: string, framework: string): Promise<ExampleMap> {
  const filePath = path.join(EXAMPLES_DIR, `${family}.${framework}.ts`)
  if (!fs.existsSync(filePath)) {
    return {}
  }
  const mod = await import(filePath)
  const exportName = `${family}Examples`
  return mod[exportName] ?? mod.default ?? {}
}

function renderDynamicList(list: DynamicList): string {
  const tag = list.tag
  return `<${tag}>
  {${list.source}.map((item) => (
    <li key={item.label}>
      <strong>${tag === "ul" ? "<code>" : ""}{item.label}${tag === "ul" ? "</code>" : ""}</strong> - {item.text}
    </li>
  ))}
</${tag}>`
}

function renderImports(contract: DocContract): string {
  const coreImports = contract.imports ?? []

  const lines: string[] = []
  lines.push(`import { Meta } from "@storybook/addon-docs/blocks"`)

  if (coreImports.length > 0) {
    lines.push("import {")
    for (const imp of coreImports) {
      lines.push(`  ${imp},`)
    }
    lines.push(`} from "@marwes-ui/core"`)
  }

  return lines.join("\n")
}

function generateMdx(contract: DocContract, examples: ExampleMap): string {
  const lines: string[] = []

  // Imports
  lines.push(renderImports(contract))
  lines.push("")
  lines.push(`<Meta title="${contract.storybookTitle}" />`)
  lines.push("")

  // Title + intro
  lines.push(`# ${contract.title}`)
  lines.push("")
  lines.push(contract.intro)
  lines.push("")

  // Sections
  for (const section of contract.sections) {
    lines.push(`## ${section.heading}`)
    lines.push("")

    if (section.body) {
      lines.push(section.body)
      lines.push("")
    }

    if (section.exampleKey && examples[section.exampleKey]) {
      lines.push(examples[section.exampleKey])
      lines.push("")
    }

    if (section.subsections) {
      for (const sub of section.subsections) {
        lines.push(`### ${sub.heading}`)
        lines.push("")

        if (sub.body) {
          lines.push(sub.body)
          lines.push("")
        }

        if (sub.dynamicList) {
          lines.push(renderDynamicList(sub.dynamicList))
          lines.push("")
        }

        if (sub.bullets) {
          for (const bullet of sub.bullets) {
            lines.push(`- ${bullet}`)
          }
          lines.push("")
        }
      }
    }

    if (section.note) {
      lines.push(`> ${section.note.split("\n").join("\n> ")}`)
      lines.push("")
    }
  }

  // Accessibility notes
  if (contract.accessibilityNotes && contract.accessibilityNotes.length > 0) {
    lines.push("---")
    lines.push("")
    lines.push("## Accessibility notes")
    lines.push("")

    for (const note of contract.accessibilityNotes) {
      if (typeof note === "string") {
        lines.push(note)
        lines.push("")
      } else if (note.exampleKey && examples[note.exampleKey]) {
        lines.push(examples[note.exampleKey])
        lines.push("")
      }
    }
  }

  // Component reference
  if (contract.componentReference) {
    lines.push("## Component Reference")
    lines.push("")

    for (const group of contract.componentReference) {
      lines.push(`### ${group.group}`)
      lines.push("")
      for (const comp of group.components) {
        lines.push(`**\`${comp.name}\`** — ${comp.description}`)
        if (comp.meta) {
          lines.push(`${comp.meta}`)
        }
        lines.push("")
      }
    }
  }

  // Story coverage
  if (contract.storyCoverage) {
    lines.push("## Story Coverage")
    lines.push("")
    for (const line of contract.storyCoverage) {
      lines.push(`- ${line}`)
    }
    lines.push("")
  }

  return lines.join("\n")
}

async function main(): Promise<void> {
  const isCheck = process.argv.includes("--check")

  const contractFiles = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".doc.json"))
    .sort()

  if (contractFiles.length === 0) {
    console.log("No doc contracts found.")
    return
  }

  let staleCount = 0
  let generatedCount = 0

  for (const contractFile of contractFiles) {
    const contract: DocContract = JSON.parse(
      fs.readFileSync(path.join(DOCS_DIR, contractFile), "utf-8"),
    )

    for (const [_sbKey, sb] of Object.entries(STORYBOOKS)) {
      const examples = await loadExamples(contract.family, sb.framework)
      const mdxContent = generateMdx(contract, examples)
      const outPath = path.join(sb.dir, contract.family, "Introduction.mdx")

      if (isCheck) {
        if (!fs.existsSync(outPath)) {
          console.error(`  MISSING: ${path.relative(ROOT, outPath)}`)
          staleCount++
          continue
        }

        const existing = fs.readFileSync(outPath, "utf-8")
        if (existing !== mdxContent) {
          console.error(`  STALE:   ${path.relative(ROOT, outPath)}`)
          staleCount++
        }
      } else {
        fs.mkdirSync(path.dirname(outPath), { recursive: true })
        fs.writeFileSync(outPath, mdxContent, "utf-8")
        generatedCount++
      }
    }
  }

  if (isCheck) {
    if (staleCount > 0) {
      console.error(`\n${staleCount} docs are stale. Run: pnpm docs:generate`)
      process.exit(1)
    }
    console.log(`✓ All generated docs are up to date (${contractFiles.length} contracts)`)
  } else {
    console.log(
      `✓ Generated ${generatedCount} Introduction.mdx files from ${contractFiles.length} contracts`,
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
