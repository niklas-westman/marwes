/**
 * React adapter: wires the shared update and hydration contract for Slider.
 */
import { fireEvent, screen } from "@testing-library/react"
import { runSliderUpdatesContract } from "../../../../../../tests/contracts/slider-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Slider } from "../slider"

runSliderUpdatesContract("react", {
  ...createUpdateHydrationHarness((props) => <Slider {...props} />),
  getSlider: () => screen.getByRole("slider") as HTMLInputElement,
  async setValue(slider, value) {
    if (slider.disabled) return

    fireEvent.change(slider, { target: { value: String(value) } })
  },
})
