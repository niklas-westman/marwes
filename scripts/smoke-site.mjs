import process from "node:process"

const modes = {
  core: ["/", "/robots.txt", "/sitemap.xml", "/docs/get-started/react/", "/docs/components/"],
  ai: [
    "/llms.txt",
    "/ai/index.json",
    "/ai/react.md",
    "/ai/vue.md",
    "/ai/svelte.md",
    "/ai/v1/component-registry.json",
    "/ai/v1/component-manifest.json",
    "/ai/v1/purpose-registry.json",
    "/ai/v1/framework-parity.json",
    "/ai/v1/design-provenance.json",
    "/ai/v1/public-api.json",
  ],
}

function usage() {
  return [
    "Usage: pnpm site:smoke -- --origin <url> [--site dashboard|storybook] [--mode core|ai|all] [--version <name>] [--target <path>] [--timeout-ms <ms>]",
    "",
    "Dashboard modes select core and AI targets. Storybook checks robots plus /<version>/ and /<version>/index.json.",
    "Repeat --target to add deployment-specific paths.",
  ].join("\n")
}

function parseArguments(argv) {
  const options = {
    mode: "all",
    site: "dashboard",
    targets: [],
    timeoutMs: 10_000,
    version: "latest",
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    const value = argv[index + 1]
    if (argument === "--") {
      continue
    }
    if (argument === "--help" || argument === "-h") {
      console.log(usage())
      process.exit(0)
    }
    if (
      argument === "--origin" ||
      argument === "--site" ||
      argument === "--mode" ||
      argument === "--version" ||
      argument === "--target" ||
      argument === "--timeout-ms"
    ) {
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a value`)
      }
      index += 1
      if (argument === "--origin") options.origin = value
      if (argument === "--site") options.site = value
      if (argument === "--mode") options.mode = value
      if (argument === "--version") options.version = value
      if (argument === "--target") options.targets.push(value)
      if (argument === "--timeout-ms") options.timeoutMs = Number(value)
      continue
    }
    throw new Error(`unknown argument: ${argument}`)
  }

  if (!options.origin) {
    throw new Error("--origin is required; this command intentionally never assumes a live site")
  }
  if (!["core", "ai", "all"].includes(options.mode)) {
    throw new Error("--mode must be core, ai, or all")
  }
  if (!["dashboard", "storybook"].includes(options.site)) {
    throw new Error("--site must be dashboard or storybook")
  }
  if (
    !/^[a-zA-Z0-9._-]+$/.test(options.version) ||
    options.version === "." ||
    options.version === ".."
  ) {
    throw new Error("--version must contain only letters, numbers, dots, underscores, or hyphens")
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1) {
    throw new Error("--timeout-ms must be a positive integer")
  }

  const standardTargets =
    options.site === "storybook"
      ? ["/robots.txt", `/${options.version}/`, `/${options.version}/index.json`]
      : options.mode === "all"
        ? [...modes.core, ...modes.ai]
        : modes[options.mode]
  options.targets = [...new Set([...standardTargets, ...options.targets])]
  for (const target of options.targets) {
    if (!target.startsWith("/") || target.startsWith("//") || /[?#]/.test(target)) {
      throw new Error(`target must be a root-relative path without query or fragment: ${target}`)
    }
  }
  options.origin = new URL(options.origin).toString()
  return options
}

function expectedMediaType(pathname) {
  if (pathname.endsWith(".json")) return "application/json"
  if (pathname.endsWith(".xml")) return "application/xml"
  if (pathname.endsWith(".md")) return "text/plain"
  if (pathname.endsWith(".txt")) return "text/plain"
  return "text/html"
}

function validateBody(body, mediaType, target) {
  const trimmedBody = body.trim()
  if (trimmedBody === "") {
    throw new Error("empty response body")
  }
  if (mediaType !== "text/html" && /<(?:!doctype\s+html|html)\b/i.test(trimmedBody.slice(0, 512))) {
    throw new Error("received an HTML fallback for a non-HTML resource")
  }
  if (
    /<title[^>]*>\s*(?:404|page not found|not found)\b/i.test(trimmedBody) ||
    /<h1[^>]*>\s*(?:404|page not found|not found)\b/i.test(trimmedBody)
  ) {
    throw new Error("response body looks like a soft 404")
  }

  if (mediaType === "application/json") {
    JSON.parse(trimmedBody)
  } else if (mediaType === "application/xml" && !/<urlset\b/i.test(trimmedBody)) {
    throw new Error("sitemap response does not contain a urlset")
  } else if (target === "/" && !/<main\b/i.test(trimmedBody)) {
    throw new Error("dashboard HTML does not contain a main element")
  }
}

async function checkTarget(origin, target, timeoutMs) {
  const url = new URL(target, origin)
  const response = await fetch(url, {
    headers: { accept: "*/*", "user-agent": "marwes-site-smoke/1" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  })
  const mediaType = expectedMediaType(url.pathname)
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? ""
  const contentTypeEssence = contentType.split(";", 1)[0]?.trim()
  const body = await response.text()

  if (response.status !== 200) {
    throw new Error(`expected status 200, received ${response.status}`)
  }
  if (contentTypeEssence !== mediaType) {
    throw new Error(`expected content-type ${mediaType}, received ${contentType || "<missing>"}`)
  }
  validateBody(body, mediaType, target)
  return `${url} (${response.status}, ${contentTypeEssence})`
}

async function checkMissingAiResource(origin, timeoutMs) {
  const url = new URL("/ai/__marwes-smoke-missing__.json", origin)
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "marwes-site-smoke/1" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (response.status !== 404) {
    throw new Error(`${url}: expected status 404, received ${response.status}`)
  }

  return `${url} (${response.status})`
}

let options
try {
  options = parseArguments(process.argv.slice(2))
} catch (error) {
  console.error(`${error.message}\n\n${usage()}`)
  process.exit(1)
}

const results = await Promise.allSettled(
  options.targets.map((target) => checkTarget(options.origin, target, options.timeoutMs)),
)
const failures = []
let checkedTargetCount = results.length
for (const [index, result] of results.entries()) {
  const target = options.targets[index]
  if (result.status === "fulfilled") {
    console.log(`PASS ${result.value}`)
  } else {
    failures.push(`${new URL(target, options.origin)}: ${result.reason?.message ?? result.reason}`)
  }
}

if (options.site === "dashboard" && options.mode !== "core") {
  checkedTargetCount += 1
  try {
    console.log(`PASS ${await checkMissingAiResource(options.origin, options.timeoutMs)}`)
  } catch (error) {
    failures.push(error.message)
  }
}

if (failures.length > 0) {
  console.error("\nSite smoke check failed:\n")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exitCode = 1
} else {
  console.log(`\nSite smoke check passed for ${checkedTargetCount} target(s).`)
}
