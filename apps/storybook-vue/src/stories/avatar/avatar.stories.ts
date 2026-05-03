import { AvatarSize, AvatarType, ThemeMode, storybookLayout } from "@marwes-ui/core"
import { Avatar, MarwesProvider } from "@marwes-ui/vue"
import type { AvatarProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

function createSampleAvatarImageDataUrl(): string {
  const sampleAvatarSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
      <rect width="96" height="96" rx="48" fill="#8182FC" />
      <circle cx="48" cy="38" r="18" fill="#F9FAFB" fill-opacity="0.94" />
      <path d="M22 84C25.5 67.5 36 58 48 58C60 58 70.5 67.5 74 84" fill="#F9FAFB" fill-opacity="0.94" />
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(sampleAvatarSvg)}`
}

const sampleAvatarImageDataUrl = createSampleAvatarImageDataUrl()

const avatarPreviews: Array<{
  label: string
  props: AvatarProps
}> = [
  {
    label: "Small · Initials",
    props: {
      size: AvatarSize.small,
      type: AvatarType.initials,
      initials: "MW",
    },
  },
  {
    label: "Small · Icon",
    props: {
      size: AvatarSize.small,
      type: AvatarType.icon,
    },
  },
  {
    label: "Small · Image",
    props: {
      size: AvatarSize.small,
      type: AvatarType.image,
      src: sampleAvatarImageDataUrl,
      alt: "Marwes sample profile image",
    },
  },
  {
    label: "Medium · Initials",
    props: {
      size: AvatarSize.medium,
      type: AvatarType.initials,
      initials: "MW",
    },
  },
  {
    label: "Medium · Icon",
    props: {
      size: AvatarSize.medium,
      type: AvatarType.icon,
    },
  },
  {
    label: "Medium · Image",
    props: {
      size: AvatarSize.medium,
      type: AvatarType.image,
      src: sampleAvatarImageDataUrl,
      alt: "Marwes sample profile image",
    },
  },
  {
    label: "Large · Initials",
    props: {
      size: AvatarSize.large,
      type: AvatarType.initials,
      initials: "MW",
    },
  },
  {
    label: "Large · Icon",
    props: {
      size: AvatarSize.large,
      type: AvatarType.icon,
    },
  },
  {
    label: "Large · Image",
    props: {
      size: AvatarSize.large,
      type: AvatarType.image,
      src: sampleAvatarImageDataUrl,
      alt: "Marwes sample profile image",
    },
  },
]

function buildAvatarArgs(args: AvatarProps): AvatarProps {
  if (args.type === AvatarType.image) {
    return {
      ...args,
      src: args.src ?? sampleAvatarImageDataUrl,
      alt: args.alt ?? "Marwes sample profile image",
    }
  }

  if (args.type === AvatarType.initials) {
    return {
      ...args,
      initials: args.initials ?? "MW",
    }
  }

  return args
}

const meta = {
  title: "Avatar/Atom",
  component: Avatar as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: Object.values(AvatarSize),
    },
    type: {
      control: "select",
      options: Object.values(AvatarType),
    },
    initials: { control: "text" },
    alt: { control: "text" },
    src: { control: false },
    iconName: { control: false },
    className: { control: false },
    dataAttributes: { control: false },
  },
} satisfies Meta<AvatarProps>

export default meta

type Story = StoryObj<AvatarProps>

export const Default: Story = {
  args: {
    size: AvatarSize.medium,
    type: AvatarType.initials,
    initials: "MW",
  },
  render: (args) => ({
    components: { Avatar, MarwesProvider },
    setup() {
      return {
        avatarProps: buildAvatarArgs(args),
      }
    },
    template: `<Avatar v-bind="avatarProps" />`,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Avatar },
    setup() {
      return { avatarPreviews, ThemeMode }
    },
    template: `
      <div style="display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(120px, 1fr));">
        <div v-for="preview in avatarPreviews" :key="preview.label" style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 12px; color: #666666;">{{ preview.label }}</span>
          <Avatar v-bind="preview.props" />
        </div>
      </div>
    `,
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    components: { Avatar, MarwesProvider },
    setup() {
      return { avatarPreviews, ThemeMode }
    },
    template: `
      <MarwesProvider :theme="{ mode: ThemeMode.dark }">
        <div style="display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(120px, 1fr)); padding: 24px; background: #2e2e2e; border-radius: 12px;">
          <div v-for="preview in avatarPreviews" :key="'dark-' + preview.label" style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-size: 12px; color: #d4d4d4;">{{ preview.label }}</span>
            <Avatar v-bind="preview.props" />
          </div>
        </div>
      </MarwesProvider>
    `,
  }),
}
