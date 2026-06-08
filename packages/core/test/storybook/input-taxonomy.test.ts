/**
 * Tests the Storybook input taxonomy — ensures all React, Vue, and Svelte input stories
 * use the Input/* title hierarchy, verifies the legacy stories/field directory
 * was removed, and checks that introduction docs cover domain and naming.
 */
import { access, readFile, readdir } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const repositoryRoot = resolve(import.meta.dirname, "../../../..")
const reactInputStoriesDirectory = resolve(repositoryRoot, "apps/storybook-react/src/stories/input")
const vueInputStoriesDirectory = resolve(repositoryRoot, "apps/storybook-vue/src/stories/input")
const svelteInputStoriesDirectory = resolve(
  repositoryRoot,
  "apps/storybook-svelte/src/stories/input",
)
const vueLegacyFieldStoriesDirectory = resolve(
  repositoryRoot,
  "apps/storybook-vue/src/stories/field",
)

const expectedInputTitles = new Set([
  "Input/Introduction",
  "Input/Atom/Input",
  "Input/Atom/Select",
  "Input/Atom/Textarea",
  "Input/Molecule/InputField",
  "Input/Molecule/SelectField",
  "Input/Molecule/TextareaField",
  "Input/Purpose/DropdownField",
  "Input/Purpose/SearchField",
  "Input/Purpose/PasswordField",
  "Input/Purpose/EmailField",
  "Input/Purpose/DateOfBirthField",
  "Input/Purpose/ZipCodeField",
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
  it("uses Input/* titles for all React, Vue, and Svelte input stories", async () => {
    const reactTitlesByFile = await readStoryTitles(reactInputStoriesDirectory)
    const vueTitlesByFile = await readStoryTitles(vueInputStoriesDirectory)
    const svelteTitlesByFile = await readStoryTitles(svelteInputStoriesDirectory)

    const allTitles = [
      ...reactTitlesByFile.values(),
      ...vueTitlesByFile.values(),
      ...svelteTitlesByFile.values(),
    ].flat()
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

  it("documents input domain and field naming in all framework intro pages", async () => {
    const reactIntroduction = await readFile(
      resolve(reactInputStoriesDirectory, "Introduction.mdx"),
      "utf8",
    )
    const vueIntroduction = await readFile(
      resolve(vueInputStoriesDirectory, "Introduction.mdx"),
      "utf8",
    )
    const svelteIntroduction = await readFile(
      resolve(svelteInputStoriesDirectory, "Introduction.mdx"),
      "utf8",
    )

    for (const introduction of [reactIntroduction, vueIntroduction, svelteIntroduction]) {
      expect(introduction).toContain("Input domain")
      expect(introduction).toContain("Field naming")
    }
  })
})
