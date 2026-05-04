# React Block: Settings Form

A settings section with editable fields, helper copy, and clear actions.

```tsx
import { Button, ButtonVariant, Card, InputField, Paragraph, SelectField, SubmitButton } from "@marwes-ui/react"

export function SettingsFormBlock() {
  return (
    <main className="settings-shell">
      <Card title="Workspace settings" className="settings-card">
        <Paragraph>Update the public details and defaults for this workspace.</Paragraph>

        <form className="settings-form">
          <InputField
            label="Workspace name"
            helperText="Shown in navigation, invites, and reports."
            input={{ defaultValue: "Acme operations" }}
          />
          <InputField
            label="Notification email"
            input={{ type: "email", defaultValue: "ops@example.com" }}
          />
          <SelectField
            label="Default region"
            select={{
              defaultValue: "eu",
              options: [
                { value: "eu", label: "Europe" },
                { value: "us", label: "United States" },
              ],
            }}
          />

          <div className="settings-actions">
            <Button variant={ButtonVariant.secondary}>Cancel</Button>
            <SubmitButton>Save settings</SubmitButton>
          </div>
        </form>
      </Card>
    </main>
  )
}
```

```css
.settings-shell {
  min-height: 100dvh;
  padding: var(--mw-spacing-sp-32);
  color: var(--mw-color-text);
  background: var(--mw-color-background);
}

.settings-card {
  max-width: 42rem;
}

.settings-form {
  display: grid;
  gap: var(--mw-spacing-sp-16);
  margin-top: var(--mw-spacing-sp-24);
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--mw-spacing-sp-12);
}
```
