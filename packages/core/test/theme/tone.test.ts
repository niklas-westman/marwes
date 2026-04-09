import { describe, expect, it } from "vitest"
import { resolveTone } from "../../src/theme/tone"

// ─── resolveTone — default ────────────────────────────────────────────────────

describe("resolveTone — default", () => {
  it("returns empty object", () => {
    expect(resolveTone("default")).toEqual({})
  })
})

// ─── resolveTone — digital ────────────────────────────────────────────────────

describe("resolveTone — digital", () => {
  it("font.primary contains Fira Code", () => {
    expect(resolveTone("digital").font?.primary).toContain("Fira Code")
  })

  it("font.secondary contains Fira Code", () => {
    expect(resolveTone("digital").font?.secondary).toContain("Fira Code")
  })

  it("ui.radius is 0", () => {
    expect(resolveTone("digital").ui?.radius).toBe(0)
  })

  it("typography h1 letterSpacing is 0", () => {
    expect(resolveTone("digital").typography?.h1?.letterSpacing).toBe(0)
  })

  it("typography h1 fontWeight is 500", () => {
    expect(resolveTone("digital").typography?.h1?.fontWeight).toBe(500)
  })

  it("typography h2 letterSpacing is 0", () => {
    expect(resolveTone("digital").typography?.h2?.letterSpacing).toBe(0)
  })

  it("typography h3 letterSpacing is 0", () => {
    expect(resolveTone("digital").typography?.h3?.letterSpacing).toBe(0)
  })
})

// ─── resolveTone — playful ────────────────────────────────────────────────────

describe("resolveTone — playful", () => {
  it("font.primary contains Nunito", () => {
    expect(resolveTone("playful").font?.primary).toContain("Nunito")
  })

  it("ui.radius is 16", () => {
    expect(resolveTone("playful").ui?.radius).toBe(16)
  })

  it("typography h1 fontWeight is 800", () => {
    expect(resolveTone("playful").typography?.h1?.fontWeight).toBe(800)
  })

  it("typography h1 lineHeight is generous", () => {
    const lineHeight = resolveTone("playful").typography?.h1?.lineHeight ?? 0
    expect(lineHeight).toBeGreaterThan(1.1875)
  })
})

// ─── resolveTone — editorial ──────────────────────────────────────────────────

describe("resolveTone — editorial", () => {
  it("font.primary contains Playfair Display", () => {
    expect(resolveTone("editorial").font?.primary).toContain("Playfair Display")
  })

  it("font.secondary contains Lora", () => {
    expect(resolveTone("editorial").font?.secondary).toContain("Lora")
  })

  it("ui.radius is 2", () => {
    expect(resolveTone("editorial").ui?.radius).toBe(2)
  })

  it("typography h1 fontWeight is 400", () => {
    expect(resolveTone("editorial").typography?.h1?.fontWeight).toBe(400)
  })

  it("typography h1 letterSpacing is wider than default", () => {
    const letterSpacing = resolveTone("editorial").typography?.h1?.letterSpacing ?? -2
    expect(letterSpacing).toBeGreaterThan(-0.96)
  })

  it("typography h1 lineHeight is taller than default", () => {
    const lineHeight = resolveTone("editorial").typography?.h1?.lineHeight ?? 0
    expect(lineHeight).toBeGreaterThan(1.1875)
  })
})

// ─── resolveTone — return type is Partial<ThemeInput> ─────────────────────────

describe("resolveTone — structure", () => {
  it("digital tone returns object with font, ui, and typography keys", () => {
    const tone = resolveTone("digital")
    expect(tone).toHaveProperty("font")
    expect(tone).toHaveProperty("ui")
    expect(tone).toHaveProperty("typography")
  })

  it("default tone returns object with no keys", () => {
    expect(Object.keys(resolveTone("default"))).toHaveLength(0)
  })
})
