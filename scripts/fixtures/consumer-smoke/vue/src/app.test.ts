import { renderToString } from "@vue/server-renderer"
import { describe, expect, it } from "vitest"
import { createSSRApp } from "vue"
import App from "./app.vue"

describe("packed Vue consumer", () => {
  it("renders the canonical public-API example", async () => {
    const html = await renderToString(createSSRApp(App))
    expect(html).toContain("Email")
    expect(html).toContain('data-marwes-theme="true"')
    expect(html).toContain("Save")
  })
})
