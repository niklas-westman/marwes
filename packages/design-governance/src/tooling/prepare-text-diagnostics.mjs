#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto"
import { mkdir, readFile, realpath, writeFile } from "node:fs/promises"
import { createServer } from "node:net"
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { z } from "zod"
import { createFigmaTextSourceBundle } from "./figma-text-source-bundle.mjs"

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url))
const id = z.string().regex(/^[a-z0-9][a-z0-9.-]*$/)
const path = z.string().min(1)
const selection = z.strictObject({ capturePath: path, nodeId: z.string().min(1) })
export const textDiagnosticsPlanSchema = z
  .strictObject({
    schema: z.literal("marwes.reflection-text-plan/v1"),
    expectedFile: z.strictObject({
      key: z.string().regex(/^[A-Za-z0-9]+$/),
      name: z.string().min(1),
    }),
    selections: z
      .array(
        z.strictObject({
          caseId: id,
          mode: z.enum(["light", "dark"]),
          frame: selection,
          reference: z.strictObject({
            path,
            sha256: z.string().regex(/^[a-f0-9]{64}$/),
            bytes: z.number().int().positive(),
            mediaType: z.enum(["image/png", "image/webp"]),
            nodeId: z.string().min(1),
          }),
          parts: z
            .array(
              z.strictObject({
                id,
                nodeId: z.string().min(1),
                selector: z.string().min(1),
                outline: selection.optional(),
              }),
            )
            .min(1)
            .max(32),
        }),
      )
      .min(1)
      .max(32),
  })
  .superRefine((plan, ctx) => {
    const seen = new Set()
    for (const [index, item] of plan.selections.entries()) {
      const key = JSON.stringify([item.caseId, item.mode])
      if (seen.has(key))
        ctx.addIssue({
          code: "custom",
          path: ["selections", index],
          message: "Duplicate case/mode selection",
        })
      seen.add(key)
      if (new Set(item.parts.map((p) => p.id)).size !== item.parts.length)
        ctx.addIssue({
          code: "custom",
          path: ["selections", index, "parts"],
          message: "Duplicate part ID",
        })
    }
  })

export function parseTextDiagnosticsArgs(args) {
  const filtered = args.filter((x) => x !== "--")
  if (filtered.length === 1 && filtered[0] === "--help") return { help: true }
  if (
    filtered.length !== 2 ||
    filtered[0] !== "--plan" ||
    !filtered[1] ||
    filtered[1].startsWith("--")
  )
    throw Error("Use --plan <explicit-plan.json>; no active references or acceptance are changed")
  return { planPath: resolve(filtered[1]) }
}

/** Generate an isolated subset config, never edit the shared/active configuration. */
export function textDiagnosticsConfigSource(root, adapter, entries, port) {
  if (!["react", "vue", "svelte"].includes(adapter) || !entries.length)
    throw Error("Explicit adapter and selections required")
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw Error("A stable config port is required")
  const selected = entries.map((entry) => ({
    id: `${adapter}.${entry.caseId}.${entry.mode}`,
    source: entry.bundlePath,
    parts: entry.parts.map((part) => ({ id: part.id, selector: part.selector })),
    context: { theme: entry.mode, adapter },
    referenceRoot: dirname(entry.referencePath),
    reference: basename(entry.referencePath),
  }))
  return `import {defineMarwesReflection} from ${JSON.stringify(pathToFileURL(join(root, "reflection.shared.ts")).href)};
const config=defineMarwesReflection({adapter:${JSON.stringify(adapter)},port:${port}});
const selected=${JSON.stringify(selected)};
config.contracts.component.cases=selected.map(item=>{
  const matches=config.contracts.component.cases.filter(c=>c.id===item.id);
  if(matches.length!==1)throw Error('Missing or ambiguous enrolled visual case: '+item.id);
  const c=matches[0];
  c.baselineRoot=item.referenceRoot;
  c.baseline=item.reference;
  c.textDiagnostics={source:item.source,parts:item.parts,context:item.context,regionPadding:2,experiments:{frameRender:true,partOverlay:true}};
  return c;
});
config.contracts.component.portal.reuseExisting=false;
export default config;
`
}

