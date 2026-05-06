import { AvatarSize, AvatarType, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Avatar, type AvatarProps, MarwesProvider, ThemeMode } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

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

const meta: Meta<typeof Avatar> = {
  title: "Avatar/Atom",
  component: Avatar,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
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
    style: { control: false },
    dataAttributes: { control: false },
  },
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    size: AvatarSize.medium,
    type: AvatarType.initials,
    initials: "MW",
  },
  render: (args) => <Avatar {...buildAvatarArgs(args)} />,
}

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(3, minmax(120px, 1fr))",
      }}
    >
      {avatarPreviews.map((preview) => (
        <div key={preview.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#666666" }}>{preview.label}</span>
          <Avatar {...preview.props} />
        </div>
      ))}
    </div>
  ),
}

export const DarkVariants: Story = {
  render: () => (
    <MarwesProvider theme={{ mode: ThemeMode.dark }}>
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(3, minmax(120px, 1fr))",
          padding: 24,
          background: "#2e2e2e",
          borderRadius: 12,
        }}
      >
        {avatarPreviews.map((preview) => (
          <div
            key={`dark-${preview.label}`}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <span style={{ fontSize: 12, color: "#d4d4d4" }}>{preview.label}</span>
            <Avatar {...preview.props} />
          </div>
        ))}
      </div>
    </MarwesProvider>
  ),
}
