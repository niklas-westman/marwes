import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { URLField } from "../field-variants"

runFieldWiringUpdatesContract("vue", "URLField", {
  ...createUpdateHydrationHarness(URLField as Component, ({ helper, ...props }) => ({
    ...props,
    input: { value: "https://example.com" },
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
