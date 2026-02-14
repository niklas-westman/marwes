import type { Meta, StoryObj } from "@storybook/react";
import { Button, CancelButton } from "@marwes/react";
import { iconRegistry } from "@marwes/core";

const iconNames = Object.keys(iconRegistry) as Array<keyof typeof iconRegistry>;

const meta = {
  title: "Buttons/Purpose/CancelButton",
  component: CancelButton,
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
      options: ["None", ...iconNames],
    },
    iconRight: {
      control: "select",
      options: ["None", ...iconNames],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CancelExample: Story = {
  args: {
    children: "Cancel",
    iconRight: "x",
  },
};
