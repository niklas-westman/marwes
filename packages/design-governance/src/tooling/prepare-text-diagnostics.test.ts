import { describe, expect, it } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import {
  parseTextDiagnosticsArgs,
  textDiagnosticsConfigSource,
  textDiagnosticsPlanSchema,
} from "./prepare-text-diagnostics.mjs"

const plan = () => ({
  schema: "marwes.reflection-text-plan/v1",
  expectedFile: { key: "file123", name: "Design" },
  selections: [
    {
      caseId: "button.purpose-refresh",
      mode: "light",
      frame: { capturePath: "frame/capture.json", nodeId: "1:2" },
      reference: {
        path: "reference.webp",
        sha256: "a".repeat(64),
        bytes: 100,
        mediaType: "image/webp",
        nodeId: "1:2",
      },
      parts: [{ id: "refresh-label", nodeId: "I1:3;1:4", selector: ".mw-btn__label" }],
    },
  ],
})

describe("isolated text-diagnostics preparation", () => {
  it("requires an explicit plan and rejects unrecognized CLI mutations", () => {
    expect(parseTextDiagnosticsArgs(["--help"])).toEqual({ help: true })
    expect(parseTextDiagnosticsArgs(["--", "--plan", "plan.json"]).planPath).toMatch(/\/plan.json$/)
    for (const args of [[], ["--plan"], ["--plan", "--help"], ["--plan", "x", "--promote"]])
      expect(() => parseTextDiagnosticsArgs(args)).toThrow()
  })
  it("rejects duplicate identities and undeclared acceptance fields", () => {
    expect(textDiagnosticsPlanSchema.parse(plan()).selections).toHaveLength(1)
    const duplicate = plan()
    duplicate.selections.push(
      requireValue(duplicate.selections[0], "Required prepare-text-diagnostics.test value"),
    )
    expect(() => textDiagnosticsPlanSchema.parse(duplicate)).toThrow("Duplicate case/mode")
    const parts = plan()
    requireValue(parts.selections[0], "Required prepare-text-diagnostics.test value").parts.push(
      requireValue(
        requireValue(parts.selections[0], "Required prepare-text-diagnostics.test value").parts[0],
        "Required prepare-text-diagnostics.test value",
      ),
    )
    expect(() => textDiagnosticsPlanSchema.parse(parts)).toThrow("Duplicate part")
    expect(() => textDiagnosticsPlanSchema.parse({ ...plan(), acceptance: "approved" })).toThrow()
  })
  it("binds generated configuration to exact selected adapter/modes and keeps native thresholds", () => {
    const entries = plan().selections.map((item) => ({
      ...item,
      bundlePath: "/diagnostic/bundle.json",
      referencePath: "/diagnostic/reference.webp",
    }))
    const source = textDiagnosticsConfigSource("/repo", "vue", entries, 51234)
    expect(source).toContain('"vue.button.purpose-refresh.light"')
    expect(source).toContain('"context":{"theme":"light","adapter":"vue"}')
    expect(source).toContain("matches.length!==1")
    expect(source).toContain("c.textDiagnostics=")
    expect(source).not.toContain("c.threshold=")
    expect(source).not.toContain("button.basic")
    expect(source).not.toContain("writeFile")
    expect(source).not.toContain("await allocateLoopbackPort")
    expect(source).toContain("port:51234")
    expect(source).toContain('"referenceRoot":"/diagnostic","reference":"reference.webp"')
    expect(() => textDiagnosticsConfigSource("/repo", "unknown", entries)).toThrow()
    expect(() => textDiagnosticsConfigSource("/repo", "react", [])).toThrow()
  })
})