// Reflection may load a config more than once; allocate once while preparing,
// rather than generating a different readyUrl during each module evaluation.
async function preparationPort() {
  const server = createServer()
  await new Promise((done, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", done)
  })
  const address = server.address()
  await new Promise((done, reject) => server.close((error) => (error ? reject(error) : done())))
  if (!address || typeof address === "string") throw Error("No free preparation port")
  return address.port
}

export async function prepareTextDiagnostics(planPath, root = repoRoot) {
  const planBytes = await readFile(planPath)
  if (planBytes.length > 1024 * 1024) throw Error("Diagnostic plan exceeds 1MiB")
  const plan = textDiagnosticsPlanSchema.parse(JSON.parse(planBytes))
  const planDirectory = dirname(resolve(planPath))
  const resolveSelection = (selected) => ({
    ...selected,
    capturePath: resolve(planDirectory, selected.capturePath),
  })
  const parent = join(root, ".reflection", "text-diagnostics")
  await mkdir(parent, { recursive: true })
  const inside = relative(await realpath(root), await realpath(parent))
  if (inside.startsWith("..") || isAbsolute(inside))
    throw Error("Diagnostic output escapes repository")
  const directory = join(parent, `${Date.now()}-${randomUUID()}`)
  await mkdir(directory)
  // Persist the exact request as provenance. It does not grant source authority.
  await writeFile(join(directory, "plan.json"), planBytes, { flag: "wx" })
  const configs = []
  for (const adapter of ["react", "vue", "svelte"]) {
    const entries = []
    for (const [index, item] of plan.selections.entries()) {
      const outputDirectory = join(directory, `${adapter}-${index}`)
      await createFigmaTextSourceBundle({
        expectedFile: plan.expectedFile,
        frame: resolveSelection(item.frame),
        parts: item.parts.map(({ selector, ...part }) => ({
          ...part,
          ...(part.outline ? { outline: resolveSelection(part.outline) } : {}),
        })),
        reference: { ...item.reference, path: resolve(planDirectory, item.reference.path) },
        context: { theme: item.mode, adapter },
        outputDirectory,
      })
      const bundlePath = join(outputDirectory, "bundle.json")
      const bundle = JSON.parse(await readFile(bundlePath, "utf8"))
      entries.push({
        ...item,
        bundlePath,
        referencePath: join(outputDirectory, bundle.reference.path),
      })
    }
    const configPath = join(directory, `reflection-${adapter}.config.ts`)
    await writeFile(
      configPath,
      textDiagnosticsConfigSource(root, adapter, entries, await preparationPort()),
      { flag: "wx" },
    )
    configs.push({
      adapter,
      configPath,
      caseIds: entries.map((e) => `${adapter}.${e.caseId}.${e.mode}`),
    })
  }
  const manifest = {
    schema: "marwes.reflection-text-preparation/v1",
    scope: "diagnostic-only",
    acceptanceChanged: false,
    referencesPromoted: false,
    planSha256: createHash("sha256").update(planBytes).digest("hex"),
    configs,
  }
  await writeFile(join(directory, "preparation.json"), `${JSON.stringify(manifest, null, 2)}\n`, {
    flag: "wx",
  })
  return { directory, ...manifest }
}

export async function main(args) {
  const options = parseTextDiagnosticsArgs(args)
  if (options.help) {
    console.log(
      "Prepare isolated Reflection text diagnostics for all three adapters.\n--plan <marwes.reflection-text-plan/v1 JSON>\nWrites fresh ignored bundles/configs only. No promotion or acceptance changes.",
    )
    return
  }
  console.log(JSON.stringify(await prepareTextDiagnostics(options.planPath), null, 2))
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
