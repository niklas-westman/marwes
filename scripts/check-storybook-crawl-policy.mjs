import { readFile } from "node:fs/promises"
import { join } from "node:path"
import process from "node:process"

const frameworks = ["react", "vue", "svelte"]
const expectedFiles = {
  ".storybook/manager-head.html": '<meta name="robots" content="noindex,follow,noarchive" />\n',
  ".storybook/preview-head.html": '<meta name="robots" content="noindex,follow,noarchive" />\n',
  "public/robots.txt": "User-agent: *\nAllow: /\n",
}
const staticDirsConfig = 'staticDirs: [{ from: "../public", to: "/" }],'
const findings = []

async function readPolicyFile(path) {
  try {
    return await readFile(path, "utf8")
  } catch {
    findings.push(`${path}: missing crawl policy file`)
    return undefined
  }
}

for (const framework of frameworks) {
  const storybookRoot = join(`apps/storybook-${framework}`)
  const mainConfigPath = join(storybookRoot, ".storybook/main.ts")
  const mainConfig = await readPolicyFile(mainConfigPath)

  if (mainConfig && !mainConfig.includes(staticDirsConfig)) {
    findings.push(`${mainConfigPath}: public directory must be copied to the Storybook root`)
  }

  for (const [relativePath, expectedContent] of Object.entries(expectedFiles)) {
    const path = join(storybookRoot, relativePath)
    const content = await readPolicyFile(path)

    if (content !== undefined && content !== expectedContent) {
      findings.push(`${path}: crawl policy differs from the canonical policy`)
    }
  }
}

if (findings.length > 0) {
  console.error("Storybook crawl policy check failed:\n")
  for (const finding of findings) {
    console.error(`- ${finding}`)
  }
  process.exitCode = 1
} else {
  console.log("Storybook crawl policy is consistent across React, Vue, and Svelte.")
}
