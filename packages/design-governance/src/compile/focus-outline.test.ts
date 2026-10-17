import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import { type FigmaNode, type SourceSnapshot, hash } from "../source/snapshot.js"
import { compileFamily } from "./compile-family.js"
import { type StructuralContract, validateStructuralContract } from "./structural-contract.js"
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}
function sourceStrokes(node: FigmaNode): Record<string, unknown>[] {
  const value: unknown = node.strokes
  if (!Array.isArray(value) || !value.every(isRecord)) throw new Error("Source strokes missing")
  return value
}
function sourceBounds(node: FigmaNode): Record<string, unknown> {
  const value = node.absoluteBoundingBox
  if (!isRecord(value)) throw new Error("Source bounds missing")
  return value
}

// Independent synthetic source: geometry follows the pinned Standard source rule;
// variable aliases intentionally cross collections to exercise provenance and modes.
function fixture() {
  const light = { r: 47 / 255, g: 49 / 255, b: 252 / 255, a: 1 }
  const dark = { r: 171 / 255, g: 171 / 255, b: 253 / 255, a: 1 }
  const alias = (id: string) => ({ type: "VARIABLE_ALIAS" as const, id })
  const node = (id: string, width: number, height: number, x: number, y: number): FigmaNode => ({
    id,
    name: id,
    type: "FRAME",
    absoluteBoundingBox: { x, y, width, height },
    relativeTransform: [
      [1, 0, x],
      [0, 1, y],
    ],
    fills: [],
    effects: [],
  })
  const selected = node("selected", 66, 40, 100, 100)
  selected.explicitVariableModes = { unrelated: "selected-only" }
  const control = node("control", 66, 40, 6, 6)
  control.relativeTransform = [
    [1, 0, 4],
    [0, 1, 4],
  ]
  const ring = node("ring", 74, 48, 2, 2)
  ring.children = [control]
  const standard = node("standard", 78, 52, 0, 0)
  standard.children = [ring]
  for (const [part, gap, align] of [
    [standard, 2, "INSIDE"],
    [ring, 4, "OUTSIDE"],
  ] as const) {
    Object.assign(part, {
      strokeWeight: 2,
      strokeAlign: align,
      strokes: [{ type: "SOLID", color: light }],
      paddingLeft: gap,
      paddingRight: gap,
      paddingTop: gap,
      paddingBottom: gap,
    })
    part.boundVariables = {
      strokes: [alias("focus")],
      ...Object.fromEntries(
        ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"].map((property) => [
          property,
          alias(`space-${gap}`),
        ]),
      ),
    }
  }
  const snapshot: SourceSnapshot = {
    schemaVersion: 1,
    family: "button",
    fileKey: "independent-focus",
    capture: {
      version: "pinned",
      lastModified: "2026-10-14T15:02:45Z",
      provenance: "independent test source",
    },
    hashes: { raw: hash("raw"), manifest: hash("manifest"), variables: hash("variables") },
    nodes: { selected, standard },
    inheritedModes: {
      selected: {},
      standard: { semantic: "light", brand: "blue", spacing: "standard" },
    },
    collections: [
      {
        id: "semantic",
        defaultModeId: "light",
        modes: [
          { id: "light", name: "Light" },
          { id: "dark", name: "Dark" },
        ],
      },
      { id: "brand", defaultModeId: "blue", modes: [{ id: "blue", name: "Blue" }] },
      { id: "spacing", defaultModeId: "standard", modes: [{ id: "standard", name: "Standard" }] },
    ],
    variables: [
      {
        id: "focus",
        collectionId: "semantic",
        rawValuesByMode: { light: alias("primary"), dark: alias("light-primary") },
      },
      { id: "primary", collectionId: "brand", rawValuesByMode: { blue: light } },
      { id: "light-primary", collectionId: "brand", rawValuesByMode: { blue: alias("blue-200") } },
      { id: "blue-200", collectionId: "brand", rawValuesByMode: { blue: dark } },
      { id: "space-2", collectionId: "spacing", rawValuesByMode: { standard: 2 } },
      { id: "space-4", collectionId: "spacing", rawValuesByMode: { standard: 4 } },
    ],
    components: {},
    styles: {},
    missingDependencies: [],
    missingOptionalFrames: [],
    variantInventory: [],
  }
  const contract = {
    figmaFileKey: snapshot.fileKey,
    structuralContract: "structural-contract.json",
    cases: ["light", "dark"].map((mode) => ({
      caseId: "button.focus",
      mode,
      figmaNodeId: "selected",
      source: { componentNodeId: "selected", componentNodeIds: ["selected", "standard"] },
      portalPath: "/focus",
      viewportSize: { width: 390, height: 220 },
      framing: { rootSelector: "#root", background: "#ffffff", align: "center", padding: 0 },
    })),
  }
  const mapping: StructuralContract = {
    schemaVersion: 2,
    family: "button",
    toleranceReason: "Exact independent standard focus rule",
    cases: contract.cases.map((item) => ({
      caseId: item.caseId,
      mode: item.mode,
      collectionModes: { semantic: item.mode, brand: "blue", spacing: "standard" },
      unsupported: [],
      parts: [
        {
          nodeId: "selected",
          part: "control",
          selector: "button",
          properties: [
            { property: "bounds.width", sourceProperty: "absoluteBoundingBox.width", tolerance: 0 },
          ],
        },
        {
          nodeId: "ring",
          part: "standard-focus",
          selector: "button",
          sourceRootNodeId: "standard",
          sourceProjection: "focus-outline/v1",
          properties: [
            { property: "outlineWidth", sourceProperty: "strokeWeight", tolerance: 0 },
            { property: "outlineOffset", sourceProperty: "paddingLeft", tolerance: 0 },
            { property: "outlineColor", sourceProperty: "strokes.0.color", tolerance: 0 },
            { property: "outlineStyle", sourceProperty: "strokes.0.type", tolerance: 0 },
          ],
        },
      ],
    })),
  }
  const root = mkdtempSync(join(tmpdir(), "marwes-focus-rule-"))
  const directory = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(join(directory, "source"), { recursive: true })
  mkdirSync(join(root, ".pi"))
  writeFileSync(
    join(root, ".pi/figma-sync.json"),
    JSON.stringify({
      defaultTarget: "test",
      targets: {
        test: {
          figmaFile: `https://www.figma.com/design/${snapshot.fileKey}/Test`,
          liveDir: ".figma/test",
        },
      },
    }),
  )
  function compile() {
    const bytes = JSON.stringify(snapshot)
    writeFileSync(join(directory, "source/snapshot.json"), bytes)
    writeFileSync(
      join(directory, "source/manifest.json"),
      JSON.stringify({
        schemaVersion: 1,
        family: snapshot.family,
        fileKey: snapshot.fileKey,
        snapshotSha256: hash(bytes),
        hashes: snapshot.hashes,
        capture: snapshot.capture,
      }),
    )
    writeFileSync(join(directory, "reflection-contract.json"), JSON.stringify(contract))
    writeFileSync(join(directory, "structural-contract.json"), JSON.stringify(mapping))
    return compileFamily(root, "button").cases
  }
  return { root, snapshot, mapping, contract, standard, ring, control, selected, compile }
}
function withFixture(run: (value: ReturnType<typeof fixture>) => void) {
  const value = fixture()
  try {
    run(value)
  } finally {
    rmSync(value.root, { recursive: true, force: true })
  }
}
describe("bounded independent focus rule", () => {
  it("compiles 2px/4px/solid and both ring colors with independent variable provenance", () =>
    withFixture((value) => {
      const cases = value.compile()
      expect(cases.every((item) => item.unsupported.length === 0)).toBe(true)
      for (const item of cases) {
        const expected = Object.fromEntries(
          item.expectations
            .filter((row) => row.part === "standard-focus")
            .map((row) => [row.property, row.expected]),
        )
        expect(expected).toEqual({
          outlineWidth: 2,
          outlineOffset: 4,
          outlineStyle: "solid",
          outlineColor: item.mode === "light" ? "rgba(47, 49, 252, 1)" : "rgba(171, 171, 253, 1)",
        })
        const color = requireValue(item.expectations.find((row) => row.property === "outlineColor"))
        expect(color.source.nodeId).toBe("ring")
        expect(color.source.propertyPath).toBe("strokes.0.color")
        expect(color.source.aliasChain).toEqual(
          item.mode === "light" ? ["focus", "primary"] : ["focus", "light-primary", "blue-200"],
        )
        expect(color.source.collectionId).toBe("brand")
        expect(
          requireValue(item.expectations.find((row) => row.property === "outlineOffset")).source
            .aliasChain,
        ).toEqual(["space-4"])
      }
    }))
  it("keeps schema1 output identical when schema2 extensions are unused", () =>
    withFixture((value) => {
      for (const item of value.mapping.cases)
        item.parts = item.parts.filter((part) => part.part === "control")
      value.mapping.schemaVersion = 1
      const original = value.compile()
      value.mapping.schemaVersion = 2
      expect(value.compile()).toEqual(original)
    }))
  it.each(["sourceRootNodeId", "sourceProjection"])("rejects %s in schema1", (field) =>
    withFixture((value) => {
      value.mapping.schemaVersion = 1
      const part = requireValue(requireValue(value.mapping.cases[0]).parts[1])
      if (field === "sourceRootNodeId") Reflect.deleteProperty(part, "sourceProjection")
      else Reflect.deleteProperty(part, "sourceRootNodeId")
      expect(() => validateStructuralContract(value.mapping)).toThrow("Unknown semantic part key")
    }),
  )
  it("rejects unknown projection versions", () =>
    withFixture((value) => {
      ;(requireValue(value.mapping.cases[0]).parts[1] as Record<string, unknown>).sourceProjection =
        "arbitrary-expression"
      expect(() => validateStructuralContract(value.mapping)).toThrow(
        "Unsupported source projection",
      )
    }))
  const failures: [string, (value: ReturnType<typeof fixture>) => void, string][] = [
    [
      "painted Standard background",
      (value) => {
        value.standard.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
      },
      "cannot paint a background",
    ],
    [
      "painted Ring background",
      (value) => {
        value.ring.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
      },
      "cannot paint a background",
    ],
    [
      "translated control",
      (value) => {
        value.control.relativeTransform = [
          [1, 0, 5],
          [0, 1, 4],
        ]
      },
      "bounds disagree",
    ],
    [
      "unlisted root",
      (value) => {
        requireValue(value.contract.cases[0]).source.componentNodeIds = ["selected"]
      },
      "not explicitly allowed",
    ],
    [
      "missing root",
      (value) => {
        Reflect.deleteProperty(value.snapshot.nodes, "standard")
      },
      "source root standard missing",
    ],
    [
      "node outside root",
      (value) => {
        requireValue(requireValue(value.mapping.cases[0]).parts[1]).nodeId = "selected"
      },
      "source node selected missing",
    ],
    [
      "conflicting root mode",
      (value) => {
        value.standard.explicitVariableModes = { semantic: "dark" }
      },
      "Conflicting selected mode",
    ],
    [
      "captured literal disagreement",
      (value) => {
        requireValue(sourceStrokes(value.ring)[0]).color = { r: 1, g: 0, b: 0, a: 1 }
      },
      "Captured literal disagrees",
    ],
    [
      "asymmetric padding",
      (value) => {
        value.ring.paddingRight = 5
        Reflect.deleteProperty(requireValue(value.ring.boundVariables), "paddingRight")
      },
      "symmetric source padding",
    ],
    [
      "inside ring stroke",
      (value) => {
        value.ring.strokeAlign = "INSIDE"
      },
      "SOLID OUTSIDE stroke",
    ],
    [
      "gradient",
      (value) => {
        requireValue(sourceStrokes(value.ring)[0]).type = "GRADIENT_LINEAR"
      },
      "SOLID OUTSIDE stroke",
    ],
    [
      "multiple paints",
      (value) => {
        sourceStrokes(value.ring).push({ type: "SOLID" })
      },
      "SOLID OUTSIDE stroke",
    ],
    [
      "opacity",
      (value) => {
        value.ring.opacity = 0.5
      },
      "Unsupported focus outline",
    ],
    [
      "paint opacity",
      (value) => {
        requireValue(sourceStrokes(value.ring)[0]).opacity = 0.5
      },
      "SOLID OUTSIDE stroke",
    ],
    [
      "dashes",
      (value) => {
        value.ring.dashPattern = [2, 2]
      },
      "Unsupported focus outline",
    ],
    [
      "advanced stroke",
      (value) => {
        value.ring.complexStrokeProperties = { strokeType: "ADVANCED" }
      },
      "basic source stroke",
    ],
    [
      "mixed stroke weights",
      (value) => {
        value.ring.strokeTopWeight = 1
      },
      "uniform source stroke",
    ],
    [
      "malformed dash pattern",
      (value) => {
        value.ring.dashPattern = "solid"
      },
      "Unsupported focus outline",
    ],
    [
      "blend mode",
      (value) => {
        value.ring.blendMode = "MULTIPLY"
      },
      "Unsupported focus outline",
    ],
    [
      "paint blend",
      (value) => {
        requireValue(sourceStrokes(value.ring)[0]).blendMode = "MULTIPLY"
      },
      "SOLID OUTSIDE stroke",
    ],
    [
      "effects",
      (value) => {
        value.ring.effects = [{ visible: true, type: "DROP_SHADOW" }]
      },
      "Unsupported focus outline",
    ],
    [
      "scale",
      (value) => {
        value.ring.relativeTransform = [
          [2, 0, 2],
          [0, 1, 2],
        ]
      },
      "unscaled axis-aligned",
    ],
    [
      "inconsistent bounds",
      (value) => {
        sourceBounds(value.control).width = 65
      },
      "bounds disagree",
    ],
    [
      "incomplete mappings",
      (value) => {
        requireValue(requireValue(value.mapping.cases[0]).parts[1]).properties.pop()
      },
      "complete exact",
    ],
    [
      "duplicate mappings",
      (value) => {
        const facts = requireValue(requireValue(value.mapping.cases[0]).parts[1]).properties
        facts[3] = requireValue(facts[0])
      },
      "complete exact",
    ],
    [
      "wrong source property",
      (value) => {
        requireValue(
          requireValue(requireValue(value.mapping.cases[0]).parts[1]).properties[1],
        ).sourceProperty = "paddingTop"
      },
      "complete exact",
    ],
    [
      "nonzero tolerance",
      (value) => {
        requireValue(
          requireValue(requireValue(value.mapping.cases[0]).parts[1]).properties[0],
        ).tolerance = 1
      },
      "complete exact",
    ],
    [
      "missing variable",
      (value) => {
        value.snapshot.variables = value.snapshot.variables.filter(
          (variable) => variable.id !== "primary",
        )
      },
      "Missing variable dependency",
    ],
    [
      "alias cycle",
      (value) => {
        requireValue(
          requireValue(value.snapshot.variables.find((variable) => variable.id === "primary"))
            .rawValuesByMode,
        ).blue = { type: "VARIABLE_ALIAS", id: "focus" }
      },
      "Variable alias cycle",
    ],
    [
      "unknown selected mode",
      (value) => {
        requireValue(value.mapping.cases[0]).collectionModes.semantic = "absent"
      },
      "Unknown mode",
    ],
  ]
  it.each(failures)("fails closed for %s", (_label, mutate, diagnostic) =>
    withFixture((value) => {
      mutate(value)
      const first = requireValue(value.compile()[0])
      expect(
        first.unsupported.some((reason) => reason.includes(diagnostic)),
        JSON.stringify(first.unsupported),
      ).toBe(true)
      // No invalid projection can contribute misleading partial expectations.
      expect(first.expectations.filter((row) => row.part === "standard-focus")).toEqual([])
    }),
  )
  it("keeps selected-control explicit modes out of independent source capture context", () =>
    withFixture((value) => {
      value.selected.explicitVariableModes = { semantic: "dark" }
      const first = requireValue(value.compile()[0])
      expect(first.unsupported.some((reason) => reason.includes("Captured literal"))).toBe(false)
      expect(
        requireValue(first.expectations.find((row) => row.property === "outlineColor")).expected,
      ).toBe("rgba(47, 49, 252, 1)")
      expect(first.unsupported.some((reason) => reason.includes("Conflicting selected mode"))).toBe(
        true,
      )
    }))
})

