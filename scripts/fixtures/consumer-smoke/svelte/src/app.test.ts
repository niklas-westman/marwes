import { render } from "svelte/server"
import { describe, expect, it } from "vitest"
import App from "./app.svelte"

describe("packed Svelte consumer", () => {
  it("renders the canonical public-API example", () => {
    const { body } = render(App)
    expect(body).toContain("Email")
    expect(body).toContain('data-marwes-theme="true"')
    expect(body).toContain("Save")
  })
})
