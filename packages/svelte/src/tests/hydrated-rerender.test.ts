import "@testing-library/jest-dom/vitest"
import { screen } from "@testing-library/svelte"
import { afterEach } from "vitest"
import { runHydratedRerenderContract } from "../../../../tests/contracts/hydrated-rerender.contract"
import { unmountHydratedApps } from "./support/hydrate-from-server"
import { createUpdateHydrationHarness } from "./support/update-hydration-harness"
import Host from "./type-fixtures/MultiFieldHydrationHost.svelte"

afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})
runHydratedRerenderContract("svelte", {
  ...createUpdateHydrationHarness({
    component: Host,
    componentPath: "/src/tests/type-fixtures/MultiFieldHydrationHost.svelte",
    toSvelteProps: (props) => props,
  }),
  getInput: (label) => screen.getByRole("textbox", { name: label }) as HTMLInputElement,
})
