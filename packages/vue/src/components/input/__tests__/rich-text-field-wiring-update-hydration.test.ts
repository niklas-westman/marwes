import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { RichTextField } from "../rich-text-field"

runFieldWiringUpdatesContract("vue", "RichTextField", {
  ...createUpdateHydrationHarness(
    RichTextField as Component,
    ({ helper, ...props }: FieldWiringProps) => ({
      ...props,
      editor: { value: "Invoice notes" },
      ...(helper ? { helperText: helper } : {}),
    }),
  ),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
