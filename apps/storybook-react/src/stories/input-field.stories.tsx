import { InputField } from "@marwes/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta<typeof InputField> = {
  title: "Input/Field",
  component: InputField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Input Field Label",
  },
};

export default meta;

type Story = StoryObj<typeof InputField>;

/**
 * Recommended usage - minimal InputField with just a label
 */
export const FieldRecommended: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <InputField
        label="Email address"
        input={{ type: "email", placeholder: "you@example.com" }}
      />
    </div>
  ),
};

/**
 * InputField with helper text to guide the user
 */
export const FieldWithHelperText: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <InputField
        label="Username"
        helperText="Choose a unique username between 3-20 characters."
        input={{ type: "text", placeholder: "johnsmith" }}
      />
    </div>
  ),
};

/**
 * InputField with error message - automatically marks input as invalid
 */
export const FieldWithError: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <InputField
        label="Password"
        error="Password must be at least 8 characters."
        input={{ type: "password", required: true }}
      />
    </div>
  ),
};

/**
 * Disabled input field
 */
export const FieldDisabled: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <InputField
        label="Account ID"
        helperText="This value cannot be changed."
        input={{ value: "ACC-12345", disabled: true }}
      />
    </div>
  ),
};

/**
 * Read-only input field
 */
export const FieldReadOnly: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <InputField
        label="Account created"
        input={{ value: "January 15, 2026", readOnly: true }}
      />
    </div>
  ),
};

/**
 * Controlled input field with state management
 */
export const FieldControlled: Story = {
  render: () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | undefined>();

    const handleChange = (value: string) => {
      setEmail(value);
      // Simple validation example
      if (value && !value.includes("@")) {
        setError("Please enter a valid email address.");
      } else {
        setError(undefined);
      }
    };

    return (
      <div style={{ width: "320px" }}>
        <InputField
          label="Email"
          helperText={!error ? "We'll never share your email." : undefined}
          error={error}
          input={{
            type: "email",
            value: email,
            onValueChange: handleChange,
            placeholder: "you@example.com",
          }}
        />
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current value: {email || "(empty)"}
        </p>
      </div>
    );
  },
};

/**
 * Different input types
 */
export const FieldTypes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "24px", width: "320px" }}>
      <InputField label="Text" input={{ type: "text" }} />
      <InputField label="Email" input={{ type: "email" }} />
      <InputField label="Password" input={{ type: "password" }} />
      <InputField label="Search" input={{ type: "search" }} />
      <InputField label="Telephone" input={{ type: "tel" }} />
      <InputField label="URL" input={{ type: "url" }} />
    </div>
  ),
};

/**
 * Required field indicator
 */
export const FieldRequired: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <InputField
        label="Email address *"
        helperText="Required field"
        input={{ type: "email", required: true }}
      />
    </div>
  ),
};
