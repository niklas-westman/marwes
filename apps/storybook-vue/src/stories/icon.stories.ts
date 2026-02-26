import {
  type IconName,
  storybookIconGalleryArgTypes,
  storybookIconGalleryDefaults,
  storybookIconNames,
  storybookLayout,
} from "@marwes-ui/core"
import { Icon } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { computed } from "vue"

type Args = {
  size: "xs" | "sm" | "md" | "lg"
  strokeWidth: "xs" | "sm" | "md" | "lg"
  search: string
  columns: number
}

const meta: Meta<Args> = {
  title: "Icons/Gallery",
  parameters: storybookLayout.fullscreen,
  args: storybookIconGalleryDefaults,
  argTypes: storybookIconGalleryArgTypes,
}

export default meta
type Story = StoryObj<Args>

export const Gallery: Story = {
  render: (args) => ({
    components: { Icon },
    setup() {
      const allIcons = storybookIconNames as IconName[]
      const q = computed(() => args.search.trim().toLowerCase())
      const list = computed(() =>
        allIcons
          .filter((name) => (q.value ? String(name).toLowerCase().includes(q.value) : true))
          .sort((a, b) => String(a).localeCompare(String(b))),
      )
      const gridStyle = computed(() => ({
        display: "grid",
        gridTemplateColumns: `repeat(${args.columns}, minmax(0, 1fr))`,
        gap: "12px",
      }))

      return { args, list, allIcons, gridStyle }
    },
    template: `
      <div style="padding: 16px; font-family: Instrument Sans, system-ui, -apple-system, sans-serif;">
        <div style="margin-bottom: 12px; font-size: 12px; opacity: 0.7;">
          Showing {{ list.length }} of {{ allIcons.length }}
        </div>

        <div :style="gridStyle">
          <div
            v-for="name in list"
            :key="String(name)"
            :title="String(name)"
            style="
              border: 1px solid rgba(0,0,0,0.1);
              border-radius: 10px;
              padding: 10px;
              text-align: center;
              display: flex;
              flex-direction: column;
              gap: 8px;
              align-items: center;
              justify-content: center;
              min-height: 84px;
            "
          >
            <Icon :name="name" :size="args.size" :strokeWidth="args.strokeWidth" />
            <div style="font-size: 11px; line-height: 1.2; opacity: 0.85; word-break: break-word;">
              {{ String(name) }}
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}
