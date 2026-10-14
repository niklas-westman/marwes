import userEvent from "@testing-library/user-event"
import { runComboboxFieldUpdatesContract } from "../../../../tests/contracts/combobox-field-updates.contract"
import { runGroupFieldWiringUpdatesContract } from "../../../../tests/contracts/group-field-wiring-updates.contract"
/**
 * Svelte adapter: wires the shared single-control, group and combobox field contracts.
 */
import "@testing-library/jest-dom/vitest"
import { screen, within } from "@testing-library/svelte"
import { afterEach } from "vitest"
import { runFieldWiringUpdatesContract } from "../../../../tests/contracts/field-wiring-updates.contract"
import { unmountHydratedApps } from "./support/hydrate-from-server"
import {
  type SvelteComponent,
  createUpdateHydrationHarness,
} from "./support/update-hydration-harness"
import CheckboxFieldContractFixture from "./type-fixtures/CheckboxFieldContractFixture.svelte"
import HydrationComponentHost from "./type-fixtures/HydrationComponentHost.svelte"
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
})

runFieldWiringUpdatesContract("svelte", "TextareaField", {
  ...fieldHarness({
    component: TextareaFieldContractFixture,
    fixtureName: "TextareaFieldContractFixture",
    helperKey: "helperText",
    nestedKey: "textarea",
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "CheckboxField", {
  ...fieldHarness({
    component: CheckboxFieldContractFixture,
    fixtureName: "CheckboxFieldContractFixture",
    helperKey: "description",
  }),
  getControl: (label) => screen.getByRole("checkbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "SwitchField", {
  ...fieldHarness({
    component: SwitchFieldContractFixture,
    fixtureName: "SwitchFieldContractFixture",
    helperKey: "description",
    nestedKey: "switch",
  }),
  getControl: (label) => screen.getByRole("switch", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "SliderField", {
  ...fieldHarness({
    component: SliderFieldContractFixture,
    fixtureName: "SliderFieldContractFixture",
    helperKey: "description",
    nestedKey: "slider",
  }),
  getControl: (label) => screen.getByRole("slider", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "SelectField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "SelectField",
      componentProps: {
        ...props,
        select: {
          options: [
            { value: "se", label: "Sweden" },
            { value: "no", label: "Norway" },
          ],
          name: "country",
        },
        value: "no",
        ...(helper ? { helperText: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("combobox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "DropdownField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "DropdownField",
      componentProps: {
        ...props,
        select: { options: [{ value: "se", label: "Sweden" }], name: "country" },
        value: "se",
        ...(helper ? { helperText: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("combobox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "RichTextField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "RichTextField",
      componentProps: {
        ...props,
        editor: { value: "Invoice notes" },
        ...(helper ? { helperText: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "InputOtpField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "InputOtpField",
      componentProps: {
        ...props,
        inputOtp: { value: "123456" },
        ...(helper ? { helperText: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "ZipCodeField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "ZipCodeField",
      componentProps: { ...props, value: "01234", ...(helper ? { helperText: helper } : {}) },
    }),
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "CurrencyField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "CurrencyField",
      componentProps: { ...props, value: "42", ...(helper ? { helperText: helper } : {}) },
    }),
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})

runGroupFieldWiringUpdatesContract("svelte", "CheckboxGroupField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "CheckboxGroupField",
      componentProps: { ...props, ...(helper ? { description: helper } : {}) },
    }),
  }),
  getMembers: (group) => within(group).getAllByRole("checkbox"),
  getControl: (label) => screen.getByRole("group", { name: label }),
})

runGroupFieldWiringUpdatesContract("svelte", "RadioGroupField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "OptionRadioGroup",
      componentProps: {
        ...props,
        name: "contact",
        options: [
          { value: "email", label: "Email" },
          { value: "sms", label: "SMS" },
        ],
        value: "sms",
        ...(helper ? { description: helper } : {}),
      },
    }),
  }),
  getMembers: (group) => within(group).getAllByRole("radio"),
  getControl: (label) => screen.getByRole("radiogroup", { name: label }),
})

runGroupFieldWiringUpdatesContract("svelte", "AccordionField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "AccordionField",
      componentProps: {
        ...props,
        items: [
          { value: "first", title: "First", content: "First section" },
          { value: "second", title: "Second", content: "Second section" },
        ],
        openItems: ["second"],
        ...(helper ? { description: helper } : {}),
      },
    }),
  }),
  getMembers: (group) => within(group).getAllByRole("button"),
  getControl: (label) => screen.getByRole("group", { name: label }),
})

runGroupFieldWiringUpdatesContract("svelte", "SegmentedControlField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "SegmentedControlField",
      componentProps: {
        ...props,
        segmentedControl: {
          items: [
            { value: "email", label: "Email" },
            { value: "sms", label: "SMS" },
          ],
          value: "sms",
        },
        ...(helper ? { description: helper } : {}),
      },
    }),
  }),
  getMembers: (group) => within(group).getAllByRole("radio"),
  getControl: (label) => screen.getByRole("radiogroup", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "PaginationField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "PaginationField",
      componentProps: {
        ...props,
        pagination: { pageCount: 10, page: 4 },
        ...(helper ? { description: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("navigation", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "DatePickerField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "DatePickerField",
      componentProps: {
        ...props,
        datePicker: { monthLabel: "October 2026" },
        ...(helper ? { helperText: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("region", { name: label }),
})

runComboboxFieldUpdatesContract("svelte", "SelectField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ label, value, disabled, onValueChange }) => ({
      componentName: "SelectField",
      componentProps: {
        label,
        value,
        select: {
          options: [
            { value: "se", label: "Sweden" },
            { value: "no", label: "Norway" },
          ],
          name: "country",
          disabled,
          onvaluechange: onValueChange,
        },
      },
    }),
  }),
  getCombobox: (label) => screen.getByRole("combobox", { name: label }),
  getOption: (label) => screen.getByRole("option", { name: label }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})

runComboboxFieldUpdatesContract("svelte", "DropdownField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ label, value, disabled, onValueChange }) => ({
      componentName: "DropdownField",
      componentProps: {
        label,
        value,
        select: {
          options: [
            { value: "se", label: "Sweden" },
            { value: "no", label: "Norway" },
          ],
          name: "country",
          disabled,
          onvaluechange: onValueChange,
        },
      },
    }),
  }),
  getCombobox: (label) => screen.getByRole("combobox", { name: label }),
  getOption: (label) => screen.getByRole("option", { name: label }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})

