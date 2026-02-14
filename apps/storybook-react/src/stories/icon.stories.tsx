import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@marwes/react";

// Import from core (adjust if you export these elsewhere)
import { iconNames } from "@marwes/core";
import type { IconName } from "@marwes/core";

type Args = {
  size: "xs" | "sm" | "md" | "lg";
  strokeWidth: "xs" | "sm" | "md" | "lg";
  search: string;
  columns: number;
};

const meta: Meta<Args> = {
  title: "Icons/Gallery",
  parameters: {
    layout: "fullscreen",
  },
  args: {
    size: "sm",
    strokeWidth: "md",
    search: "",
    columns: 8,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
    },
    strokeWidth: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
    },
    search: { control: "text" },
    columns: {
      control: { type: "range", min: 4, max: 14, step: 1 },
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Gallery: Story = {
  render: (args) => {
    const q = args.search.trim().toLowerCase();

    const list = (iconNames as IconName[])
      .filter((name) => (q ? String(name).toLowerCase().includes(q) : true))
      .sort((a, b) => String(a).localeCompare(String(b)));

    return (
      <div
        style={{
          padding: 16,
          fontFamily: "Instrument Sans, system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ marginBottom: 12, fontSize: 12, opacity: 0.7 }}>
          Showing {list.length} of {(iconNames as IconName[]).length}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${args.columns}, minmax(0, 1fr))`,
            gap: 12,
          }}
        >
          {list.map((name) => (
            <div
              key={String(name)}
              style={{
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 10,
                padding: 10,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 84,
              }}
              title={String(name)}
            >
              <Icon
                name={name}
                size={args.size}
                strokeWidth={args.strokeWidth}
              />
              <div
                style={{
                  fontSize: 11,
                  lineHeight: 1.2,
                  opacity: 0.85,
                  wordBreak: "break-word",
                }}
              >
                {String(name)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
