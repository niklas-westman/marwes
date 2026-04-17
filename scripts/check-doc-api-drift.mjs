import { readFile, stat } from "node:fs/promises"
import { resolve } from "node:path"
import process from "node:process"

const repositoryRoot = process.cwd()

const documentationFiles = [
  {
    path: "README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "root README should import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /<MarwesProvider\s+theme=\{firstEditionTheme\}>/,
        description: "root README should show `<MarwesProvider theme={firstEditionTheme}>`",
      },
    ],
  },
  {
    path: "packages/presets/README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "presets README should import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /<MarwesProvider\s+theme=\{firstEditionTheme\}>/,
        description: "presets README should show `<MarwesProvider theme={firstEditionTheme}>`",
      },
    ],
  },
  {
    path: "packages/react/README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "react README should import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /<MarwesProvider\s+theme=\{firstEditionTheme\}>/,
        description: "react README should show `<MarwesProvider theme={firstEditionTheme}>`",
      },
    ],
  },
]

const forbiddenPatterns = [
  {
    pattern: /import\s*\{\s*firstEdition\s*\}\s*from\s*"@marwes-ui\/presets"/,
    description: "stale import `firstEdition` from `@marwes-ui/presets`",
  },
  {
    pattern: /<MarwesProvider\s+preset=\{/,
    description: "stale provider prop `preset={...}`",
  },
  {
    pattern: /\bpreset=\{firstEdition\}/,
    description: "stale example `preset={firstEdition}`",
  },
]

async function pathExists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  const failures = []
  let checkedFiles = 0

  for (const documentationFile of documentationFiles) {
    const absolutePath = resolve(repositoryRoot, documentationFile.path)
    const exists = await pathExists(absolutePath)

    if (!exists) {
      continue
    }

    checkedFiles += 1
    const fileContent = await readFile(absolutePath, "utf8")

    for (const requiredPattern of documentationFile.requiredPatterns) {
      if (!requiredPattern.pattern.test(fileContent)) {
        failures.push(`- ${documentationFile.path}: missing ${requiredPattern.description}`)
      }
    }

    for (const forbiddenPattern of forbiddenPatterns) {
      if (forbiddenPattern.pattern.test(fileContent)) {
        failures.push(`- ${documentationFile.path}: found ${forbiddenPattern.description}`)
      }
    }
  }

  if (failures.length === 0) {
    console.log(`✓ Docs/API drift check passed (${checkedFiles} files)`)
    return
  }

  console.error(`✗ Docs/API drift check failed (${checkedFiles} files checked):`)
  for (const failure of failures) {
    console.error(failure)
  }
  process.exitCode = 1
}

await main()
