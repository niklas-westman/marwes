import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const segmentedControlCssPath = resolve(pkgDir, "src/firstEdition/segmented-control.css")

describe("firstEdition segmented control css contract", () => {
  it("keeps selected and unselected segment sizing stable during value changes", () => {
    const css = readFileSync(segmentedControlCssPath, "utf8")
    const selectedRule = css.match(/\.mw-segmented-control__item--selected \{(?<body>[\s\S]*?)\}/)

    expect(selectedRule?.groups?.body).toBeDefined()
    expect(selectedRule?.groups?.body).not.toContain("padding")
    expect(css).toContain(
      "transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;",
    )
    expect(css).toContain(
      ".mw-segmented-control__item--selected.mw-segmented-control__item--contrast",
    )
  })
})
