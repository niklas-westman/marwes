import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const cssPath = resolve(
  fileURLToPath(new URL("..", import.meta.url)),
  "src/firstEdition/styles.css",
)

describe("firstEdition styles.css", () => {
  it("aggregates component styles via imports", () => {
    const css = readFileSync(cssPath, "utf8")

    expect(css).toContain('@import "./button.css";')
    expect(css).toContain('@import "./input.css";')
    expect(css).toContain('@import "./icon.css";')
    expect(css).toContain('@import "./checkbox.css";')
    expect(css).toContain('@import "./divider.css";')
    expect(css).toContain('@import "./typography.css";')
    expect(css).toContain('@import "./molecules/checkbox-field.css";')
    expect(css).toContain('@import "./molecules/input-field.css";')
  })
})
