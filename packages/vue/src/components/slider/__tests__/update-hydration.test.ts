/**
 * Vue adapter: wires the shared update and hydration contract for Slider.
 */
import { fireEvent, screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runSliderUpdatesContract } from "../../../../../../tests/contracts/slider-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Slider } from "../slider"

runSliderUpdatesContract("vue", {
  ...createUpdateHydrationHarness(Slider as Component),
  getSlider: () => screen.getByRole("slider") as HTMLInputElement,
  async setValue(slider, value) {
    if (slider.disabled) return

    await fireEvent.update(slider, String(value))
  },
})
