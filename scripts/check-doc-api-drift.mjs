import { readFile, stat } from "node:fs/promises"
import { resolve } from "node:path"
import process from "node:process"

const repositoryRoot = process.cwd()

const sharedForbiddenPatterns = [
  {
    pattern: /import\s*\{\s*firstEdition\s*\}\s*from\s*"@marwes-ui\/presets"/,
    description: "stale import `firstEdition` from `@marwes-ui/presets`",
  },
  {
    pattern: /<MarwesProvider[^>]*\spreset=/,
    description: "stale provider prop `preset={...}`",
  },
  {
    pattern: /\bpreset=\{firstEdition\}/,
    description: "stale example `preset={firstEdition}`",
  },
]

const documentationFiles = [
  {
    path: "README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
        description: "import `@marwes-ui/presets/firstEdition/styles.css`",
      },
      {
        pattern: /<MarwesProvider\s+theme=\{firstEditionTheme\}>/,
        description: "show `<MarwesProvider theme={firstEditionTheme}>`",
      },
    ],
  },
  {
    path: "packages/presets/README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
        description: "import `@marwes-ui/presets/firstEdition/styles.css`",
      },
      {
        pattern: /<MarwesProvider\s+theme=\{firstEditionTheme\}>/,
        description: "show `<MarwesProvider theme={firstEditionTheme}>`",
      },
    ],
  },
  {
    path: "packages/react/README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
        description: "import `@marwes-ui/presets/firstEdition/styles.css`",
      },
      {
        pattern: /<MarwesProvider\s+theme=\{firstEditionTheme\}>/,
        description: "show `<MarwesProvider theme={firstEditionTheme}>`",
      },
    ],
  },
  {
    path: "apps/playground-react/README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
        description: "import `@marwes-ui/presets/firstEdition/styles.css`",
      },
      {
        pattern: /<MarwesProvider\s+theme=\{firstEditionTheme\}>/,
        description: "show `<MarwesProvider theme={firstEditionTheme}>`",
      },
    ],
  },
  {
    path: "apps/storybook-react/README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
        description: "import `@marwes-ui/presets/firstEdition/styles.css`",
      },
      {
        pattern: /<MarwesProvider\s+theme=\{firstEditionTheme\}>/,
        description: "show `<MarwesProvider theme={firstEditionTheme}>`",
      },
    ],
  },
  {
    path: "packages/vue/README.md",
    requiredPatterns: [
      {
        pattern: /import\s*\{\s*firstEditionTheme\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "import `firstEditionTheme` from `@marwes-ui/presets`",
      },
      {
        pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
        description: "import `@marwes-ui/presets/firstEdition/styles.css`",
      },
      {
        pattern: /<MarwesProvider\s+:theme="firstEditionTheme">/,
        description: "show `<MarwesProvider :theme=\"firstEditionTheme\">`",
      },
    ],
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

    for (const forbiddenPattern of sharedForbiddenPatterns) {
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
