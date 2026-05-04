import { spawn } from "node:child_process"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import process from "node:process"

const repoRoot = process.cwd()

const cliArgs = process.argv.slice(2)
const family = cliArgs.find((arg) => !arg.startsWith("-"))
const runStorybookStories = process.argv.includes("--storybook")

function usage() {
  console.error("Usage: pnpm validate:family <family> [--storybook]")
}

function pathExists(path) {
  return existsSync(join(repoRoot, path))
}

function listFiles(directory, predicate = () => true) {
  const absoluteDirectory = join(repoRoot, directory)

  if (!existsSync(absoluteDirectory)) {
    return []
  }

  return readdirSync(absoluteDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(directory, entry.name))
    .filter(predicate)
    .sort((left, right) => left.localeCompare(right))
}

function listStoryFiles(directory, extension) {
  return listFiles(directory, (path) => path.endsWith(`.stories.${extension}`))
}

function uniqueExisting(paths) {
  return [...new Set(paths)].filter(pathExists)
}

function run(command, args) {
  return new Promise((resolve) => {
    console.log("")
    console.log(`$ ${[command, ...args].join(" ")}`)

    const child = spawn(command, args, {
      cwd: repoRoot,
      env: {
        ...process.env,
        NODE_ENV: "test",
      },
      stdio: "inherit",
    })

    child.on("close", (code) => {
      resolve(code ?? 1)
    })
  })
}

function collectCoreRecipeTests() {
  const defaultRecipeTest = `test/recipes/${family}.test.ts`
  const familySpecificTests = {
    input: [
      "test/recipes/input.test.ts",
      "test/recipes/select.test.ts",
      "test/recipes/textarea.test.ts",
      "test/recipes/rich-text-html.test.ts",
      "test/storybook/input-taxonomy.test.ts",
      "test/data/currency-symbols.test.ts",
    ],
  }

  return (familySpecificTests[family] ?? [defaultRecipeTest]).filter((path) =>
    pathExists(`packages/core/${path}`),
  )
}

function collectPresetTests() {
  const defaultPresetTests = [
    `test/${family}-css-contract.test.ts`,
    "test/theme-token-coverage.test.ts",
    "test/first-edition-css.test.ts",
    "test/exports.test.ts",
  ]
  const familySpecificTests = {
    input: [
      "test/select-css-contract.test.ts",
      "test/theme-token-coverage.test.ts",
      "test/first-edition-css.test.ts",
      "test/exports.test.ts",
    ],
  }

  return (familySpecificTests[family] ?? defaultPresetTests).filter((path) =>
    pathExists(`packages/presets/${path}`),
  )
}

function collectFamilyBiomePaths() {
  return uniqueExisting([
    `packages/core/src/components/atoms/${family}`,
    `packages/core/test/recipes/${family}.test.ts`,
    `packages/presets/src/firstEdition/${family}.css`,
    `packages/presets/test/${family}-css-contract.test.ts`,
    `packages/react/src/components/${family}`,
    `packages/vue/src/components/${family}`,
    `apps/storybook-react/src/stories/${family}`,
    `apps/storybook-vue/src/stories/${family}`,
    `tests/contracts/${family}.contract.ts`,
    `docs/audits/${family}-family-accessibility.md`,
    `docs/registry/families/${family}`,
  ])
}

function collectStoryDocsTests(storyRoot) {
  return listFiles(`${storyRoot}/${family}/__tests__`, (path) => path.endsWith(".test.ts"))
}

function toPackageRelativePath(packageRoot, path) {
  return path.replace(`${packageRoot}/`, "")
}

async function runStep(name, command, args, options = {}) {
  if (options.skip) {
    console.log("")
    console.log(`- Skipping ${name}: no matching files`)
    return 0
  }

  const code = await run(command, args)
  if (code !== 0) {
    console.error(`\n${name} failed with exit code ${code}`)
  }
  return code
}

if (!family) {
  usage()
  process.exit(1)
}

const hasFamily =
  pathExists(`packages/react/src/components/${family}`) ||
  pathExists(`packages/vue/src/components/${family}`) ||
  pathExists(`docs/registry/families/${family}`)

