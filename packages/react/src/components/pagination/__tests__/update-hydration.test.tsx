/**
 * React adapter: wires the shared update and hydration contract for Pagination.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { runPaginationUpdatesContract } from "../../../../../../tests/contracts/pagination-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Pagination } from "../pagination"

runPaginationUpdatesContract("react", {
  ...createUpdateHydrationHarness((props) => <Pagination {...props} />),
  getCurrentPage: () => document.querySelector<HTMLElement>('[aria-current="page"]'),
  async clickPage(label) {
    const button = screen.getAllByRole("button").find((item) => item.textContent?.trim() === label)
    if (!button) throw new Error(`No page button labelled ${label}`)

    await userEvent.setup().click(button)
  },
})
