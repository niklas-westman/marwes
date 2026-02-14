import type { Meta, StoryObj } from "@storybook/react";
import { Button, DangerButton } from "@marwes/react";
import { iconRegistry } from "@marwes/core";

const iconNames = Object.keys(iconRegistry) as Array<keyof typeof iconRegistry>;

const meta = {
  title: "Buttons/Purpose/DangerButton",
  component: DangerButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["primary", "secondary", "text"],
    },
    iconLeft: {
      control: "select",
      options: [undefined, ...iconNames],
    },
    iconRight: {
      control: "select",
      options: [undefined, ...iconNames],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DangerExample: StoryObj<typeof DangerButton> = {
  render: () => (
    <DangerButton iconLeft="arrowLeft">Delete Project</DangerButton>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "DangerButton automatically sets destructive metadata and requires confirmation by default.",
      },
    },
  },
};
