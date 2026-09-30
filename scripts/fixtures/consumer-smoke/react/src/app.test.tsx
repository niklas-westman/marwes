import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { App } from "./app"

describe("packed React consumer", () => {
  it("renders the canonical public-API example", () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain("Email")
    expect(html).toContain('data-marwes-theme="true"')
    expect(html).toContain("Save")
  })
})