runFieldWiringUpdatesContract("svelte", "EmailField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "EmailField",
      componentProps: {
        ...props,
        value: "user@example.com",
        ...(helper ? { helperText: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "PhoneField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "PhoneField",
      componentProps: {
        ...props,
        value: "+46123456789",
        ...(helper ? { helperText: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "URLField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "URLField",
      componentProps: {
        ...props,
        value: "https://example.com",
        ...(helper ? { helperText: helper } : {}),
      },
    }),
  }),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "SearchField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "SearchField",
      componentProps: { ...props, value: "Invoice", ...(helper ? { helperText: helper } : {}) },
    }),
  }),
  getControl: (label) => screen.getByRole("searchbox", { name: label }),
})

runFieldWiringUpdatesContract("svelte", "PasswordField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "PasswordField",
      componentProps: { ...props, value: "Secret", ...(helper ? { helperText: helper } : {}) },
    }),
  }),
  getControl: (label) => screen.getByLabelText(label),
})

runFieldWiringUpdatesContract("svelte", "DateOfBirthField", {
  ...createUpdateHydrationHarness({
    component: HydrationComponentHost as SvelteComponent,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ helper, ...props }) => ({
      componentName: "DateOfBirthField",
      componentProps: { ...props, value: "2000-01-02", ...(helper ? { helperText: helper } : {}) },
    }),
  }),
  getControl: (label) => screen.getByLabelText(label),
})
