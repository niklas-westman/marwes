// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import { MarwesProvider } from "@marwes-ui/react"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider as StyledThemeProvider } from "styled-components"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ClipboardButton } from "./ClipboardButton"

describe("ClipboardButton", () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("disables while copying and announces success", async () => {
    let resolveCopy: (() => void) | undefined
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCopy = resolve
        }),
    )

    render(
      <MarwesProvider>
        {(theme) => (
          <StyledThemeProvider theme={theme}>
            <ClipboardButton value="pnpm add marwes" label="install command" />
          </StyledThemeProvider>
        )}
      </MarwesProvider>,
    )
    await user.click(screen.getByRole("button", { name: "Copy install command" }))

    expect(screen.getByRole("button", { name: "Copying install command" })).toBeDisabled()
    expect(writeText).toHaveBeenCalledWith("pnpm add marwes")

    resolveCopy?.()
    expect(await screen.findByText("Copied")).toBeVisible()
    expect(screen.getByRole("button", { name: "Copied install command" })).toBeEnabled()
  })

  it("announces a useful fallback when clipboard access fails", async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"))

    render(
      <MarwesProvider>
        {(theme) => (
          <StyledThemeProvider theme={theme}>
            <ClipboardButton value="code" label="example" />
          </StyledThemeProvider>
        )}
      </MarwesProvider>,
    )
    await user.click(screen.getByRole("button", { name: "Copy example" }))

    expect(
      await screen.findByText("Could not copy automatically. Select and copy the text manually."),
    ).toBeVisible()
    expect(screen.getByRole("button", { name: "Copy example" })).toBeEnabled()
  })

  it("resets success feedback when the copied value changes", async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
    const control = (value: string, label: string) => (
      <MarwesProvider>
        {(theme) => (
          <StyledThemeProvider theme={theme}>
            <ClipboardButton value={value} label={label} />
          </StyledThemeProvider>
        )}
      </MarwesProvider>
    )
    const { rerender } = render(control("react code", "react example"))

    await user.click(screen.getByRole("button", { name: "Copy react example" }))
    expect(await screen.findByText("Copied")).toBeVisible()

    rerender(control("vue code", "vue example"))

    expect(await screen.findByRole("button", { name: "Copy vue example" })).toBeEnabled()
    expect(screen.queryByText("Copied")).not.toBeInTheDocument()
  })
})
