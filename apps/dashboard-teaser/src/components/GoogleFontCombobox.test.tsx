// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"
import { MarwesProvider } from "@marwes-ui/react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider as StyledThemeProvider } from "styled-components"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { GoogleFontCombobox } from "./GoogleFontCombobox"

function renderCombobox(onSelect = vi.fn()): void {
  render(
    <MarwesProvider>
      {(theme) => (
        <StyledThemeProvider theme={theme}>
          <GoogleFontCombobox value="Instrument Sans" onSelect={onSelect} />
        </StyledThemeProvider>
      )}
    </MarwesProvider>,
  )
}

function getActiveOption(input: HTMLElement): HTMLElement {
  const id = input.getAttribute("aria-activedescendant")
  if (!id) throw new Error("combobox has no active descendant")
  const option = document.getElementById(id)
  if (!option) throw new Error(`active option ${id} is not rendered`)
  return option
}

describe("GoogleFontCombobox", () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("renders a bounded first batch outside the tab order", () => {
    renderCombobox()

    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(80)
    expect(options.every((option) => option.getAttribute("tabindex") === "-1")).toBe(true)
    expect(options[0]).toHaveAttribute("aria-setsize", "1949")
  })

  it("searches the complete registry even when the target is outside the first batch", async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    renderCombobox(onSelect)

    const input = screen.getByRole("combobox", { name: "Font family" })
    await user.type(input, "Playwrite HR Guides")

    expect(screen.getByRole("option", { name: "Playwrite HR Guides" })).toBeInTheDocument()
    await user.keyboard("{Enter}")
    expect(onSelect).toHaveBeenCalledWith("Playwrite HR Guides")
  })

  it("appends one batch when scrolling near the list end", () => {
    renderCombobox()
    const listbox = screen.getByRole("listbox")
    Object.defineProperties(listbox, {
      scrollHeight: { configurable: true, value: 1_000 },
      scrollTop: { configurable: true, value: 650 },
      clientHeight: { configurable: true, value: 200 },
    })

    fireEvent.scroll(listbox)

    expect(screen.getAllByRole("option")).toHaveLength(160)
  })

  it("keeps keyboard active descendants rendered across Home and End", async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    renderCombobox(onSelect)
    const input = screen.getByRole("combobox", { name: "Font family" })

    await user.click(input)
    await user.keyboard("{End}")
    expect(getActiveOption(input)).toHaveTextContent("Playwrite HR Guides")

    await user.keyboard("{Enter}{Home}")
    expect(onSelect).toHaveBeenCalledWith("Playwrite HR Guides")
    expect(getActiveOption(input)).toHaveTextContent("Inter")

    await user.type(input, "a")
    expect(screen.getAllByRole("option")).toHaveLength(80)
    expect(getActiveOption(input)).toBeInTheDocument()

    await user.clear(input)
    expect(screen.getAllByRole("option")).toHaveLength(80)
    expect(getActiveOption(input)).toHaveTextContent("Inter")
  })

  it("keeps input focus when an option is selected with a pointer", async () => {
    const user = userEvent.setup()
    renderCombobox()
    const input = screen.getByRole("combobox", { name: "Font family" })

    await user.click(input)
    await user.click(screen.getByRole("option", { name: "Inter" }))

    expect(input).toHaveFocus()
  })

  it("omits active descendant and ignores navigation when there are no results", async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    renderCombobox(onSelect)
    const input = screen.getByRole("combobox", { name: "Font family" })

    await user.type(input, "font-that-does-not-exist")
    expect(screen.queryAllByRole("option")).toHaveLength(0)
    expect(input).not.toHaveAttribute("aria-activedescendant")

    await user.keyboard("{ArrowDown}{End}{Enter}")
    expect(onSelect).not.toHaveBeenCalled()
    expect(input).not.toHaveAttribute("aria-activedescendant")
  })
})
