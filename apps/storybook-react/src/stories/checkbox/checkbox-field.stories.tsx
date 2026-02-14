import { CheckboxField } from "@marwes/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta<typeof CheckboxField> = {
  title: "Checkbox/Field",
  component: CheckboxField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Checkbox Field Label",
  },
  argTypes: {
    checkbox: {
      size: { control: "radio", options: ["sm", "md", "lg"] },
      disabled: { control: "boolean" },
      required: { control: "boolean" },
      invalid: { control: "boolean" },
      checked: { control: "boolean" },
      defaultChecked: { control: "boolean" },
      indeterminate: { control: "boolean" },
      ariaLabel: { control: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxField>;

/**
 * Recommended usage - minimal CheckboxField with just a label
 */
export const FieldRecommended: Story = {
  render: () => (
    <CheckboxField label="Subscribe to updates" checkbox={{ size: "md" }} />
  ),
};

/**
 * CheckboxField with description text to provide additional context
 */
export const FieldWithDescription: Story = {
  render: () => (
    <CheckboxField
      label="Subscribe to updates"
      description="We'll only email you about important product changes."
      checkbox={{ size: "md" }}
    />
  ),
};

/**
 * CheckboxField with error message - automatically marks checkbox as invalid
 */
export const FieldWithError: Story = {
  render: () => (
    <CheckboxField
      label="Accept terms and conditions"
      error="You must accept the terms to continue."
      checkbox={{ required: true }}
    />
  ),
};

/**
 * Disabled checkbox field
 */
export const FieldDisabled: Story = {
  render: () => (
    <CheckboxField
      label="Disabled option"
      description="This option is currently unavailable."
      checkbox={{ disabled: true }}
    />
  ),
};

/**
 * Different checkbox sizes
 */
export const FieldSizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <CheckboxField label="Small checkbox" checkbox={{ size: "sm" }} />
      <CheckboxField
        label="Medium checkbox (default)"
        checkbox={{ size: "md" }}
      />
      <CheckboxField label="Large checkbox" checkbox={{ size: "lg" }} />
    </div>
  ),
};

/**
 * Indeterminate (mixed) state - commonly used for "select all" scenarios
 */
export const FieldIndeterminate: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [mixed, setMixed] = useState(true);

    return (
      <CheckboxField
        label="Select all items"
        description="Some items are already selected."
        checkbox={{
          checked,
          indeterminate: mixed,
          onCheckedChange: (next) => {
            setMixed(false);
            setChecked(next);
          },
        }}
      />
    );
  },
};

/**
 * Controlled checkbox field with state management
 */
export const FieldControlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div>
        <CheckboxField
          label="Enable notifications"
          description="Get notified about new features and updates."
          checkbox={{
            checked,
            onCheckedChange: setChecked,
          }}
        />
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Status: {checked ? "Enabled" : "Disabled"}
        </p>
      </div>
    );
  },
};

/**
 * CheckboxField with validation and error handling
 */
export const FieldWithValidation: Story = {
  render: () => {
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState<string | undefined>(
      "You must accept the terms to proceed.",
    );

    const handleChange = (value: boolean) => {
      setAccepted(value);
      if (value) {
        setError(undefined);
      } else {
        setError("You must accept the terms to proceed.");
      }
    };

    return (
      <CheckboxField
        label="I accept the terms and conditions"
        error={error}
        checkbox={{
          checked: accepted,
          onCheckedChange: handleChange,
          required: true,
        }}
      />
    );
  },
};
