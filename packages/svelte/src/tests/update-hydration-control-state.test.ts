import { normalizeRichTextHtml } from "@marwes-ui/core"
import userEvent from "@testing-library/user-event"
import {
  type CheckboxGroupUpdatesProps,
  runCheckboxGroupUpdatesContract,
} from "../../../../tests/contracts/checkbox-group-updates.contract"
import {
  type DatePickerUpdatesProps,
  runDatePickerUpdatesContract,
} from "../../../../tests/contracts/date-picker-updates.contract"
import CheckboxHost from "./type-fixtures/CheckboxGroupStateHost.svelte"
import DatePickerHost from "./type-fixtures/DatePickerStateHost.svelte"
import "@testing-library/jest-dom/vitest"
import { fireEvent, screen } from "@testing-library/svelte"
import { afterEach } from "vitest"
import {
  type TextValueUpdatesProps,
  runTextValueUpdatesContract,
} from "../../../../tests/contracts/text-value-updates.contract"
import { unmountHydratedApps } from "./support/hydrate-from-server"
import { createUpdateHydrationHarness } from "./support/update-hydration-harness"
import Host from "./type-fixtures/HydrationComponentHost.svelte"
afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})
for (const name of ["InputOtpField", "RichTextField"] as const) {
  runTextValueUpdatesContract(
    "svelte",
    name,
    {
      ...createUpdateHydrationHarness<TextValueUpdatesProps>({
        component: Host,
        componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
        toSvelteProps: ({ onValueChange, ...props }) => ({
          componentName: name,
          componentProps: {
            label: "Notes",
            [name === "RichTextField" ? "editor" : "inputOtp"]: {
              ...props,
              onvaluechange: onValueChange,
            },
          },
        }),
      }),
      getControl: () => screen.getByRole("textbox", { name: "Notes" }),
      getValue: () =>
        name === "RichTextField"
          ? normalizeRichTextHtml(screen.getByRole("textbox", { name: "Notes" }).innerHTML)
          : (screen.getByRole("textbox", { name: "Notes" }) as HTMLInputElement).value,
      async blur() {
        if (name === "RichTextField")
          await fireEvent.blur(screen.getByRole("textbox", { name: "Notes" }))
      },
      async setUserValue(value) {
        const control = screen.getByRole("textbox", { name: "Notes" }) as HTMLInputElement
        if (
          control.disabled ||
          control.readOnly ||
          control.getAttribute("contenteditable") === "false"
        )
          return
        if (name === "RichTextField") {
          control.innerHTML = value
          await fireEvent.input(control)
        } else {
          control.value = value
          await fireEvent.input(control)
        }
      },
    },
    name === "RichTextField"
      ? {
          initial: "<p>Server notes</p>",
          updated: "<p>Client notes</p>",
          rawDefault: "<p>Server notes</p>",
        }
      : { initial: "123456", updated: "654321", rawDefault: "ab12 345678" },
  )
}

runCheckboxGroupUpdatesContract("svelte", {
  ...createUpdateHydrationHarness<CheckboxGroupUpdatesProps>({
    component: CheckboxHost,
    componentPath: "/src/tests/type-fixtures/CheckboxGroupStateHost.svelte",
    toSvelteProps: (props) => ({ ...props }),
  }),
  getCheckbox: (label) => screen.getByRole("checkbox", { name: label }) as HTMLInputElement,
  async click(element) {
    await userEvent.setup().click(element)
  },
})
runDatePickerUpdatesContract("svelte", {
  ...createUpdateHydrationHarness<DatePickerUpdatesProps>({
    component: DatePickerHost,
    componentPath: "/src/tests/type-fixtures/DatePickerStateHost.svelte",
    toSvelteProps: (props) => ({ ...props }),
  }),
  getDay: (date) => screen.getByRole("button", { name: date }),
  getNextMonth: () => screen.getByRole("button", { name: "Next month" }),
  getCalendar: () => screen.getByRole("table"),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
