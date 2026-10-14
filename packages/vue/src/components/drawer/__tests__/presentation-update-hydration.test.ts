import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
import {
  type PresentationUpdatesProps,
  runPresentationUpdatesContract,
} from "../../../../../../tests/contracts/presentation-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Drawer } from "../drawer"
const Host = defineComponent({
  props: ["visible", "onAction"],
  setup(props) {
    return () =>
      h(
        "div",
        {},
        props.visible ? [h(Drawer as never, { title: "Actions", onClose: props.onAction })] : [],
      )
  },
})
runPresentationUpdatesContract("vue", "Drawer", {
  ...createUpdateHydrationHarness<PresentationUpdatesProps>(Host as Component),
  getRoot: () => screen.queryByRole("dialog", { name: "Actions" }),
  getAction: () => screen.getByRole("button", { name: "Close drawer" }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
