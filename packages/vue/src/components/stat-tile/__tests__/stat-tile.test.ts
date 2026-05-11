/**
 * Vue adapter: Tests the Stat Tile component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { cleanup, render, screen } from "@testing-library/vue"
import { afterEach } from "vitest"
import { runStatTileContract } from "../../../../../../tests/contracts/stat-tile.contract"
import { StatTile, type StatTileProps } from "../stat-tile"

afterEach(cleanup)

const defaultProps = {
  label: "Monthly Revenue",
  value: "$48,200",
  subtitle: "vs $42,900 last month",
} satisfies StatTileProps

runStatTileContract("vue", {
  renderStatTile(args = {}) {
    render(StatTile, { props: { ...defaultProps, ...args } })
  },
  getStatTileElement() {
    return screen.getByText("Monthly Revenue").closest("article") as HTMLElement
  },
  getByText(text: string) {
    return screen.getByText(text)
  },
})
