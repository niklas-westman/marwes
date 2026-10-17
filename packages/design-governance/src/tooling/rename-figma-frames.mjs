#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { BridgeServer } from "./figma-bridge-server.mjs"

const defaultRenameMapPath =
  "packages/design-governance/reflection-families/pending-figma-frame-renames.json"
const defaultHost = "localhost"

function usage() {
  return [
    "Usage:",
    "  pnpm reflection:figma:rename-frames",
    "  pnpm reflection:figma:rename-frames -- --write",
    "  pnpm reflection:figma:rename-frames -- --family accordion --write",
    "",
    "Options:",
    `  --map <path>          Rename map. Defaults to ${defaultRenameMapPath}.`,
    "  --family <name>       Rename one family only. Can be repeated.",
    "  --write               Apply renames in Figma. Without this, performs a dry run.",
    "  --force               Rename nodes that already have another reflection/* name.",
    "  --accept-any-file     Use the first connected Figma file even if the file key differs.",
    "  --host <host>         WebSocket host. Defaults to localhost.",
    "  --port <port>         Use one exact bridge port instead of scanning 9223-9232.",
    "  --timeout <ms>        Wait timeout. Defaults to 120000.",
    "  --json                Print machine-readable summary.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    mapPath: defaultRenameMapPath,
    families: [],
    write: false,
    force: false,
    acceptAnyFile: false,
    host: defaultHost,
    port: undefined,
    timeoutMs: 120000,
    json: false,
    help: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    function readValue() {
      const value = argv[index + 1]
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`)
      index += 1
      return value
    }

    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--map") options.mapPath = readValue()
    else if (arg === "--family") options.families.push(readValue())
    else if (arg === "--write") options.write = true
    else if (arg === "--force") options.force = true
    else if (arg === "--accept-any-file") options.acceptAnyFile = true
    else if (arg === "--host") options.host = readValue()
    else if (arg === "--port") options.port = Number(readValue())
    else if (arg === "--timeout") options.timeoutMs = Number(readValue())
    else if (arg === "--json") options.json = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  if (options.port !== undefined && !Number.isInteger(options.port)) {
    throw new Error("--port must be an integer")
  }

  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error("--timeout must be a positive integer")
  }

  return options
}

function log(options, message) {
  if (!options.json) console.log(message)
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function selectedFamilies(renameMap, options) {
  const familyFilter = new Set(options.families)
  const families = Object.entries(renameMap.families ?? {})
  if (familyFilter.size === 0) return families
  return families.filter(([family]) => familyFilter.has(family))
}

function buildRenames(renameMap, options) {
  const renames = []
  const byNodeId = new Map()

  for (const [family, cases] of selectedFamilies(renameMap, options)) {
    for (const caseEntry of cases) {
      for (const [mode, frame] of Object.entries(caseEntry.requiredFrameNames ?? {})) {
        const nodeId = frame.figmaNodeId
        const name = frame.requiredName
        if (!nodeId || !name) {
          throw new Error(`Invalid rename entry for ${family}:${caseEntry.caseId}:${mode}`)
        }

        const entry = {
          family,
          caseId: caseEntry.caseId,
          mode,
          nodeId,
          currentName: frame.currentName,
          name,
        }

        const existing = byNodeId.get(nodeId)
        if (existing && existing.name !== name) {
          throw new Error(
            `Conflicting rename target for node ${nodeId}: ${existing.name} vs ${name}`,
          )
        }

        if (!existing) {
          byNodeId.set(nodeId, entry)
          renames.push(entry)
        }
      }
    }
  }

  return renames
}

function summarizeResult(result) {
  return {
    success: Boolean(result?.success),
    dryRun: Boolean(result?.dryRun),
    total: result?.total ?? 0,
    renamed: result?.renamed?.length ?? 0,
    alreadyNamed: result?.alreadyNamed?.length ?? 0,
    missing: result?.missing?.length ?? 0,
    conflicts: result?.conflicts?.length ?? 0,
    errors: result?.errors?.length ?? 0,
  }
}

async function main(argv) {
  const options = parseArgs(argv)
  if (options.help) {
    console.log(usage())
    return
  }

  const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url))
  const renameMapPath = resolve(repoRoot, options.mapPath)
  if (!existsSync(renameMapPath)) throw new Error(`Missing rename map: ${options.mapPath}`)

  const renameMap = readJson(renameMapPath)
  const renames = buildRenames(renameMap, options)
  const server = new BridgeServer({ host: options.host, port: options.port })

  if (renames.length === 0) throw new Error("No frame renames matched the provided filters.")

  try {
    const port = await server.start()
    log(options, `Prepared ${renames.length} Reflection frame rename(s).`)
    log(options, `Figma bridge waiting on ws://${options.host}:${port}`)
    log(options, "Open Figma Desktop with the Marwes file, then run:")
    log(options, "Plugins > Development > Marwes Figma Bridge")
    log(options, `Expected file key: ${renameMap.figmaFileKey}`)
    if (!options.write) log(options, "Mode: dry run. Re-run with --write to apply names.")

    let client
    try {
      client = await server.waitForClient(
        renameMap.figmaFileKey,
        options.timeoutMs,
        options.acceptAnyFile,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(
        `${message}. Observed bridge clients: ${server.describeClients()}. Recent bridge events: ${server.describeEvents()}`,
      )
    }

    const connectedFileName = client.fileInfo?.fileName ?? "Figma file"
    const connectedFileKey = client.fileInfo?.fileKey ?? "no file key reported"
    log(options, `Connected to ${connectedFileName} (${connectedFileKey})`)

    const result = await server.sendCommand(
      client,
      "RENAME_REFLECTION_FRAMES",
      {
        fileKey: options.acceptAnyFile ? undefined : renameMap.figmaFileKey,
        dryRun: !options.write,
        force: options.force,
        renames: renames.map((entry) => ({
          nodeId: entry.nodeId,
          currentName: entry.currentName,
          name: entry.name,
        })),
      },
      options.timeoutMs,
    )

    const summary = summarizeResult(result)

    if (options.json) {
      console.log(JSON.stringify({ ...summary, details: result }, null, 2))
    } else {
      log(options, "")
      log(
        options,
        `${summary.dryRun ? "Previewed" : "Renamed"} ${summary.renamed} frame(s); ${summary.alreadyNamed} already correct.`,
      )
      log(
        options,
        `Missing: ${summary.missing}; conflicts: ${summary.conflicts}; errors: ${summary.errors}`,
      )
      if (summary.dryRun) log(options, "No Figma changes were made. Re-run with --write to apply.")
    }

    if (!summary.success) {
      process.exitCode = 1
    }
  } finally {
    await server.close()
  }
}

const cliArgs = process.argv.slice(2).filter((arg) => arg !== "--")

main(cliArgs).catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  if (cliArgs.includes("--json")) {
    console.log(JSON.stringify({ success: false, error: message }, null, 2))
  } else {
    console.error(message)
  }
  process.exit(1)
})
