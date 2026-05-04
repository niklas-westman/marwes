import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { join, resolve } from "node:path"
import process from "node:process"
import { setTimeout as delay } from "node:timers/promises"

const docsViewMinHeightPattern = /min-height\s*:\s*100vh/i
const storyNotFoundPattern = /couldn'?t find story|story.*not found|missing story/i

function parseArgs(argv) {
  const args = new Map()

  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/)
    if (!match) {
      continue
    }

    args.set(match[1], match[2])
  }

  return args
}

function parseEntries(value) {
  return value.split(",").map((entry) => {
    const [id, label = id] = entry.split(":")
    return { id, label }
  })
}

function requireArg(args, key) {
  const value = args.get(key)
  if (!value) {
    throw new Error(`Missing required --${key} argument.`)
  }

  return value
}

function trimOutput(lines) {
  return lines.slice(-80).join("")
}

async function stopServer(server) {
  if (server.exitCode !== null || server.signalCode !== null) {
    return
  }

  server.kill("SIGTERM")
  await Promise.race([
    new Promise((resolvePromise) => server.once("exit", resolvePromise)),
    delay(5000).then(() => {
      if (server.exitCode === null && server.signalCode === null) {
        server.kill("SIGKILL")
      }
    }),
  ])
}

async function waitForStorybook(page, baseUrl, outputLines) {
  const deadline = Date.now() + 90_000
  let lastError

  while (Date.now() < deadline) {
    try {
      const response = await page.goto(`${baseUrl}/iframe.html`, {
        waitUntil: "domcontentloaded",
        timeout: 5000,
      })

      if (response?.ok()) {
        return
      }
    } catch (error) {
      lastError = error
    }

    await delay(1000)
  }

  const output = trimOutput(outputLines)
  throw new Error(
    `Storybook did not become ready at ${baseUrl}.${lastError ? ` Last error: ${lastError.message}` : ""}${
      output ? `\n\nStorybook output:\n${output}` : ""
    }`,
  )
}

async function assertDocsEntry(page, baseUrl, entry) {
  const url = `${baseUrl}/iframe.html?viewMode=docs&id=${entry.id}`

  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 })
  await page.waitForFunction(() => document.body?.textContent?.trim().length > 0, {
    timeout: 10_000,
  })

  const bodyText = await page.locator("body").innerText({ timeout: 10_000 })
  if (storyNotFoundPattern.test(bodyText)) {
    throw new Error(`${entry.label} docs entry was not found at ${url}.`)
  }

  const offenders = await page.evaluate((patternSource) => {
    const pattern = new RegExp(patternSource, "i")
    return Array.from(document.querySelectorAll("[style]"))
      .map((element) => ({
        tagName: element.tagName.toLowerCase(),
        className: element.getAttribute("class") ?? "",
        style: element.getAttribute("style") ?? "",
      }))
      .filter((element) => pattern.test(element.style))
  }, docsViewMinHeightPattern.source)

  if (offenders.length > 0) {
    throw new Error(
      `${entry.label} docs entry contains inline min-height: 100vh wrappers:\n${JSON.stringify(
        offenders,
        null,
        2,
      )}`,
    )
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const app = requireArg(args, "app")
  const label = args.get("label") ?? app
  const port = Number(requireArg(args, "port"))
  const entries = parseEntries(requireArg(args, "entries"))
  const appDir = resolve(process.cwd(), app)
  const baseUrl = `http://127.0.0.1:${port}`
  const requireFromApp = createRequire(join(appDir, "package.json"))
  const { chromium } = requireFromApp("playwright")
  const outputLines = []

  const server = spawn(
    "pnpm",
    ["exec", "storybook", "dev", "--ci", "-p", String(port), "--no-open"],
    {
      cwd: appDir,
      env: {
        ...process.env,
        BROWSER: "none",
        CI: "true",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  )

  server.stdout.on("data", (chunk) => outputLines.push(chunk.toString()))
  server.stderr.on("data", (chunk) => outputLines.push(chunk.toString()))

  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage()
    await waitForStorybook(page, baseUrl, outputLines)

    for (const entry of entries) {
      await assertDocsEntry(page, baseUrl, entry)
    }

    console.log(`${label} docs layout guard passed for ${entries.length} docs entries.`)
  } catch (error) {
    const output = trimOutput(outputLines)
    throw new Error(`${error.message}${output ? `\n\nStorybook output:\n${output}` : ""}`)
  } finally {
    await browser.close()
    await stopServer(server)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
