import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Breadcrumb } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { h, ref } from "vue"

const items = [
  { label: "Components", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb" },
]

const meta = {
  title: "Breadcrumb/Atom",
  component: Breadcrumb as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    showHome: { control: "boolean" },
    homeHref: { control: "text" },
    ariaLabel: { control: "text" },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    homeHref: "#",
    items,
  },
}

export const WithoutHome: Story = {
  args: {
    showHome: false,
    items,
  },
}

export const ButtonBacked: Story = {
  render: () => ({
    setup() {
      const selected = ref("Components")
      return () =>
        h(Breadcrumb, {
          showHome: false,
          items: [
            { value: "Components", label: "Components", current: selected.value === "Components" },
            { value: "Navigation", label: "Navigation", current: selected.value === "Navigation" },
            { value: "Breadcrumb", label: "Breadcrumb", current: selected.value === "Breadcrumb" },
          ],
          onItemSelect: (value: string) => {
            selected.value = value
          },
        })
    },
  }),
}

export const AllStates: Story = {
  render: () => ({
    setup() {
      return () =>
        h("div", { style: "display:flex;flex-direction:column;gap:24px" }, [
          h(Breadcrumb, { homeHref: "#", items, ariaLabel: "Default breadcrumb" }),
          h(Breadcrumb, { showHome: false, items, ariaLabel: "No home breadcrumb" }),
          h(Breadcrumb, {
            homeHref: "#",
            items: [{ label: "Current page" }],
            ariaLabel: "Single page breadcrumb",
          }),
        ])
    },
  }),
}
