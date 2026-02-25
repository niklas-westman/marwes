import { describe, expect, it } from "vitest"
import { createSystem, switchMode } from "../../src/theme/create-system"
import type { Preset } from "../../src/theme/theme-types"

const preset: Preset = {
  name: "test",
  theme: {
    ui: { radius: 6 },
    font: { primary: "Test Sans" },
  },
}

describe("createSystem", () => {
  it("defaults to light mode", () => {
    const system = createSystem({ preset })
    expect(system.theme.mode).toBe("light")
    expect(system.preset).toBe(preset)
  })

  it("supports dark mode override", () => {
    const system = createSystem({ preset, theme: { mode: "dark" } })
    expect(system.theme.mode).toBe("dark")
  })
})

describe("switchMode", () => {
  it("returns same object when mode does not change", () => {
    const system = createSystem({ preset })
    expect(switchMode(system, "light")).toBe(system)
  })

  it("switches mode while preserving preset", () => {
    const system = createSystem({ preset })
    const next = switchMode(system, "dark")

    expect(next).not.toBe(system)
    expect(next.theme.mode).toBe("dark")
    expect(next.preset).toBe(system.preset)
  })
})
