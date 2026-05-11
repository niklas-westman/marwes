/**
 * Svelte adapter: Tests error boundary behavior and component resilience.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("Package boundary: no preset CSS import", () => {
  it("src/lib/index.ts does not import @marwes-ui/presets as a module", () => {
    const indexPath = resolve(__dirname, "../lib/index.ts")
    const content = readFileSync(indexPath, "utf-8")
    // Check that there's no actual import/export from @marwes-ui/presets
    const importRegex = /(?:import|export).*from\s+["']@marwes-ui\/presets/
    expect(importRegex.test(content)).toBe(false)
  })
})
