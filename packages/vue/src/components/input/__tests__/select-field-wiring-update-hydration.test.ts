import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SelectField } from "../select-field"

runFieldWiringUpdatesContract("vue", "SelectField", {
  ...createUpdateHydrationHarness(SelectField as Component, ({ helper, ...props }) => ({
    ...props,
    select: {
      options: [
        { value: "se", label: "Sweden" },
        { value: "no", label: "Norway" },
      ],
      value: "no",
      name: "country",
    },
    ...(helper ? { helperText: helper } : {}),
  })),
  getControl: (label) => screen.getByRole("combobox", { name: label }),
})
