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
import { hydrateFromServerMarkup, unmountHydratedApps } from "./support/hydrate-from-server"
import TabGroupContractFixture from "./type-fixtures/TabGroupContractFixture.svelte"

afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})

type SvelteComponent = Parameters<typeof render>[0]

function createHarness<Props extends object>(options: {
  component: SvelteComponent
  componentPath: string
  toSvelteProps: (props: Props) => Record<string, unknown>
}) {
  let rerenderComponent: ((props: Record<string, unknown>) => Promise<void>) | undefined

  return {
    render(props: Props) {
      rerenderComponent = render(options.component, {
        props: options.toSvelteProps(props),
      }).rerender
    },
    async rerender(props: Props) {
      await rerenderComponent?.(options.toSvelteProps(props))
    },
    hydrate(props: Props) {
      const clientProps = options.toSvelteProps(props)
      const serverProps = Object.fromEntries(
        Object.entries(clientProps).filter(([, value]) => typeof value !== "function"),
      )

      return hydrateFromServerMarkup({
        componentPath: options.componentPath,
        component: options.component as never,
        serverProps,
        clientProps,
      })
    },
  }
}

runInputUpdatesContract("svelte", {
  ...createHarness({
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
  ...createHarness({
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
  ...createHarness({
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
