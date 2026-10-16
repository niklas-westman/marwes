import { createHash } from "node:crypto"
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises"
import { get } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import type { GovernanceReport } from "../../src/contracts/report.js"
import { type GovernanceUIOperations, serveGovernanceUI } from "./server.js"
const servers: Awaited<ReturnType<typeof serveGovernanceUI>>[] = []
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => server.close()))
})
async function start(verify: GovernanceUIOperations["verifyFamily"] = async () => {}) {
  const app = await serveGovernanceUI("/tmp/governance-ui-fixture", {
    port: 0,
    operations: {
      getCatalog: () => ({ families: [{ family: "button", cases: [] }] }),
      readReport: () => {
        throw new Error("Malformed fixture report")
      },
      verifyFamily: verify,
    },
  })
  servers.push(app)
  const { capability } = await (await fetch(`${app.url}/api/catalog`)).json()
  const post = (body: unknown, headers = {}) =>
    fetch(`${app.url}/api/jobs`, {
      method: "POST",
      headers: {
        Origin: app.url,
        "X-Governance-Capability": capability,
        ...headers,
      },
      body: JSON.stringify(body),
    })
  return { ...app, post }
}
describe("local inspection boundary", () => {
  it("downloads the requested exact-run snapshot without executing validation", async () => {
    const selections: unknown[] = []
    let validations = 0
    const app = await serveGovernanceUI("/tmp/governance-ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({ families: [] }),
        readReport: () => {
          throw Error("Unexpected report lookup")
        },
        verifyFamily: async () => {
          validations++
        },
      },
      exportReport: async (_root, selection) => {
        selections.push(selection)
        if (selection.runId === "broken-run") throw Error("Artifact missing or corrupted")
        return { html: "<!doctype html><p>Frozen evidence</p>" }
      },
    })
    servers.push(app)
    const response = await fetch(`${app.url}/api/export?family=button&run=exact-run`)
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="button-exact-run.html"',
    )
    expect(await response.text()).toContain("Frozen evidence")
    expect(selections).toEqual([{ family: "button", runId: "exact-run" }])
    const inline = await fetch(`${app.url}/api/report?family=button&run=exact-run`)
    expect(inline.status).toBe(200)
    expect(inline.headers.get("content-disposition")).toBe(
      'inline; filename="button-exact-run.html"',
    )
    expect(inline.headers.get("content-security-policy")).toBeNull()
    expect((await fetch(`${app.url}/api/export?family=button&run=../secret`)).status).toBe(400)
    expect((await fetch(`${app.url}/api/export?family=button`)).status).toBe(400)
    const broken = await fetch(`${app.url}/api/export?family=button&run=broken-run`)
    expect(broken.status).toBe(422)
    expect(broken.headers.get("content-disposition")).toBeNull()
    expect(validations).toBe(0)
  })
  it("exposes a versioned read-only provider while retaining the existing inspector", async () => {
    const app = await start()
    const response = await fetch(`${app.url}/api/provider/v1`)
    expect(response.status).toBe(200)
    const provider = await response.json()
    expect(provider.schema).toBe("marwes.reflection-ui-provider/v1")
    expect(provider.families[0].id).toBe("button")
    expect(provider.families[0].inventory.requiredItems).toBeNull()
    expect(provider.capabilities.acceptReview).toBe(false)
    expect(provider.capabilities.promoteReferences).toBe(false)
    expect(provider.integration.state).toBe("provider-ready-ui-unavailable")
    expect((await fetch(`${app.url}/api/provider/v2`)).status).toBe(404)
    expect((await fetch(app.url)).status).toBe(200)
  })
  it("rejects mutations without origin/capability and unknown commands, paths or selectors", async () => {
    let calls = 0
    const app = await start(async () => {
      calls++
    })
    expect(
      (await app.post({ family: "button", adapter: "all" }, { Origin: "https://other.example" }))
        .status,
    ).toBe(403)
    expect(
      (await app.post({ family: "button", adapter: "all" }, { "X-Governance-Capability": "wrong" }))
        .status,
    ).toBe(403)
    expect((await app.post({ family: "../button", adapter: "react" })).status).toBe(400)
    expect((await app.post({ family: "unknown", adapter: "all" })).status).toBe(400)
    expect((await app.post({ family: "button", adapter: "all", command: "echo" })).status).toBe(400)
    expect((await fetch(`${app.url}/api/jobs`)).status).toBe(404)
    expect(calls).toBe(0)
  })
  it("forwards only an explicitly selected safe stage, leaving active jobs active", async () => {
    const selections: Array<{ family: string; adapters: string[]; stageId?: string }> = []
    const app = await start(async (_root, selection) => {
      selections.push(selection)
    })
    const stageId = "01234567-89ab-cdef-0123-456789abcdef"
    expect((await app.post({ family: "button", adapter: "all", stageId: "../stage" })).status).toBe(
      400,
    )
    expect((await app.post({ family: "button", adapter: "react", stageId })).status).toBe(202)
    expect((await app.post({ family: "button", adapter: "vue" })).status).toBe(202)
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(selections).toEqual([
      { family: "button", adapters: ["react"], stageId },
      { family: "button", adapters: ["vue"] },
    ])
  })
  it("serializes registered jobs and retains failures", async () => {
    let release!: () => void
    let running = 0
    let maximum = 0
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const app = await start(async () => {
      running++
      maximum = Math.max(maximum, running)
      await gate
      running--
      throw new Error("Required visual proof failed")
    })
    const first = await (await app.post({ family: "button", adapter: "react" })).json()
    const second = await (await app.post({ family: "button", adapter: "vue" })).json()
    expect((await (await fetch(`${app.url}/api/jobs/${second.id}`)).json()).state).toBe("queued")
    release()
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(maximum).toBe(1)
    expect((await (await fetch(`${app.url}/api/jobs/${first.id}`)).json()).state).toBe("failed")
  })
  it("shows malformed report errors and refuses unlisted artifacts", async () => {
    const app = await start()
    expect((await fetch(`${app.url}/api/runs/run-fixture`)).status).toBe(422)
    expect((await fetch(`${app.url}/api/artifact?run=../secret&path=secret`)).status).toBe(400)
    expect((await fetch(`${app.url}/../../package.json`)).status).toBe(404)
  })
  it("serves only exact manifest artifacts with intact hashes and confined paths", async () => {
    const root = await mkdtemp(join(tmpdir(), "governance-ui-"))
    const folder = join(root, ".reflection/governance/run-fixture")
    await mkdir(folder, { recursive: true })
    const bytes = Buffer.from("fixture image bytes")
    await writeFile(join(folder, "actual.png"), bytes)
    await writeFile(join(folder, "reference.webp"), bytes)
    await writeFile(join(root, "secret.png"), bytes)
    await symlink(join(root, "secret.png"), join(folder, "escape.png"))
    await mkdir(join(root, ".reflection/governance/other-run"), {
      recursive: true,
    })
    await writeFile(join(root, ".reflection/governance/other-run/actual.png"), bytes)
    await symlink(
      join(root, ".reflection/governance/other-run/actual.png"),
      join(folder, "other-run.png"),
    )
    const digest = createHash("sha256").update(bytes).digest("hex")
    const report: GovernanceReport = {
      schemaVersion: 1,
      runId: "run-fixture",
      family: "button",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      fingerprint: "a".repeat(64),
      environment: {},
      freshness: { state: "current", reasons: [] },
      review: { state: "unreviewed" },
      outcome: "blocked",
      cases: [
        {
          caseId: "button.basic",
          adapter: "react",
          mode: "light",
          sourceUrl: "",
          measurements: [],
          outcomes: {
            integrity: "passed",
            structural: "not-run",
            visual: "not-run",
            behavior: "not-run",
            coverage: "not-run",
          },
          unsupported: [],
          artifacts: [
            { path: "actual.png", sha256: digest, mimeType: "image/png" },
            { path: "reference.webp", sha256: digest, mimeType: "image/webp", role: "reference" },
            { path: "escape.png", sha256: digest, mimeType: "image/png" },
            { path: "other-run.png", sha256: digest, mimeType: "image/png" },
          ],
        },
      ],
    }
    const app = await serveGovernanceUI(root, {
      port: 0,
      operations: {
        getCatalog: () => ({ families: [] }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    servers.push(app)
    const artifact = (path: string) =>
      fetch(`${app.url}/api/artifact?run=run-fixture&path=${encodeURIComponent(path)}`)
    try {
      expect((await artifact("actual.png")).status).toBe(200)
      const webp = await artifact("reference.webp")
      expect(webp.status).toBe(200)
      expect(webp.headers.get("content-type")).toBe("image/webp")
      expect(Buffer.from(await webp.arrayBuffer())).toEqual(bytes)
      expect((await artifact("unknown.png")).status).toBe(404)
      expect((await artifact("escape.png")).status).toBe(403)
      expect((await artifact("other-run.png")).status).toBe(403)
      await writeFile(join(folder, "actual.png"), "tampered")
      expect((await artifact("actual.png")).status).toBe(409)
      const hostStatus = await new Promise<number | undefined>((resolve, reject) => {
        get(`${app.url}/api/catalog`, { headers: { Host: "attacker.example" } }, (res) => {
          res.resume()
          resolve(res.statusCode)
        }).on("error", reject)
      })
      expect(hostStatus).toBe(403)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
