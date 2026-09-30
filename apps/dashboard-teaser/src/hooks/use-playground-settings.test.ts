// @vitest-environment jsdom

import { ThemeMode } from "@marwes-ui/react"
import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { usePlaygroundSettings } from "./use-playground-settings"

afterEach(() => {
  cleanup()
  delete document.documentElement.dataset.marwesMode
  document.documentElement.classList.remove("dark", "light")
  document.documentElement.style.colorScheme = ""
  vi.unstubAllGlobals()
})

describe("shared site theme", () => {
  it("keeps the docs prepaint mode on home and persists the next selection", () => {
    document.documentElement.dataset.marwesMode = "dark"
    const setItem = vi.fn()
    vi.stubGlobal("localStorage", { setItem })
    const { result } = renderHook(usePlaygroundSettings)

    expect(result.current.settings.mode).toBe(ThemeMode.dark)
    act(() => result.current.toggleTheme())

    expect(result.current.settings.mode).toBe(ThemeMode.light)
    expect(setItem).toHaveBeenLastCalledWith("marwes-site-theme", "light")
    expect(document.documentElement.dataset.marwesMode).toBe("light")
  })

  it("keeps theme switching usable when the browser denies storage", () => {
    vi.stubGlobal("localStorage", {
      setItem: () => {
        throw new Error("Storage denied")
      },
    })
    const { result } = renderHook(usePlaygroundSettings)
    act(() => result.current.toggleTheme())

    expect(result.current.settings.mode).toBe(ThemeMode.dark)
    expect(document.documentElement.style.colorScheme).toBe("dark")
  })
})
