/**
 * Shared contract for MarwesProvider behavior — verifies cross-adapter parity for controlled
 * preference precedence, storage persistence and failures, system-theme changes, change callbacks
 * and system subscription cleanup.
 *
 * Each adapter renders MarwesProvider around a consumer built on its own `useThemeMode`, which must
 * render exactly this markup so the contract can stay framework-agnostic:
 *
 *   <output data-provider-state>{mode}:{preference}:{systemMode}:{system|concrete}</output>
 *   <button data-provider-action="set-preference-system" />   setPreference("system")
 *   <button data-provider-action="set-preference-dark" />     setPreference("dark")
 *   <button data-provider-action="set-mode-dark" />           setMode("dark")
 *   <button data-provider-action="toggle-mode" />             toggleMode()
 */
import type { MarwesProviderOptions, ThemeMode, ThemePreference } from "@marwes-ui/core"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

export type ProviderBehaviorProps = Pick<
  MarwesProviderOptions,
  | "theme"
  | "defaultPreference"
  | "preference"
  | "defaultMode"
  | "mode"
  | "storageKey"
  | "enableSystem"
  | "onModeChange"
  | "onPreferenceChange"
>

export interface ProviderBehaviorHarness {
  /** Renders MarwesProvider with the state consumer and flushes mount effects. */
  renderProvider(props: ProviderBehaviorProps): Promise<void> | void
  /** Re-renders the already mounted provider with new props and flushes updates. */
  rerenderProvider(props: ProviderBehaviorProps): Promise<void> | void
  unmountProvider(): Promise<void> | void
  /** Runs a change (a click or a system-theme event), then flushes framework updates. */
  applyChange(change: () => void): Promise<void> | void
}

type ProviderAction =
  | "set-preference-system"
  | "set-preference-dark"
  | "set-mode-dark"
  | "toggle-mode"

interface ProviderState {
  mode: string
  preference: string
  systemMode: string
  isSystem: boolean
}

const storageKey = "marwes-contract-theme"

const originalMatchMedia = window.matchMedia
const originalLocalStorage = window.localStorage

function installSystemThemeMock(initialMode: ThemeMode) {
  let matches = initialMode === "dark"
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (_event: "change", listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_event: "change", listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    addListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    dispatchEvent: () => true,
  }))

  return {
    get listenerCount() {
      return listeners.size
    },
    emit(nextMode: ThemeMode) {
      matches = nextMode === "dark"
      const event = { matches } as MediaQueryListEvent
      for (const listener of [...listeners]) {
        listener(event)
      }
    },
  }
}

function installLocalStorageMock(initialValues: Record<string, string> = {}) {
  const values = new Map(Object.entries(initialValues))
  const storage = {
    get length() {
      return values.size
    },
    clear: vi.fn(() => {
      values.clear()
    }),
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(values.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => {
      values.delete(key)
    }),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    }),
  } satisfies Storage

  Object.defineProperty(window, "localStorage", { value: storage, configurable: true })
  return storage
}

function installThrowingLocalStorage(): void {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem() {
        throw new Error("storage unavailable")
      },
      setItem() {
        throw new Error("storage unavailable")
      },
    },
    configurable: true,
  })
}

function readProviderState(): ProviderState {
  const output = document.querySelector("[data-provider-state]")
  if (!output) throw new Error("Provider state consumer is not rendered.")

  const [mode = "", preference = "", systemMode = "", selection = ""] = (
    output.textContent ?? ""
  ).split(":")
  return { mode, preference, systemMode, isSystem: selection === "system" }
}

function readRootMode(): string | null {
  return document.querySelector("[data-marwes-theme]")?.getAttribute("data-marwes-mode") ?? null
}

function expectState(mode: ThemeMode, preference: ThemePreference, systemMode: ThemeMode): void {
  expect(readProviderState()).toEqual({
    mode,
    preference,
    systemMode,
    isSystem: preference === "system",
  })
  expect(readRootMode()).toBe(mode)
}

