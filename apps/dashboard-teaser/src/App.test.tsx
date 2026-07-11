// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { App } from "./App"

describe("dashboard custom builder flow", () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn()
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(performance.now()), 0)
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("opens the controlled Custom builder from the handoff modal", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole("button", { name: "Read more about theming" }))
    expect(screen.getByRole("dialog", { name: "Building your own theme" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Open the Custom preset" }))

    expect(
      screen.queryByRole("dialog", { name: "Building your own theme" }),
    ).not.toBeInTheDocument()
    expect(await screen.findByRole("dialog", { name: /theme builder/i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /Custom/i })).toBeChecked()
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled()

    const primaryInput = screen.getByLabelText("Primary")
    fireEvent.input(primaryInput, { target: { value: "#123456" } })
    expect(primaryInput).toHaveValue("#123456")
    await user.click(screen.getByRole("button", { name: "Confirm" }))

    await user.click(screen.getByRole("button", { name: "Read more about theming" }))
    await user.click(screen.getByRole("button", { name: "Open the Custom preset" }))

    expect(await screen.findByLabelText("Primary")).toHaveValue("#123456")
  })
})
