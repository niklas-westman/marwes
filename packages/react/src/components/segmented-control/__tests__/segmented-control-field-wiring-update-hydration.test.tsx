import { screen, within } from "@testing-library/react"
import { runGroupFieldWiringUpdatesContract } from "../../../../../../tests/contracts/group-field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SegmentedControlField } from "../segmented-control-field"

runGroupFieldWiringUpdatesContract("react", "SegmentedControlField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <SegmentedControlField
      {...props}
      segmentedControl={{
        items: [
          { value: "email", label: "Email" },
          { value: "sms", label: "SMS" },
        ],
        value: "sms",
      }}
      {...(helper ? { description: helper } : {})}
    />
  )),
  getMembers: (group) => within(group).getAllByRole("radio"),
  getControl: (label) => screen.getByRole("radiogroup", { name: label }),
})
