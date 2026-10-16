import { createHash, randomBytes, randomUUID } from "node:crypto"
import { readFile, realpath } from "node:fs/promises"
import { type IncomingMessage, type ServerResponse, createServer } from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"

import type { Adapter, GovernanceReport } from "../../src/contracts/report.js"
import { evidenceRoot } from "../../src/evidence/store.js"
import { type ProviderCatalog, createUIProvider } from "../../src/evidence/ui-provider.js"
import { stageIdentifier } from "../../src/source-promotion/staged-inputs.js"
type Catalog = ProviderCatalog
export interface GovernanceUIOperations {
  getCatalog(repoRoot: string): Promise<Catalog> | Catalog
  readReport(repoRoot: string, runId: string): Promise<GovernanceReport> | GovernanceReport
  verifyFamily(
    repoRoot: string,
    selection: { family: string; adapters: Adapter[]; stageId?: string },
  ): Promise<unknown>
}
type Job = {
  id: string
  family: string
  adapter: string
  stageId?: string
  state: "queued" | "running" | "completed" | "failed"
  message: string
}
const adapters: Adapter[] = ["react", "vue", "svelte"]
const safeId = /^[a-z0-9-]+$/
const uiRoot = fileURLToPath(new URL("../ui/", import.meta.url))

export async function serveGovernanceUI(
  repoRoot: string,
  options: {
    port?: number
    operations?: GovernanceUIOperations
    exportReport?: (
      root: string,
      selection: { family: string; runId: string },
    ) => Promise<{ html: string }>
  } = {},
) {
  const core = options.operations ?? {
    getCatalog: async (root: string) =>
      (await import("../../src/evidence/store.js")).getCatalog(root),
    readReport: async (root: string, id: string) =>
      (await import("../../src/evidence/store.js")).readReport(root, id),
    verifyFamily: async (
      root: string,
      selection: { family: string; adapters: Adapter[]; stageId?: string },
    ) => (await import("../../src/runtime/verify.js")).verifyFamily(root, selection),
  }
  const capability = randomBytes(32).toString("hex")
  const jobs = new Map<string, Job>()
  let queue = Promise.resolve()
  let origin = ""
  const json = (res: ServerResponse, status: number, value: unknown) => {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
    })
    res.end(JSON.stringify(value))
  }
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Cache-Control", "no-store")
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'none'",
    )
    try {
      if (`http://${req.headers.host}` !== origin)
        return json(res, 403, { error: "Local host required." })
      const url = new URL(req.url ?? "/", origin)
      if (req.method === "GET" && url.pathname === "/favicon.ico") {
        res.writeHead(204)
        return res.end()
      }
      if (req.method === "GET" && url.pathname === "/api/catalog") {
        return json(res, 200, {
          catalog: await core.getCatalog(repoRoot),
          capability,
        })
      }
      if (req.method === "GET" && url.pathname === "/api/provider/v1") {
        return json(
          res,
          200,
          await createUIProvider(repoRoot, options.operations ? core : undefined),
        )
      }
      if (req.method === "GET" && ["/api/export", "/api/report"].includes(url.pathname)) {
        const runId = url.searchParams.get("run") ?? ""
        const family = url.searchParams.get("family") ?? ""
        if (!safeId.test(runId) || !safeId.test(family))
          return json(res, 400, { error: "An exact family and run are required." })
        const exportReport =
          options.exportReport ??
          (await import("../../src/evidence/html-report.js")).createHtmlReport
        const report = await exportReport(repoRoot, { family, runId })
        // The generated document carries its own restrictive hash-based CSP.
        // The live inspector's self-only header would block its embedded offline assets.
        res.removeHeader("Content-Security-Policy")
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `${url.pathname === "/api/export" ? "attachment" : "inline"}; filename="${family}-${runId}.html"`,
        })
        return res.end(report.html)
      }
      if (req.method === "GET" && url.pathname.startsWith("/api/runs/")) {
        const id = url.pathname.slice("/api/runs/".length)
        if (!safeId.test(id)) return json(res, 400, { error: "Invalid run identifier." })
        return json(res, 200, await core.readReport(repoRoot, id))
      }
      if (req.method === "GET" && url.pathname === "/api/artifact") {
        const id = url.searchParams.get("run") ?? ""
        const requested = url.searchParams.get("path") ?? ""
        if (!safeId.test(id)) return json(res, 400, { error: "Invalid run identifier." })
        const report = await core.readReport(repoRoot, id)
        const artifact = report.cases.flatMap((c) => c.artifacts).find((a) => a.path === requested)
        if (
          !artifact ||
          !["image/png", "image/webp", "image/jpeg", "application/json"].includes(artifact.mimeType)
        )
          return json(res, 404, {
            error: "Artifact is not listed in this run.",
          })
        const resolved = await realpath(path.resolve(evidenceRoot(repoRoot), id, artifact.path))
        const runRoot = await realpath(path.join(evidenceRoot(repoRoot), id))
        if (!resolved.startsWith(runRoot + path.sep))
          return json(res, 403, {
            error: "Artifact is outside the selected run.",
          })
        const bytes = await readFile(resolved)
        if (createHash("sha256").update(bytes).digest("hex") !== artifact.sha256)
          return json(res, 409, {
            error: "Artifact hash differs from the selected run.",
          })
        res.writeHead(200, { "Content-Type": artifact.mimeType })
        return res.end(bytes)
      }
      if (req.method === "GET" && url.pathname.startsWith("/api/jobs/")) {
        const job = jobs.get(url.pathname.slice("/api/jobs/".length))
        return json(res, job ? 200 : 404, job ?? { error: "Job not found." })
      }
      if (req.method === "POST" && url.pathname === "/api/jobs") {
        if (req.headers.origin !== origin || req.headers["x-governance-capability"] !== capability)
          return json(res, 403, {
            error: "Local origin and capability required.",
          })
        let body = ""
        for await (const chunk of req) {
          body += chunk
          if (body.length > 2048) return json(res, 413, { error: "Request too large." })
        }
        const selection = JSON.parse(body)
        if (
          Object.keys(selection).some((k) => !["family", "adapter", "stageId"].includes(k)) ||
          (selection.stageId !== undefined &&
            (typeof selection.stageId !== "string" || !stageIdentifier.test(selection.stageId))) ||
          typeof selection.family !== "string" ||
          !safeId.test(selection.family) ||
          !["all", ...adapters].includes(selection.adapter)
        )
          return json(res, 400, {
            error: "Choose a registered family and adapter.",
          })
        const catalog = await core.getCatalog(repoRoot)
        if (!catalog.families.some((f) => f.family === selection.family))
          return json(res, 400, { error: "Unknown component family." })
        const job: Job = {
          id: randomUUID(),
          ...selection,
          state: "queued",
          message: "Waiting for earlier validation jobs.",
        }
        jobs.set(job.id, job)
        queue = queue.then(async () => {
          job.state = "running"
          job.message = "Capturing component evidence and comparing design facts."
          try {
            await core.verifyFamily(repoRoot, {
              family: job.family,
              ...(job.stageId ? { stageId: job.stageId } : {}),
              adapters: job.adapter === "all" ? adapters : [job.adapter as Adapter],
            })
            job.state = "completed"
            job.message = "Validation finished. Inspect the proof outcomes below."
          } catch (error) {
            job.state = "failed"
            job.message = error instanceof Error ? error.message : "Validation failed."
          }
        })
        return json(res, 202, job)
      }
      if (req.method === "GET" && ["/", "/app.js", "/styles.css"].includes(url.pathname)) {
        const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1)
        res.writeHead(200, {
          "Content-Type": file.endsWith(".html")
            ? "text/html; charset=utf-8"
            : file.endsWith(".css")
              ? "text/css"
              : "text/javascript",
        })
        return res.end(await readFile(path.join(uiRoot, file)))
      }
      return json(res, 404, { error: "Route not found." })
    } catch (error) {
      return json(res, 422, {
        error: error instanceof Error ? error.message : "Evidence could not be loaded.",
      })
    }
  })
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject)
    server.listen(options.port ?? 4179, "127.0.0.1", resolve)
  })
  const address = server.address()
  if (!address || typeof address === "string") throw new Error("No local server address.")
  origin = `http://127.0.0.1:${address.port}`
  return {
    server,
    url: origin,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  }
}
