/**
 * Svelte adapter: wires the shared field wiring contract for the single-control field wrappers.
 */
import "@testing-library/jest-dom/vitest"
import { screen } from "@testing-library/svelte"
import { afterEach } from "vitest"
import { runFieldWiringUpdatesContract } from "../../../../tests/contracts/field-wiring-updates.contract"
import { unmountHydratedApps } from "./support/hydrate-from-server"
import {
  type SvelteComponent,
  createUpdateHydrationHarness,
} from "./support/update-hydration-harness"
import CheckboxFieldContractFixture from "./type-fixtures/CheckboxFieldContractFixture.svelte"
import InputFieldContractFixture from "./type-fixtures/InputFieldContractFixture.svelte"
import SliderFieldContractFixture from "./type-fixtures/SliderFieldContractFixture.svelte"
import SwitchFieldContractFixture from "./type-fixtures/SwitchFieldContractFixture.svelte"
import TextareaFieldContractFixture from "./type-fixtures/TextareaFieldContractFixture.svelte"

afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})

function fieldHarness(options: {
  component: unknown
  fixtureName: string
  helperKey: "helperText" | "description"
  nestedKey?: string
}) {
  return createUpdateHydrationHarness({
    component: options.component as SvelteComponent,
    componentPath: `/src/tests/type-fixtures/${options.fixtureName}.svelte`,
    toSvelteProps: ({ helper, ...props }: { helper?: string } & object) => ({
      ...props,
      ...(options.nestedKey ? { [options.nestedKey]: {} } : {}),
      ...(helper ? { [options.helperKey]: helper } : {}),
    }),
  })
}

runFieldWiringUpdatesContract("svelte", "InputField", {
  ...fieldHarness({
    component: InputFieldContractFixture,
    fixtureName: "InputFieldContractFixture",
    helperKey: "helperText",
    nestedKey: "input",
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
  marksErrorAsInvalid: true,
})

runFieldWiringUpdatesContract("svelte", "TextareaField", {
  ...fieldHarness({
    component: TextareaFieldContractFixture,
    fixtureName: "TextareaFieldContractFixture",
    helperKey: "helperText",
    nestedKey: "textarea",
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
  marksErrorAsInvalid: true,
})

runFieldWiringUpdatesContract("svelte", "CheckboxField", {
  ...fieldHarness({
    component: CheckboxFieldContractFixture,
    fixtureName: "CheckboxFieldContractFixture",
    helperKey: "description",
  }),
  getControl: (label) => screen.getByRole("checkbox", { name: label }),
  marksErrorAsInvalid: true,
})

runFieldWiringUpdatesContract("svelte", "SwitchField", {
  ...fieldHarness({
    component: SwitchFieldContractFixture,
    fixtureName: "SwitchFieldContractFixture",
    helperKey: "description",
    nestedKey: "switch",
  }),
  getControl: (label) => screen.getByRole("switch", { name: label }),
  marksErrorAsInvalid: false,
})

runFieldWiringUpdatesContract("svelte", "SliderField", {
  ...fieldHarness({
    component: SliderFieldContractFixture,
    fixtureName: "SliderFieldContractFixture",
    helperKey: "description",
    nestedKey: "slider",
  }),
  getControl: (label) => screen.getByRole("slider", { name: label }),
  marksErrorAsInvalid: true,
})