function paintFixture(value: ReturnType<typeof fixture>) {
  value.standard.cornerRadius = 6
  value.ring.cornerRadius = 4
  requireValue(value.standard.boundVariables).rectangleCornerRadii = {
    type: "VARIABLE_ALIAS",
    id: "radius-6",
  }
  value.snapshot.variables.push({
    id: "radius-6",
    collectionId: "spacing",
    rawValuesByMode: { standard: 6 },
  })
  requireValue(value.ring.boundVariables).rectangleCornerRadii = Object.fromEntries(
    [
      "RECTANGLE_TOP_LEFT_CORNER_RADIUS",
      "RECTANGLE_TOP_RIGHT_CORNER_RADIUS",
      "RECTANGLE_BOTTOM_LEFT_CORNER_RADIUS",
      "RECTANGLE_BOTTOM_RIGHT_CORNER_RADIUS",
    ].map((corner) => [corner, { type: "VARIABLE_ALIAS" as const, id: "space-4" }]),
  )
  for (const entry of value.mapping.cases) {
    const part = requireValue(entry.parts.find((part) => part.part === "standard-focus"))
    part.nodeId = "standard"
    part.selector = "button::after"
    part.sourceProjection = "focus-ring-paint/v1"
    part.properties = [
      { property: "borderWidth", sourceProperty: "strokeWeight", tolerance: 0 },
      { property: "borderColor", sourceProperty: "strokes.0.color", tolerance: 0 },
      { property: "borderStyle", sourceProperty: "strokes.0.type", tolerance: 0 },
      { property: "borderRadius", sourceProperty: "cornerRadius", tolerance: 0 },
      { property: "width", sourceProperty: "absoluteBoundingBox.width", tolerance: 0 },
      { property: "height", sourceProperty: "absoluteBoundingBox.height", tolerance: 0 },
      { property: "left", sourceProperty: "absoluteBoundingBox.x", tolerance: 0 },
      { property: "top", sourceProperty: "absoluteBoundingBox.y", tolerance: 0 },
      { property: "boxSizing", sourceProperty: "strokeAlign", tolerance: 0 },
    ]
  }
}
function paintPart(value: ReturnType<typeof fixture>) {
  return requireValue(
    requireValue(value.mapping.cases[0]).parts.find((part) => part.part === "standard-focus"),
  )
}

