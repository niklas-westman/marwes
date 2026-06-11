import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("Package styling entry", () => {
  it("loads the default preset CSS from the public Svelte entry", () => {
    const indexPath = resolve(__dirname, "../lib/index.ts")
    const content = readFileSync(indexPath, "utf-8")

    expect(content).toContain('import "@marwes-ui/presets/firstEdition/styles.css"')
  })

  it("declares preset CSS as a preserved package side effect", () => {
    const packageJsonPath = resolve(__dirname, "../../package.json")
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8")) as {
      dependencies?: Record<string, string>
      sideEffects?: boolean
    }

    expect(packageJson.dependencies?.["@marwes-ui/presets"]).toBe("workspace:*")
    expect(packageJson.sideEffects).toBe(true)
  })
})
