import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Badge } from "../badge"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Badge (Atom)", () => {
  it("renders a span with recipe class for given variant", () => {
    renderWithProvider(<Badge variant="info">Info</Badge>)

    const badge = screen.getByText("Info")
    expect(badge.tagName).toBe("SPAN")
    expect(badge.className).toContain("mw-badge")
    expect(badge.className).toContain("mw-badge--info")
  })

  it("defaults to neutral variant", () => {
    renderWithProvider(<Badge>Default</Badge>)

    const badge = screen.getByText("Default")
    expect(badge.className).toContain("mw-badge--neutral")
  })

  it("sets aria-label when ariaLabel is provided", () => {
    renderWithProvider(<Badge ariaLabel="3 notifications">3</Badge>)

    const badge = screen.getByText("3")
    expect(badge.getAttribute("aria-label")).toBe("3 notifications")
  })

  it("does not set aria-label when ariaLabel is omitted", () => {
    renderWithProvider(<Badge>OK</Badge>)

    const badge = screen.getByText("OK")
    expect(badge.getAttribute("aria-label")).toBeNull()
  })

  it("merges custom className with recipe class", () => {
    renderWithProvider(<Badge className="custom">Tag</Badge>)

    const badge = screen.getByText("Tag")
    expect(badge.className).toContain("mw-badge")
    expect(badge.className).toContain("custom")
  })

  it("passes id to the rendered span", () => {
    renderWithProvider(<Badge id="test-badge">Tag</Badge>)

    const badge = screen.getByText("Tag")
    expect(badge.id).toBe("test-badge")
  })
})
