import { screen, within } from "@testing-library/vue"
import type { Component } from "vue"
import { runGroupFieldWiringUpdatesContract } from "../../../../../../tests/contracts/group-field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SegmentedControlField } from "../segmented-control-field"

runGroupFieldWiringUpdatesContract("vue", "SegmentedControlField", {
  ...createUpdateHydrationHarness(SegmentedControlField as Component, ({ helper, ...props }) => ({
    ...props,
    segmentedControl: {
      items: [
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
      ],
      modelValue: "sms",
    },
    ...(helper ? { description: helper } : {}),
  })),
  getMembers: (group) => within(group).getAllByRole("radio"),
  getControl: (label) => screen.getByRole("radiogroup", { name: label }),
})
