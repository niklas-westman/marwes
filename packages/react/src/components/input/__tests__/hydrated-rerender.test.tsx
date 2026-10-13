import { screen } from "@testing-library/react"
import { runHydratedRerenderContract } from "../../../../../../tests/contracts/hydrated-rerender.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { InputField } from "../input-field"
runHydratedRerenderContract("react", {
  ...createUpdateHydrationHarness(
    ({ value, ...props }: { label: string; value: string; error?: string }) => (
      <>
        <InputField {...props} input={{ value }} />
        <MarwesProvider>
          <InputField label="Alternate" input={{ value }} />
        </MarwesProvider>
      </>
    ),
  ),
  getInput: (label) => screen.getByRole("textbox", { name: label }) as HTMLInputElement,
})
