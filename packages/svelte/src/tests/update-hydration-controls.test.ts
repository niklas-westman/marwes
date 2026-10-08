/**
 * Svelte adapter: wires the shared update and hydration contracts for the Tier 1 controls.
 */
import "@testing-library/jest-dom/vitest"
import { fireEvent, screen } from "@testing-library/svelte"
import { afterEach } from "vitest"
import { runAccordionFieldUpdatesContract } from "../../../../tests/contracts/accordion-field-updates.contract"
import { runPaginationUpdatesContract } from "../../../../tests/contracts/pagination-updates.contract"
import { runRadioGroupUpdatesContract } from "../../../../tests/contracts/radio-group-updates.contract"
import { runSegmentedControlUpdatesContract } from "../../../../tests/contracts/segmented-control-updates.contract"
import { runSliderUpdatesContract } from "../../../../tests/contracts/slider-updates.contract"
import { runTextareaUpdatesContract } from "../../../../tests/contracts/textarea-updates.contract"
import { runToggleUpdatesContract } from "../../../../tests/contracts/toggle-updates.contract"
import Checkbox from "../lib/components/checkbox/Checkbox.svelte"
import Textarea from "../lib/components/input/Textarea.svelte"
import Pagination from "../lib/components/pagination/Pagination.svelte"
import SegmentedControl from "../lib/components/segmented-control/SegmentedControl.svelte"
import Slider from "../lib/components/slider/Slider.svelte"
import Switch from "../lib/components/switch/Switch.svelte"
import { unmountHydratedApps } from "./support/hydrate-from-server"
import {
  type SvelteComponent,
  createUpdateHydrationHarness,
} from "./support/update-hydration-harness"
import AccordionFieldHost from "./type-fixtures/AccordionFieldHost.svelte"
import RadioGroupFieldContractFixture from "./type-fixtures/RadioGroupFieldContractFixture.svelte"

afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})

function toSvelteToggleProps({
  onCheckedChange,
  ...props
}: { onCheckedChange?: (checked: boolean) => void } & object): Record<string, unknown> {
  return { ...props, ...(onCheckedChange ? { oncheckedchange: onCheckedChange } : {}) }
}

runToggleUpdatesContract("svelte", "Checkbox", {
  ...createUpdateHydrationHarness({
    component: Checkbox as SvelteComponent,
    componentPath: "/src/lib/components/checkbox/Checkbox.svelte",
    toSvelteProps: toSvelteToggleProps,
  }),
  getControl: () => screen.getByRole("checkbox"),
  isChecked: (control) => (control as HTMLInputElement).checked,
  async click(element) {
    if ((element as HTMLInputElement).disabled) return

    await fireEvent.click(element)
  },
})

runToggleUpdatesContract("svelte", "Switch", {
  ...createUpdateHydrationHarness({
    component: Switch as SvelteComponent,
    componentPath: "/src/lib/components/switch/Switch.svelte",
    toSvelteProps: toSvelteToggleProps,
  }),
  getControl: () => screen.getByRole("switch"),
  isChecked: (control) => control.getAttribute("aria-checked") === "true",
  async click(element) {
    if ((element as HTMLButtonElement).disabled) return

    await fireEvent.click(element)
  },
})

runSegmentedControlUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: SegmentedControl as SvelteComponent,
    componentPath: "/src/lib/components/segmented-control/SegmentedControl.svelte",
    toSvelteProps: ({ onValueChange, ...props }) => ({
      ...props,
      ...(onValueChange ? { onvaluechange: onValueChange } : {}),
    }),
  }),
  getItem: (label) => screen.getByRole("radio", { name: label }),
  getAllItems: () => screen.getAllByRole("radio"),
  isSelected: (item) => item.getAttribute("aria-checked") === "true",
  async click(element) {
    if ((element as HTMLButtonElement).disabled) return

    await fireEvent.click(element)
  },
})

runSliderUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: Slider as SvelteComponent,
    componentPath: "/src/lib/components/slider/Slider.svelte",
    toSvelteProps: ({ onValueChange, ...props }) => ({
      ...props,
      ...(onValueChange ? { onvaluechange: onValueChange } : {}),
    }),
  }),
  getSlider: () => screen.getByRole("slider") as HTMLInputElement,
  async setValue(slider, value) {
    if (slider.disabled) return

    slider.value = String(value)
    await fireEvent.input(slider)
  },
})

runTextareaUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: Textarea as SvelteComponent,
    componentPath: "/src/lib/components/input/Textarea.svelte",
    toSvelteProps: ({ onValueChange, ...props }) => ({
      ...props,
      ...(onValueChange
        ? {
            oninput: (event: Event & { currentTarget: HTMLTextAreaElement }) =>
              onValueChange(event.currentTarget.value),
          }
        : {}),
    }),
  }),
  getTextbox: () => screen.getByRole("textbox") as HTMLTextAreaElement,
  async type(element, text) {
    const textarea = element as HTMLTextAreaElement
    if (textarea.disabled || textarea.readOnly) return

    for (const character of text) {
      textarea.value += character
      await fireEvent.input(textarea)
    }
  },
})

runPaginationUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: Pagination as SvelteComponent,
    componentPath: "/src/lib/components/pagination/Pagination.svelte",
    toSvelteProps: ({ onPageChange, ...props }) => ({
      ...props,
      ...(onPageChange ? { onpagechange: onPageChange } : {}),
    }),
  }),
  getCurrentPage: () => document.querySelector<HTMLElement>('[aria-current="page"]'),
  async clickPage(label) {
    const button = screen.getAllByRole("button").find((item) => item.textContent?.trim() === label)
    if (!button) throw new Error(`No page button labelled ${label}`)

    await fireEvent.click(button)
  },
})

runAccordionFieldUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: AccordionFieldHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/AccordionFieldHost.svelte",
    toSvelteProps: ({ onOpenItemsChange, ...props }) => ({
      ...props,
      ...(onOpenItemsChange ? { onopenitemschange: onOpenItemsChange } : {}),
    }),
  }),
  getTrigger: (title) => screen.getByRole("button", { name: title }),
  getAllTriggers: () => screen.getAllByRole("button"),
  async click(element) {
    if ((element as HTMLButtonElement).disabled) return

    await fireEvent.click(element)
  },
})

runRadioGroupUpdatesContract("svelte", {
  ...createUpdateHydrationHarness({
    component: RadioGroupFieldContractFixture as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/RadioGroupFieldContractFixture.svelte",
    toSvelteProps: ({ onValueChange, ...props }) => ({
      ...props,
      ...(onValueChange ? { onchange: onValueChange } : {}),
    }),
  }),
  getRadio: (label) => screen.getByRole("radio", { name: label }) as HTMLInputElement,
  getAllRadios: () => screen.getAllByRole("radio") as HTMLInputElement[],
  async click(element) {
    if ((element as HTMLInputElement).disabled) return

    await fireEvent.click(element)
  },
})
