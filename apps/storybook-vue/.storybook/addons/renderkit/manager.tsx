import { addons, types } from "@storybook/manager-api"
import { RenderKitPanel } from "./Panel"

const ADDON_ID = "marwes/renderkit"
const PANEL_ID = `${ADDON_ID}/panel`

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "RenderKit",
    render: ({ active }: { active?: boolean }) => <RenderKitPanel active={active ?? false} />,
  })
})
