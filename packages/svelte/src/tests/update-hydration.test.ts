/**
 * Svelte adapter: wires the shared update and hydration contracts for Input, Select and TabGroup.
 */
import "@testing-library/jest-dom/vitest"
import { fireEvent, render, screen } from "@testing-library/svelte"
import { afterEach } from "vitest"
import { runInputUpdatesContract } from "../../../../tests/contracts/input-updates.contract"
import { runSelectUpdatesContract } from "../../../../tests/contracts/select-updates.contract"
import { runTabUpdatesContract } from "../../../../tests/contracts/tab-updates.contract"
import Input from "../lib/components/input/Input.svelte"
import Select from "../lib/components/input/Select.svelte"
import { unmountHydratedApps } from "./support/hydrate-from-server"
import {
  type SvelteComponent,
  createUpdateHydrationHarness,
} from "./support/update-hydration-harness"
import TabGroupContractFixture from "./type-fixtures/TabGroupContractFixture.svelte"

afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})

runInputUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: Input as SvelteComponent,
    componentPath: "/src/lib/components/input/Input.svelte",
    toSvelteProps: ({ onValueChange, ...props }) => ({
      ...props,
      ...(onValueChange
        ? {
            oninput: (event: Event & { currentTarget: HTMLInputElement }) =>
              onValueChange(event.currentTarget.value),
          }
        : {}),
    }),
  }),
  getTextbox: () => screen.getByRole("textbox") as HTMLInputElement,
  async type(element, text) {
    const input = element as HTMLInputElement
    if (input.disabled || input.readOnly) return

    for (const character of text) {
      input.value += character
      await fireEvent.input(input)
    }
  },
})

runSelectUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: Select as SvelteComponent,
    componentPath: "/src/lib/components/input/Select.svelte",
    toSvelteProps: ({ onValueChange, ...props }) => ({
      ...props,
      ...(onValueChange ? { onvaluechange: onValueChange } : {}),
    }),
  }),
  getSelect: () => screen.getByRole("combobox") as HTMLSelectElement,
  async selectOption(element, value) {
    const select = element as HTMLSelectElement
    if (select.disabled) return

    select.value = value
    await fireEvent.change(select)
  },
})

runTabUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: TabGroupContractFixture as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/TabGroupContractFixture.svelte",
    toSvelteProps: ({ onActiveTabChange, ...props }) => ({
      ...props,
      ...(onActiveTabChange ? { onactivetabchange: onActiveTabChange } : {}),
    }),
  }),
  getTab: (name) => screen.getByRole("tab", { name }),
  getAllTabs: () => screen.getAllByRole("tab"),
  getVisiblePanels: () => screen.queryAllByRole("tabpanel"),
  async click(element) {
    element.focus()
    await fireEvent.click(element)
  },
  async keyboard(text) {
    const key = text.replace(/[{}]/g, "")
    await fireEvent.keyDown(document.activeElement ?? document.body, { key })
  },
})
