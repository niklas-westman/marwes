import { access, readFile, readdir } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const repositoryRoot = resolve(import.meta.dirname, "../../../..")
const reactInputStoriesDirectory = resolve(repositoryRoot, "apps/storybook-react/src/stories/input")
const vueInputStoriesDirectory = resolve(repositoryRoot, "apps/storybook-vue/src/stories/input")
const vueLegacyFieldStoriesDirectory = resolve(
  repositoryRoot,
  "apps/storybook-vue/src/stories/field",
)

const expectedInputTitles = new Set([
  "Input/Introduction",
  "Input/Molecule/InputField",
  "Input/Purpose/SearchField",
  "Input/Purpose/PasswordField",
  "Input/Purpose/EmailField",
  "Input/Purpose/PhoneField",
  "Input/Purpose/URLField",
  "Input/Purpose/CurrencyField",
])

function extractStoryTitles(fileContent: string): string[] {
  const titles: string[] = []
  const objectTitlePattern = /title:\s*["']([^"']+)["']/g
  const metaTitlePattern = /<Meta\s+title=["']([^"']+)["']/g

  for (const match of fileContent.matchAll(objectTitlePattern)) {
    if (match[1]) {
      titles.push(match[1])
    }
  }

  for (const match of fileContent.matchAll(metaTitlePattern)) {
    if (match[1]) {
      titles.push(match[1])
    }
  }

  return titles
}

async function readStoryTitles(directoryPath: string): Promise<Map<string, string[]>> {
  const storyFiles = await readdir(directoryPath)
  const titlesByFile = new Map<string, string[]>()

  for (const fileName of storyFiles) {
    if (!/\.(ts|tsx|mdx)$/.test(fileName)) {
      continue
    }

    const filePath = resolve(directoryPath, fileName)
    const content = await readFile(filePath, "utf8")
    const titles = extractStoryTitles(content)

    if (titles.length > 0) {
      titlesByFile.set(fileName, titles)
    }
  }

  return titlesByFile
}

describe("storybook input taxonomy", () => {
  it("uses Input/* titles for all React and Vue input stories", async () => {
    const reactTitlesByFile = await readStoryTitles(reactInputStoriesDirectory)
    const vueTitlesByFile = await readStoryTitles(vueInputStoriesDirectory)

    const allTitles = [...reactTitlesByFile.values(), ...vueTitlesByFile.values()].flat()
    expect(allTitles.length).toBeGreaterThan(0)

    for (const title of allTitles) {
      expect(title.startsWith("Input/")).toBe(true)
      expect(title.startsWith("Fields/")).toBe(false)
    }

    for (const expectedTitle of expectedInputTitles) {
      expect(allTitles).toContain(expectedTitle)
    }
  })

  it("stores Vue input stories under stories/input and removes stories/field", async () => {
    await expect(access(vueInputStoriesDirectory)).resolves.toBeUndefined()
    await expect(access(vueLegacyFieldStoriesDirectory)).rejects.toThrow()
  })

  it("documents input domain and field naming in both intro pages", async () => {
    const reactIntroduction = await readFile(
      resolve(reactInputStoriesDirectory, "Introduction.mdx"),
      "utf8",
    )
    const vueIntroduction = await readFile(
      resolve(vueInputStoriesDirectory, "Introduction.mdx"),
      "utf8",
    )

    for (const introduction of [reactIntroduction, vueIntroduction]) {
      expect(introduction).toContain("Input domain")
      expect(introduction).toContain("Field naming")
    }
  })
})
