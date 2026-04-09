import { readFile, readdir, stat } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import process from "node:process"

const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g
const skippedDirectories = new Set([
  "node_modules",
  ".git",
  "dist",
  "storybook-static",
  ".turbo",
  ".next",
])

async function collectMarkdownFiles(directoryPath) {
  const directoryEntries = await readdir(directoryPath, {
    withFileTypes: true,
  })

  const markdownFiles = []

  for (const directoryEntry of directoryEntries) {
    if (skippedDirectories.has(directoryEntry.name)) {
      continue
    }

    const entryPath = resolve(directoryPath, directoryEntry.name)

    if (directoryEntry.isDirectory()) {
      markdownFiles.push(...(await collectMarkdownFiles(entryPath)))
      continue
    }

    if (directoryEntry.isFile() && entryPath.endsWith(".md")) {
      markdownFiles.push(entryPath)
    }
  }

  return markdownFiles
}

function shouldIgnoreLink(linkTarget) {
  return (
    linkTarget.startsWith("#") || linkTarget.startsWith("mailto:") || linkTarget.includes("://")
  )
}

async function pathExists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  const repositoryRoot = process.cwd()
  const markdownFiles = await collectMarkdownFiles(repositoryRoot)
  const brokenLinks = []

  for (const markdownFilePath of markdownFiles) {
    const markdownContent = await readFile(markdownFilePath, "utf8")
    const matches = markdownContent.matchAll(markdownLinkPattern)

    for (const match of matches) {
      const rawLinkTarget = match[1]

      if (shouldIgnoreLink(rawLinkTarget)) {
        continue
      }

      const cleanLinkTarget = rawLinkTarget.split("#")[0]

      if (!cleanLinkTarget) {
        continue
      }

      const resolvedTargetPath = resolve(dirname(markdownFilePath), cleanLinkTarget)
      const targetExists = await pathExists(resolvedTargetPath)

      if (!targetExists) {
        brokenLinks.push({
          markdownFilePath,
          rawLinkTarget,
        })
      }
    }
  }

  if (brokenLinks.length === 0) {
    console.log(`✓ Markdown link check passed (${markdownFiles.length} files)`)
    return
  }

  console.error(`✗ Found ${brokenLinks.length} broken markdown link(s):`)

  for (const brokenLink of brokenLinks) {
    const relativeMarkdownFilePath = brokenLink.markdownFilePath.replace(`${repositoryRoot}/`, "")
    console.error(`- ${relativeMarkdownFilePath}: ${brokenLink.rawLinkTarget}`)
  }

  process.exitCode = 1
}

await main()
