import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
import {
  type PresentationUpdatesProps,
  runPresentationUpdatesContract,
} from "../../../../../../tests/contracts/presentation-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Dialog } from "../dialog"
const Host = defineComponent({
  props: ["visible", "onAction"],
  setup(props) {
    return () =>
      h(
        "div",
        {},
        props.visible ? [h(Dialog as never, { title: "Actions", onClose: props.onAction })] : [],
      )
  },
})
runPresentationUpdatesContract("vue", "Dialog", {
  ...createUpdateHydrationHarness<PresentationUpdatesProps>(Host as Component),
  getRoot: () => screen.queryByRole("dialog", { name: "Actions" }),
  getAction: () => screen.getByRole("button", { name: "Close dialog" }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