export function runProviderBehaviorContract(
  adapterName: string,
  harness: ProviderBehaviorHarness,
): void {
  async function runAction(action: ProviderAction): Promise<void> {
    const button = document.querySelector<HTMLButtonElement>(`[data-provider-action="${action}"]`)
    if (!button) throw new Error(`Provider action "${action}" is not rendered.`)
    await harness.applyChange(() => button.click())
  }

  describe(`${adapterName} MarwesProvider behavior contract`, () => {
    let system: ReturnType<typeof installSystemThemeMock>

    beforeEach(() => {
      system = installSystemThemeMock("light")
    })

    afterEach(async () => {
      await harness.unmountProvider()
      window.matchMedia = originalMatchMedia
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        configurable: true,
      })
    })

    describe("preference precedence", () => {
      it("lets controlled preference win over concrete mode and theme.mode", async () => {
        system.emit("dark")
        await harness.renderProvider({
          preference: "system",
          mode: "light",
          theme: { mode: "light" },
        })

        expectState("dark", "system", "dark")
      })

      it("lets controlled mode win over theme.mode and defaultMode", async () => {
        await harness.renderProvider({
          mode: "dark",
          theme: { mode: "light" },
          defaultMode: "light",
        })

        expectState("dark", "dark", "light")
      })

      it("lets theme.mode win over the uncontrolled default", async () => {
        await harness.renderProvider({ theme: { mode: "dark" }, defaultPreference: "light" })

        expectState("dark", "dark", "light")
      })

      it("lets defaultPreference win over defaultMode", async () => {
        system.emit("dark")
        await harness.renderProvider({ defaultPreference: "system", defaultMode: "light" })

        expectState("dark", "system", "dark")
      })

      it("keeps a controlled preference fixed but still reports the requested change", async () => {
        const onPreferenceChange = vi.fn()
        await harness.renderProvider({ preference: "light", onPreferenceChange })

        await runAction("set-preference-dark")

        expectState("light", "light", "light")
        expect(onPreferenceChange).toHaveBeenCalledWith("dark")
      })
    })

    describe("storage", () => {
      it("reads the stored preference after mount", async () => {
        installLocalStorageMock({ [storageKey]: "dark" })
        await harness.renderProvider({ storageKey, defaultMode: "light" })

        expectState("dark", "dark", "light")
      })

      it("ignores stored values that are not a theme preference", async () => {
        installLocalStorageMock({ [storageKey]: "purple" })
        await harness.renderProvider({ storageKey, defaultMode: "light" })

        expectState("light", "light", "light")
      })

      it("does not touch storage when storageKey is not set", async () => {
        const storage = installLocalStorageMock({ [storageKey]: "dark" })
        await harness.renderProvider({ defaultMode: "light" })
        await runAction("set-preference-system")

        expect(storage.getItem).not.toHaveBeenCalled()
        expect(storage.setItem).not.toHaveBeenCalled()
        expectState("light", "system", "light")
      })

      it("does not apply the stored preference over a controlled one", async () => {
        installLocalStorageMock({ [storageKey]: "dark" })
        await harness.renderProvider({ storageKey, preference: "light" })

        expectState("light", "light", "light")
      })

      it("re-reads the stored preference when storageKey changes after mount", async () => {
        installLocalStorageMock({ "key-a": "light", "key-b": "dark" })
        await harness.renderProvider({ storageKey: "key-a", defaultMode: "light" })
        expectState("light", "light", "light")

        await harness.rerenderProvider({ storageKey: "key-b", defaultMode: "light" })

        expectState("dark", "dark", "light")
      })

      it("writes the preference when setPreference is called", async () => {
        const storage = installLocalStorageMock()
        await harness.renderProvider({ storageKey })

        await runAction("set-preference-system")

        expect(storage.setItem).toHaveBeenCalledWith(storageKey, "system")
      })

      it("writes the concrete mode when setMode is called", async () => {
        const storage = installLocalStorageMock()
        await harness.renderProvider({ storageKey })

        await runAction("set-mode-dark")

        expect(storage.setItem).toHaveBeenCalledWith(storageKey, "dark")
      })

      it("survives storage read failures", async () => {
        installThrowingLocalStorage()

        await harness.renderProvider({ storageKey, defaultMode: "light" })

        expectState("light", "light", "light")
      })

      it("still applies a preference change when the storage write fails", async () => {
        installThrowingLocalStorage()
        const onPreferenceChange = vi.fn()
        await harness.renderProvider({ storageKey, onPreferenceChange })

        await runAction("set-preference-dark")

        expectState("dark", "dark", "light")
        expect(onPreferenceChange).toHaveBeenCalledWith("dark")
      })
    })

    describe("system theme", () => {
      it("resolves a system preference from matchMedia", async () => {
        system.emit("dark")
        await harness.renderProvider({ defaultPreference: "system" })

        expectState("dark", "system", "dark")
      })

      it("falls back to light when matchMedia is unavailable", async () => {
        Object.defineProperty(window, "matchMedia", {
          value: undefined,
          configurable: true,
          writable: true,
        })

        await harness.renderProvider({ defaultPreference: "system" })

        expectState("light", "system", "light")
      })

      it("follows system changes only while the preference is system", async () => {
        await harness.renderProvider({ defaultPreference: "system" })
        expectState("light", "system", "light")

        await harness.applyChange(() => system.emit("dark"))
        expectState("dark", "system", "dark")

        await runAction("set-preference-dark")
        expectState("dark", "dark", "dark")

        // the provider has unsubscribed, so systemMode keeps its last observed value
        await harness.applyChange(() => system.emit("light"))
        expectState("dark", "dark", "dark")
      })

      it("never reports system as the rendered mode", async () => {
        system.emit("dark")
        await harness.renderProvider({ defaultMode: "light" })

        await runAction("set-preference-system")

        expectState("dark", "system", "dark")
        expect(readProviderState().mode).not.toBe("system")
      })

      it("stays light and ignores system changes when enableSystem is false", async () => {
        system.emit("dark")
        await harness.renderProvider({ defaultPreference: "system", enableSystem: false })
        expectState("light", "system", "light")

        await harness.applyChange(() => system.emit("light"))
        await harness.applyChange(() => system.emit("dark"))
        expectState("light", "system", "light")
      })
    })

    describe("callbacks", () => {
      it("reports both mode and preference when setMode is called", async () => {
        const onModeChange = vi.fn()
        const onPreferenceChange = vi.fn()
        await harness.renderProvider({ onModeChange, onPreferenceChange })

        await runAction("set-mode-dark")

        expect(onModeChange).toHaveBeenCalledExactlyOnceWith("dark")
        expect(onPreferenceChange).toHaveBeenCalledExactlyOnceWith("dark")
        expectState("dark", "dark", "light")
      })

      it("reports only the preference when setPreference selects system", async () => {
        const onModeChange = vi.fn()
        const onPreferenceChange = vi.fn()
        await harness.renderProvider({ onModeChange, onPreferenceChange })

        await runAction("set-preference-system")

        expect(onPreferenceChange).toHaveBeenCalledExactlyOnceWith("system")
        expect(onModeChange).not.toHaveBeenCalled()
      })

      it("toggles between concrete modes and reports each one", async () => {
        const onModeChange = vi.fn()
        await harness.renderProvider({ onModeChange })

        await runAction("toggle-mode")
        expectState("dark", "dark", "light")

        await runAction("toggle-mode")
        expectState("light", "light", "light")
        expect(onModeChange.mock.calls).toEqual([["dark"], ["light"]])
      })

      it("toggles away from the rendered system mode", async () => {
        const onModeChange = vi.fn()
        system.emit("dark")
        await harness.renderProvider({ defaultPreference: "system", onModeChange })

        await runAction("toggle-mode")

        expectState("light", "light", "dark")
        expect(onModeChange).toHaveBeenCalledExactlyOnceWith("light")
      })

      it("does not report changes the provider did not initiate", async () => {
        installLocalStorageMock({ [storageKey]: "dark" })
        const onModeChange = vi.fn()
        const onPreferenceChange = vi.fn()
        await harness.renderProvider({
          storageKey,
          defaultPreference: "system",
          onModeChange,
          onPreferenceChange,
        })

        await harness.applyChange(() => system.emit("dark"))

        expect(onModeChange).not.toHaveBeenCalled()
        expect(onPreferenceChange).not.toHaveBeenCalled()
      })
    })

    describe("system subscription cleanup", () => {
      it("subscribes while the preference is system and releases on unmount", async () => {
        await harness.renderProvider({ defaultPreference: "system" })
        expect(system.listenerCount).toBe(1)

        await harness.unmountProvider()
        expect(system.listenerCount).toBe(0)
      })

      it("releases the subscription when the preference becomes concrete", async () => {
        await harness.renderProvider({ defaultPreference: "system" })
        expect(system.listenerCount).toBe(1)

        await runAction("set-preference-dark")
        expect(system.listenerCount).toBe(0)
      })

      it("resubscribes without leaking when the preference returns to system", async () => {
        await harness.renderProvider({ defaultPreference: "dark" })
        expect(system.listenerCount).toBe(0)

        await runAction("set-preference-system")
        expect(system.listenerCount).toBe(1)

        await runAction("set-preference-dark")
        await runAction("set-preference-system")
        expect(system.listenerCount).toBe(1)
      })

      it("never subscribes when system detection is disabled", async () => {
        await harness.renderProvider({ defaultPreference: "system", enableSystem: false })

        expect(system.listenerCount).toBe(0)
      })
    })
  })
}
