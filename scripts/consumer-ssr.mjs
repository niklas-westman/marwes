#!/usr/bin/env node
import assert from "node:assert/strict"
import { execFileSync, spawn, spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { closeSync, openSync } from "node:fs"
import { cp, mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises"
import { createServer } from "node:http"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createPackedOverrides, readPackedManifest } from "./consumer-smoke-packages.mjs"
import {
  isKnownBlocked,
  nonceFrameworkBootstraps,
  scriptNoncePolicy,
  themeScenarios,
} from "./consumer-ssr-scenarios.mjs"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const framework = process.argv[process.argv.indexOf("--framework") + 1]
const frameworks = {
  react18: "@marwes-ui/react",
  react19: "@marwes-ui/react",
  next: "@marwes-ui/react",
  nuxt: "@marwes-ui/vue",
  sveltekit: "@marwes-ui/svelte",
}
if (!Object.hasOwn(frameworks, framework))
  throw new Error(
    "Usage: pnpm consumer:ssr --framework next|nuxt|sveltekit|react18|react19 [--reuse] [--themes]",
  )
const [major, minor] = process.versions.node.split(".").map(Number)
if (major !== 24 || minor < 15)
  throw new Error(
    "SSR consumers require Node 24.15+. Use a scoped Node 24 runtime; do not change package compatibility requirements.",
  )
const artifactRoot = join(repoRoot, ".cache", "ssr", framework)
await mkdir(artifactRoot, { recursive: true })
const require = createRequire(join(repoRoot, "apps/storybook-react/package.json"))
const { chromium } = require("playwright")
const packedNames = [
  "@marwes-ui/core",
  "@marwes-ui/presets",
  "@marwes-ui/react",
  "@marwes-ui/vue",
  "@marwes-ui/svelte",
]

function run(args, cwd, logName) {
  process.stdout.write(`> pnpm ${args.join(" ")}\n`)
  const output = logName ? openSync(join(artifactRoot, logName), "w") : "inherit"
  let result
  try {
    result = spawnSync("pnpm", args, {
      cwd,
      env: {
        ...process.env,
        CI: "true",
        NEXT_TELEMETRY_DISABLED: "1",
        NUXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", output, output],
    })
  } finally {
    if (typeof output === "number") closeSync(output)
  }
  if (result.error) throw result.error
  if (result.status !== 0)
    throw new Error(
      `pnpm ${args.join(" ")} failed (${result.status}, ${result.signal ?? "no signal"}); see ${artifactRoot}/${logName}`,
    )
}

async function buildConsumer() {
  const cached = join(artifactRoot, "consumer-path.txt")
  if (process.argv.includes("--reuse")) return (await readFile(cached, "utf8")).trim()
  const directory = await mkdtemp(join(tmpdir(), `marwes-ssr-${framework}-`))
  const packed = new Map()
  for (const name of packedNames) {
    const folder = `packages/${name.split("/")[1]}`
    const hash = createHash("sha256").update(process.versions.node)
    const inputs = execFileSync(
      "git",
      ["ls-files", "--cached", "--others", "--exclude-standard", folder],
      { cwd: repoRoot, encoding: "utf8" },
    )
      .trim()
      .split("\n")
      .filter(
        (path) =>
          !path.includes("/__tests__/") &&
          !path.includes("/tests/") &&
          !path.includes("/test-support/") &&
          !path.includes("/test/"),
      )
    for (const input of [...inputs, "tsconfig.base.json", "pnpm-lock.yaml"].sort()) {
      hash.update(input)
      hash.update(await readFile(join(repoRoot, input)))
    }
    for (const entry of packed.values()) hash.update(entry.fingerprint)
    const fingerprint = hash.digest("hex")
    const tarballDirectory = join(repoRoot, ".cache/ssr/packages", name.split("/")[1], fingerprint)
    await mkdir(tarballDirectory, { recursive: true })
    let files = (await readdir(tarballDirectory)).filter((file) => file.endsWith(".tgz"))
    if (!files.length) {
      run(["--filter", name, "build"], repoRoot, `build-${name.split("/")[1]}.log`)
      run(
        ["--filter", name, "pack", "--pack-destination", tarballDirectory],
        repoRoot,
        `pack-${name.split("/")[1]}.log`,
      )
      files = (await readdir(tarballDirectory)).filter((file) => file.endsWith(".tgz"))
    }
    if (files.length !== 1) throw new Error(`Expected one tarball for ${name}`)
    const tarball = join(tarballDirectory, files[0])
    packed.set(name, { tarball, manifest: readPackedManifest(tarball), fingerprint })
  }
  await cp(
    join(
      repoRoot,
      "scripts/fixtures/ssr-consumer",
      framework.startsWith("react") ? "react" : framework,
    ),
    directory,
    { recursive: true },
  )
  const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8"))
  if (framework.startsWith("react")) {
    manifest.dependencies.react = framework === "react18" ? "18.3.1" : "19.2.4"
    manifest.dependencies["react-dom"] = manifest.dependencies.react
  }
  await mkdir(join(directory, "tarballs"), { recursive: true })
  for (const [name, entry] of packed) {
    const local = `tarballs/${name.split("/")[1]}.tgz`
    await cp(entry.tarball, join(directory, local))
    entry.tarball = local
  }
  const overrides = createPackedOverrides(packed)
  manifest.dependencies[frameworks[framework]] = overrides[frameworks[framework]]
  manifest.dependencies["@marwes-ui/presets"] = overrides["@marwes-ui/presets"]
  manifest.pnpm = {
    overrides: {
      ...overrides,
      ...(framework === "nuxt" ? { vue: "3.5.28", "@vue/server-renderer": "3.5.28" } : {}),
    },
    onlyBuiltDependencies: ["esbuild", "@parcel/watcher", "sharp", "unrs-resolver"],
  }
  await writeFile(join(directory, "package.json"), JSON.stringify(manifest, null, 2))
  await writeFile(join(artifactRoot, "manifest.json"), JSON.stringify(manifest, null, 2))
  run(["install", "--ignore-workspace"], directory, "install.log")
  run(["build"], directory, "build-consumer.log")
  await writeFile(cached, directory)
  await cp(join(directory, "pnpm-lock.yaml"), join(artifactRoot, "consumer-lock.yaml"))
  return directory
}

async function freePort() {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = server.address().port
  await new Promise((resolve) => server.close(resolve))
  return port
}

let directory
try {
  directory = await buildConsumer()
} catch (error) {
  await writeFile(
    join(artifactRoot, "report.json"),
    JSON.stringify(
      {
        framework,
        node: process.versions.node,
        failures: 1,
        scenarios: [{ name: "package-or-consumer-build", status: "failed", reason: String(error) }],
      },
      null,
      2,
    ),
  )
  throw error
}
const port = await freePort()
const url = `http://127.0.0.1:${port}`
const server = spawn(
  "pnpm",
  framework === "next" ? ["start", "--hostname", "127.0.0.1", "--port", String(port)] : ["start"],
  {
    cwd: directory,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      HOST: "127.0.0.1",
      NITRO_HOST: "127.0.0.1",
      NITRO_PORT: String(port),
      ORIGIN: url,
    },
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  },
)
let serverLog = ""
server.stdout.on("data", (chunk) => {
  serverLog += chunk
})
server.stderr.on("data", (chunk) => {
  serverLog += chunk
})
const scenarios = []
const themeEvidence = []
let browser
let failures = 0
async function scenario(
  name,
  action,
  { probe = false, colorScheme = "light", storedPreference } = {},
) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme })
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true })
  if (storedPreference)
    await context.addInitScript(
      (value) => localStorage.setItem("marwes-ssr-theme", value),
      storedPreference,
    )
  const page = await context.newPage()
  const issues = []
  page.setDefaultTimeout(10000)
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type()))
      issues.push({ type: message.type(), text: message.text() })
  })
  page.on("pageerror", (error) => issues.push({ type: "pageerror", text: String(error) }))
  let status = "verified"
  let reason
  try {
    await action(page, context)
    assert.deepEqual(issues, [], "Browser warnings/errors must not be filtered")
  } catch (error) {
    reason = String(error)
    status = probe && isKnownBlocked({ framework, name, reason, issues }) ? "blocked" : "failed"
    if (status === "failed") failures += 1
    await page
      .screenshot({ path: join(artifactRoot, `${name}.png`), fullPage: true })
      .catch(() => {})
  } finally {
    await context.tracing.stop({ path: join(artifactRoot, `${name}.zip`) })
    await context.close()
    scenarios.push({ name, status, reason, issues })
    await writeFile(join(artifactRoot, `${name}-browser.json`), JSON.stringify(issues, null, 2))
    process.stdout.write(`${status}: ${framework}/${name}${reason ? ` ${reason}` : ""}\n`)
  }
}
try {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Production server exited: ${serverLog}`)
    try {
      if ((await fetch(`${url}/light/style-tag`)).ok) break
    } catch {}
    if (attempt === 119) throw new Error("Production server readiness timed out")
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  process.stdout.write(`Ready: ${url}/light/style-tag\n`)
  browser = await chromium.launch({ headless: true })
  const html = await (await fetch(`${url}/light/style-tag`)).text()
  await writeFile(join(artifactRoot, "server.html"), html)
  assert.ok(html.includes("Server contact"), "Contact must exist before JS")
  assert.ok(html.includes("Server notes"), "Editor must exist before JS")
  assert.ok(html.includes('aria-selected="true"'), "Initial tab selection must exist before JS")
  await scenario("baseline", async (page) => {
    await page.goto(`${url}/light/style-tag`)
    await page.getByTestId("hydrated").filter({ hasText: "ready" }).waitFor()
    const ids = await page
      .locator("[id]")
      .evaluateAll((elements) => elements.map((element) => element.id))
    assert.equal(new Set(ids).size, ids.length, "DOM ids must be unique")
    await page.getByRole("textbox", { name: "Contact", exact: true }).fill("Client contact")
    assert.equal(await page.getByTestId("changes").textContent(), "1")
    await page.getByRole("textbox", { name: "Notes", exact: true }).fill("Client notes")
    assert.equal(await page.getByTestId("rich-changes").textContent(), "1")
    await page.getByRole("tab", { name: "First", exact: true }).click()
    assert.equal(
      await page.getByRole("tab", { name: "First", exact: true }).getAttribute("aria-selected"),
      "true",
    )
    const trigger = page.getByRole("button", { name: "Open modal", exact: true })
    const overflow = await page.evaluate(() => document.body.style.overflow)
    await trigger.click()
    const dialog = page.getByRole("dialog", { name: "SSR modal" })
    await dialog.waitFor()
    assert.equal(
      await dialog.evaluate(
        (element, adapter) =>
          adapter === "nuxt"
            ? Boolean(element.closest("#teleports"))
            : Boolean(element.closest("[data-marwes-theme]")),
        framework,
      ),
      true,
      "Modal must remain in its configured portal/theme scope",
    )
    await page.getByRole("textbox", { name: "Modal input" }).evaluate(
      (element) =>
        new Promise((resolve, reject) => {
          const deadline = Date.now() + 2000
          const check = () => {
            if (document.activeElement === element) resolve(true)
            else if (Date.now() > deadline) reject(new Error("Initial modal focus missing"))
            else requestAnimationFrame(check)
          }
          check()
        }),
    )
    assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden")
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab")
    assert.equal(
      await page
        .getByRole("textbox", { name: "Modal input" })
        .evaluate((element) => document.activeElement === element),
      true,
    )
    await page.keyboard.press("Shift+Tab")
    await page.keyboard.press("Escape")
    await dialog.waitFor({ state: "detached" })
    assert.equal(await trigger.evaluate((element) => document.activeElement === element), true)
    assert.equal(await page.evaluate(() => document.body.style.overflow), overflow)
    assert.equal(
      await page.getByTestId("rich-changes").textContent(),
      "1",
      "Blur must not duplicate an unchanged editor callback",
    )
    await page.getByRole("button", { name: "Show toast", exact: true }).click()
    const toast = page.getByRole("status").filter({ hasText: "Saved project" })
    await toast.waitFor()
    await toast.getByRole("button", { name: /dismiss/i }).click()
    await toast.waitFor({ state: "detached" })
    if (framework.startsWith("react")) return
    const token = await page.evaluate(() => {
      window.__marwesNavigationToken = crypto.randomUUID()
      return window.__marwesNavigationToken
    })
    await page.getByRole("link", { name: "Next page", exact: true }).click()
    await page.getByRole("heading", { name: "Second page", exact: true }).waitFor()
    assert.equal(
      await page.evaluate(() => window.__marwesNavigationToken),
      token,
      "Navigation must preserve the document",
    )
  })
  await scenario(
    "initially-open",
    async (page) => {
      const openHtml = await (await fetch(`${url}/light/style-tag?initialOpen=1`)).text()
      await writeFile(join(artifactRoot, "initial-open-server.html"), openHtml)
      await page.goto(`${url}/light/style-tag?initialOpen=1`)
      await page.getByTestId("hydrated").filter({ hasText: "ready" }).waitFor()
      await page.getByRole("dialog", { name: "SSR modal" }).waitFor()
      assert.ok(
        openHtml.includes('role="dialog"'),
        "An initially-open modal is absent from server HTML",
      )
    },
    { probe: true },
  )
  if (process.argv.includes("--themes")) {
    const colors = new Map()
    for (const config of themeScenarios()) {
      await scenario(
        config.name,
        async (page) => {
          let release
          const gate = new Promise((resolve) => {
            release = resolve
          })
          await page.route("**/*", async (route) => {
            if (route.request().resourceType() === "script") await gate
            await route.continue().catch(() => {})
          })
          try {
            await page.goto(`${url}/${config.preference}/${config.strategy}`, {
              waitUntil: "commit",
            })
            const sample = page.getByTestId("theme-sample")
            await sample.waitFor()
            await page.waitForFunction(
              () =>
                getComputedStyle(document.querySelector('[data-testid="theme-sample"]'))
                  .backgroundColor !== "rgba(0, 0, 0, 0)",
            )
            const read = () =>
              sample.evaluate((element) => {
                const style = getComputedStyle(element)
                return {
                  background: style.backgroundColor,
                  text: style.color,
                  mode: document.documentElement.classList.contains("dark") ? "dark" : "light",
                }
              })
            const before = await read()
            assert.equal(
              await page.getByTestId("hydrated").textContent(),
              "server",
              "Modules must be paused before hydration",
            )
            const nonceHead = await page
              .locator("head script[nonce], head style[nonce]")
              .evaluateAll((elements) =>
                elements.map((element) => ({ tag: element.tagName, nonce: element.nonce })),
              )
            assert.ok(nonceHead.some((tag) => tag.tag === "SCRIPT" && tag.nonce === "ssr-fixture"))
            assert.ok(nonceHead.some((tag) => tag.tag === "STYLE" && tag.nonce === "ssr-fixture"))
            release()
            await page.getByTestId("hydrated").filter({ hasText: "ready" }).waitFor()
            const after = await read()
            themeEvidence.push({ ...config, before, after, nonceHead })
            assert.equal(after.mode, config.expectedMode)
            const key = `${config.strategy}-${config.expectedMode}`
            if (!config.storedPreference && config.preference !== "system") colors.set(key, after)
            assert.deepEqual(
              after,
              colors.get(key),
              "Client colors must match the resolved preference",
            )
            assert.deepEqual(before, after, "Theme colors must remain stable across hydration")
          } finally {
            release()
          }
        },
        { ...config, probe: true },
      )
    }
    await scenario("head-script-nonce", async (page) => {
      await page.route("**/*", async (route) => {
        if (!route.request().isNavigationRequest()) return route.continue()
        const response = await route.fetch()
        const html = await response.text()
        assert.ok(
          /<script[^>]*nonce="ssr-fixture"/.test(html),
          "Theme helper must provide its own nonce",
        )
        await route.fulfill({
          response,
          body: nonceFrameworkBootstraps(html),
          headers: { ...response.headers(), "content-security-policy": scriptNoncePolicy },
        })
      })
      await page.goto(`${url}/dark/style-tag`)
      await page.getByTestId("hydrated").filter({ hasText: "ready" }).waitFor()
      assert.equal(
        await page.evaluate(() => document.documentElement.classList.contains("dark")),
        true,
      )
    })
  }
} catch (error) {
  failures += 1
  scenarios.push({ name: "setup", status: "failed", reason: String(error) })
  process.stderr.write(`${error}\n`)
} finally {
  await browser?.close()
  if (server.pid) {
    try {
      if (process.platform === "win32") server.kill("SIGTERM")
      else process.kill(-server.pid, "SIGTERM")
    } catch {}
  }
  await writeFile(join(artifactRoot, "server.log"), serverLog)
  await writeFile(
    join(artifactRoot, "report.json"),
    JSON.stringify(
      {
        framework,
        node: process.versions.node,
        manifest: JSON.parse(await readFile(join(artifactRoot, "manifest.json"), "utf8")),
        failures,
        scenarios,
        themeEvidence,
      },
      null,
      2,
    ),
  )
}
if (
  failures ||
  (process.argv.includes("--strict-probes") &&
    scenarios.some((scenario) => scenario.status === "blocked"))
)
  process.exitCode = 1
