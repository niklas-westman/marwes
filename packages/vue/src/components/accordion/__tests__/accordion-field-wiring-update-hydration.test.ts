import { screen, within } from "@testing-library/vue"
import type { Component } from "vue"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runGroupFieldWiringUpdatesContract } from "../../../../../../tests/contracts/group-field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { AccordionField } from "../accordion-field"

runGroupFieldWiringUpdatesContract("vue", "AccordionField", {
  ...createUpdateHydrationHarness(
    AccordionField as Component,
    ({ helper, ...props }: FieldWiringProps) => ({
      ...props,
      items: [
        { value: "first", title: "First", content: "First section" },
        { value: "second", title: "Second", content: "Second section" },
      ],
      openItems: ["second"],
      ...(helper ? { description: helper } : {}),
    }),
  ),
  getMembers: (group) => within(group).getAllByRole("button"),
  getControl: (label) => screen.getByRole("group", { name: label }),
})