if (!hasFamily) {
  console.error(`Unknown family: ${family}`)
  usage()
  process.exit(1)
}

const steps = [
  {
    name: "Biome family paths",
    command: "pnpm",
    args: ["exec", "biome", "check", ...collectFamilyBiomePaths()],
  },
  {
    name: "Core family recipe tests",
    command: "pnpm",
    args: ["--filter", "@marwes-ui/core", "test", "--", ...collectCoreRecipeTests()],
    skip: collectCoreRecipeTests().length === 0,
  },
  {
    name: "Preset family CSS/export tests",
    command: "pnpm",
    args: ["--filter", "@marwes-ui/presets", "test", "--", ...collectPresetTests()],
  },
  {
    name: "React family tests",
    command: "pnpm",
    args: [
      "--filter",
      "@marwes-ui/react",
      "test",
      "--",
      "src/provider/__tests__/adapter-theme-integrity.test.ts",
      `src/components/${family}/__tests__`,
    ],
    skip: !pathExists(`packages/react/src/components/${family}/__tests__`),
  },
  {
    name: "Vue family tests",
    command: "pnpm",
    args: [
      "--filter",
      "@marwes-ui/vue",
      "test",
      "--",
      "src/provider/__tests__/adapter-theme-integrity.test.ts",
      `src/components/${family}/__tests__`,
    ],
    skip: !pathExists(`packages/vue/src/components/${family}/__tests__`),
  },
  {
    name: "React Storybook docs tests",
    command: "pnpm",
    args: [
      "--filter",
      "./apps/storybook-react",
      "test",
      "--",
      ...collectStoryDocsTests("apps/storybook-react/src/stories").map((path) =>
        toPackageRelativePath("apps/storybook-react", path),
      ),
    ],
    skip: collectStoryDocsTests("apps/storybook-react/src/stories").length === 0,
  },
  {
    name: "Vue Storybook docs tests",
    command: "pnpm",
    args: [
      "--filter",
      "./apps/storybook-vue",
      "test",
      "--",
      ...collectStoryDocsTests("apps/storybook-vue/src/stories").map((path) =>
        toPackageRelativePath("apps/storybook-vue", path),
      ),
    ],
    skip: collectStoryDocsTests("apps/storybook-vue/src/stories").length === 0,
  },
  {
    name: "Storybook consistency",
    command: "node",
    args: ["./scripts/storybook-consistency.mjs", "--family", family],
  },
  {
    name: "Registry generated artifact check",
    command: "pnpm",
    args: ["registry:check"],
  },
  {
    name: "Compass docs/routing checks",
    command: "pnpm",
    args: ["check:compass"],
  },
]

if (runStorybookStories) {
  const reactStories = listStoryFiles(`apps/storybook-react/src/stories/${family}`, "tsx")
  const vueStories = listStoryFiles(`apps/storybook-vue/src/stories/${family}`, "ts")

  steps.push(
    {
      name: "React Storybook story/a11y tests",
      command: "pnpm",
      args: [
        "--filter",
        "./apps/storybook-react",
        "exec",
        "vitest",
        "run",
        "--config",
        "vite.config.ts",
        "--project",
        "storybook",
        ...reactStories.map((path) => toPackageRelativePath("apps/storybook-react", path)),
      ],
      skip: reactStories.length === 0,
    },
    {
      name: "Vue Storybook story/a11y tests",
      command: "pnpm",
      args: [
        "--filter",
        "./apps/storybook-vue",
        "exec",
        "vitest",
        "run",
        "--config",
        "vite.config.ts",
        "--project",
        "storybook",
        ...vueStories.map((path) => toPackageRelativePath("apps/storybook-vue", path)),
      ],
      skip: vueStories.length === 0,
    },
  )
}

console.log(`Validating family: ${family}`)
console.log(`Storybook story/a11y tests: ${runStorybookStories ? "on" : "off"}`)

for (const step of steps) {
  const code = await runStep(step.name, step.command, step.args, {
    skip: step.skip,
  })

  if (code !== 0) {
    process.exit(code)
  }
}

console.log("")
console.log(`✓ Family validation passed: ${family}`)
