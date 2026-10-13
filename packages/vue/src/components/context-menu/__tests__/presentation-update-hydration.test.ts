import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
import {
  type PresentationUpdatesProps,
  runPresentationUpdatesContract,
} from "../../../../../../tests/contracts/presentation-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { ContextMenu } from "../context-menu"
const Host = defineComponent({
  props: ["visible", "onAction"],
  setup(props) {
    return () =>
      h(
        "div",
        {},
        props.visible
          ? [
              h(ContextMenu as never, {
                ariaLabel: "Actions",
                items: [{ value: "edit", label: "Edit" }],
                onSelect: props.onAction,
              }),
            ]
          : [],
      )
  },
})
runPresentationUpdatesContract("vue", "ContextMenu", {
  ...createUpdateHydrationHarness<PresentationUpdatesProps>(Host as Component),
  getRoot: () => screen.queryByRole("menu", { name: "Actions" }),
  getAction: () => screen.getByRole("menuitem", { name: "Edit" }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
