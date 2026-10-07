/**
 * React adapter: MarwesProvider behavior shared contract harness — proves cross-adapter parity.
 */
import { act, render } from "@testing-library/react"
import type { ProviderBehaviorProps } from "../../../../../tests/contracts/provider-behavior.contract"
import { runProviderBehaviorContract } from "../../../../../tests/contracts/provider-behavior.contract"
import { MarwesProvider } from "../marwes-provider"
import { useThemeMode } from "../use-theme-mode"

function ProviderStateConsumer() {
  const { mode, preference, systemMode, isSystem, setPreference, setMode, toggleMode } =
    useThemeMode()

  return (
    <>
      <output data-provider-state>
        {mode}:{preference}:{systemMode}:{isSystem ? "system" : "concrete"}
      </output>
      <button
        type="button"
        data-provider-action="set-preference-system"
        onClick={() => setPreference("system")}
      />
      <button
        type="button"
        data-provider-action="set-preference-dark"
        onClick={() => setPreference("dark")}
      />
      <button type="button" data-provider-action="set-mode-dark" onClick={() => setMode("dark")} />
      <button type="button" data-provider-action="toggle-mode" onClick={toggleMode} />
    </>
  )
}

let renderedProvider: ReturnType<typeof render> | undefined

function providerElement(props: ProviderBehaviorProps) {
  return (
    <MarwesProvider {...props}>
      <ProviderStateConsumer />
    </MarwesProvider>
  )
}

runProviderBehaviorContract("react", {
  renderProvider(props) {
    renderedProvider = render(providerElement(props))
  },
  rerenderProvider(props) {
    renderedProvider?.rerender(providerElement(props))
  },
  unmountProvider() {
    renderedProvider?.unmount()
    renderedProvider = undefined
  },
  applyChange(change) {
    act(() => {
      change()
    })
  },
})
