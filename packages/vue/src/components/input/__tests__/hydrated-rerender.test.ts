import { screen } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
import { runHydratedRerenderContract } from "../../../../../../tests/contracts/hydrated-rerender.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { InputField } from "../input-field"
const MultiField = defineComponent({
  props: ["label", "value", "error"],
  setup: (props) => () => [
    h(InputField, { label: props.label, error: props.error, input: { value: props.value } }),
    h(MarwesProvider, null, {
      default: () => h(InputField, { label: "Alternate", input: { value: props.value } }),
    }),
  ],
})
runHydratedRerenderContract("vue", {
  ...createUpdateHydrationHarness(MultiField as Component, (props) => ({ ...props })),
  getInput: (label) => screen.getByRole("textbox", { name: label }) as HTMLInputElement,
})