describe("source-faithful Standard focus ring paint", () => {
  it("compiles nine independent border-box facts, both colors and composite coordinate provenance", () =>
    withFixture((value) => {
      paintFixture(value)
      for (const entry of value.compile()) {
        expect(entry.unsupported).toEqual([])
        const rows = entry.expectations.filter((row) => row.part === "standard-focus")
        expect(Object.fromEntries(rows.map((row) => [row.property, row.expected]))).toEqual({
          borderWidth: 2,
          borderColor: entry.mode === "light" ? "rgba(47, 49, 252, 1)" : "rgba(171, 171, 253, 1)",
          borderStyle: "solid",
          borderRadius: 6,
          width: 78,
          height: 52,
          left: -6,
          top: -6,
          boxSizing: "border-box",
        })
        expect(
          rows.every((row) => row.selector === "button::after" && row.source.nodeId === "standard"),
        ).toBe(true)
        for (const axis of ["left", "top"]) {
          const row = requireValue(rows.find((row) => row.property === axis))
          const coordinate = axis === "left" ? "x" : "y"
          expect(row.source.propertyPath).toBe(
            `absoluteBoundingBox.${coordinate} - children.0.children.0.absoluteBoundingBox.${coordinate}`,
          )
          expect(row.comparison).toBe("numeric")
        }
        expect(
          requireValue(rows.find((row) => row.property === "borderRadius")).source.aliasChain,
        ).toEqual(["radius-6"])
        expect(
          requireValue(rows.find((row) => row.property === "borderColor")).source.aliasChain,
        ).toEqual(
          entry.mode === "light" ? ["focus", "primary"] : ["focus", "light-primary", "blue-200"],
        )
      }
    }))

  it("derives offsets independently of the source's absolute canvas placement", () =>
    withFixture((value) => {
      paintFixture(value)
      for (const node of [value.standard, value.ring, value.control]) {
        const rect = sourceBounds(node)
        rect.x = Number(rect.x) - 11917
        rect.y = Number(rect.y) - 1909
      }
      for (const entry of value.compile()) {
        expect(entry.unsupported).toEqual([])
        expect(
          entry.expectations
            .filter((row) => row.property === "left" || row.property === "top")
            .map((row) => row.expected),
        ).toEqual([-6, -6])
      }
    }))

  const failures: [string, (value: ReturnType<typeof fixture>) => void, string][] = [
    [
      "non-root projection",
      (value) => {
        paintPart(value).nodeId = "ring"
      },
      "Standard root and complete exact",
    ],
    [
      "incomplete map",
      (value) => {
        paintPart(value).properties.pop()
      },
      "complete exact nine-property",
    ],
    [
      "wrong width mapping",
      (value) => {
        requireValue(
          paintPart(value).properties.find((fact) => fact.property === "width"),
        ).sourceProperty = "size.x"
      },
      "complete exact nine-property",
    ],
    [
      "nonzero tolerance",
      (value) => {
        requireValue(paintPart(value).properties[0]).tolerance = 1
      },
      "complete exact nine-property",
    ],
    [
      "wrong border alignment",
      (value) => {
        value.standard.strokeAlign = "OUTSIDE"
      },
      "SOLID INSIDE stroke",
    ],
    [
      "wrong border width",
      (value) => {
        value.standard.strokeWeight = 1
      },
      "strokes disagree",
    ],
    [
      "wrong clear gap",
      (value) => {
        value.ring.paddingLeft = 3
        Reflect.deleteProperty(requireValue(value.ring.boundVariables), "paddingLeft")
      },
      "symmetric source padding",
    ],
    [
      "wrong outer corner",
      (value) => {
        value.standard.cornerRadius = 5
        Reflect.deleteProperty(requireValue(value.standard.boundVariables), "rectangleCornerRadii")
      },
      "corners do not coincide",
    ],
    [
      "wrong inner corner",
      (value) => {
        value.ring.cornerRadius = 5
        Reflect.deleteProperty(requireValue(value.ring.boundVariables), "rectangleCornerRadii")
      },
      "corners do not coincide",
    ],
    [
      "mixed literal corners",
      (value) => {
        value.standard.rectangleCornerRadii = [6, 6, 5, 6]
      },
      "mixed source radii",
    ],
    [
      "mixed alias corners",
      (value) => {
        requireValue(value.ring.boundVariables).rectangleCornerRadii = {
          RECTANGLE_TOP_LEFT_CORNER_RADIUS: { type: "VARIABLE_ALIAS", id: "space-4" },
          RECTANGLE_TOP_RIGHT_CORNER_RADIUS: { type: "VARIABLE_ALIAS", id: "space-2" },
          RECTANGLE_BOTTOM_LEFT_CORNER_RADIUS: { type: "VARIABLE_ALIAS", id: "space-4" },
          RECTANGLE_BOTTOM_RIGHT_CORNER_RADIUS: { type: "VARIABLE_ALIAS", id: "space-4" },
        }
      },
      "mixed radius bindings",
    ],
    [
      "incomplete corner aliases",
      (value) => {
        requireValue(value.ring.boundVariables).rectangleCornerRadii = {
          RECTANGLE_TOP_LEFT_CORNER_RADIUS: { type: "VARIABLE_ALIAS", id: "space-4" },
        }
      },
      "complete uniform radius bindings",
    ],
    [
      "clamped corner",
      (value) => {
        value.standard.cornerRadius = 100
        Reflect.deleteProperty(requireValue(value.standard.boundVariables), "rectangleCornerRadii")
      },
      "unclamped nonnegative",
    ],
    [
      "smoothing",
      (value) => {
        value.standard.cornerSmoothing = 0.5
      },
      "Unsupported focus outline",
    ],
    [
      "shifted control",
      (value) => {
        value.control.relativeTransform = [
          [1, 0, 5],
          [0, 1, 4],
        ]
      },
      "bounds disagree",
    ],
    [
      "painted gap",
      (value) => {
        value.ring.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
      },
      "cannot paint a background",
    ],
  ]
  it.each(failures)("rejects %s without partial paint expectations", (_label, mutate, diagnostic) =>
    withFixture((value) => {
      paintFixture(value)
      mutate(value)
      const entry = requireValue(value.compile()[0])
      expect(
        entry.unsupported.some((reason) => reason.includes(diagnostic)),
        JSON.stringify(entry.unsupported),
      ).toBe(true)
      expect(entry.expectations.filter((row) => row.part === "standard-focus")).toEqual([])
    }),
  )
})
