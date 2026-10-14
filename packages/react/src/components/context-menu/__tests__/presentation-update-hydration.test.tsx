import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  type PresentationUpdatesProps,
  runPresentationUpdatesContract,
} from "../../../../../../tests/contracts/presentation-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { ContextMenu } from "../context-menu"
runPresentationUpdatesContract("react", "ContextMenu", {
  ...createUpdateHydrationHarness(({ visible, onAction }: PresentationUpdatesProps) => (
    <div>
      {visible ? (
        <ContextMenu
          ariaLabel="Actions"
          items={[{ value: "edit", label: "Edit" }]}
          {...(onAction ? { onSelect: onAction } : {})}
        />
      ) : null}
    </div>
  )),
  getRoot: () => screen.queryByRole("menu", { name: "Actions" }),
  getAction: () => screen.getByRole("menuitem", { name: "Edit" }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
