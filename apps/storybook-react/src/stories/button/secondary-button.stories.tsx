import type { Meta, StoryObj } from "@storybook/react";
import { Button, SecondaryButton } from "@marwes/react";
import { iconRegistry } from "@marwes/core";

const iconNames = Object.keys(iconRegistry) as Array<keyof typeof iconRegistry>;

const meta = {
  title: "Buttons/General/Secondary",
  component: SecondaryButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
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

export const SecondaryExample: Story = {
  args: {
    children: "Secondary Button",
  },
};
