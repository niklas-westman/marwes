// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { App } from "./App"

const drawerImport = vi.hoisted(() => {
  let release: () => void = () => {}
  const ready = new Promise<void>((resolve) => {
    release = resolve
  })
  return { ready, release }
})

// Hold the lazy module pending so the handoff cannot depend on import speed.
vi.mock("./components/ThemeBuilderDrawer", async (importOriginal) => {
  await drawerImport.ready
  return importOriginal<typeof import("./components/ThemeBuilderDrawer")>()
})

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

    const themingButton = screen.getByRole("button", { name: "Read more about theming" })
    await user.click(themingButton)
    const handoffModal = screen.getByRole("dialog", { name: "Building your own theme" })
    expect(handoffModal).toBeInTheDocument()

    await user.click(within(handoffModal).getByRole("button", { name: "Open the Custom preset" }))

    expect(
      screen.queryByRole("dialog", { name: "Building your own theme" }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole("dialog", { name: /theme builder/i })).not.toBeInTheDocument()
    await act(async () => {
      drawerImport.release()
      await import("./components/ThemeBuilderDrawer")
    })
    const builder = screen.getByRole("dialog", { name: /theme builder/i })
    expect(builder).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /Custom/i })).toBeChecked()
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled()

    const primaryInput = within(builder).getByLabelText("Primary")
    fireEvent.input(primaryInput, { target: { value: "#123456" } })
    expect(primaryInput).toHaveValue("#123456")
    await user.click(within(builder).getByRole("button", { name: "Confirm" }))

    await user.click(themingButton)
    const reopenedModal = screen.getByRole("dialog", { name: "Building your own theme" })
    await user.click(within(reopenedModal).getByRole("button", { name: "Open the Custom preset" }))

    const reopenedBuilder = await screen.findByRole("dialog", { name: /theme builder/i })
    expect(within(reopenedBuilder).getByLabelText("Primary")).toHaveValue("#123456")
  })
})
