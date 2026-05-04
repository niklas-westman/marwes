# React Block: Login Panel

A centered login surface for product prototypes and internal apps.

```tsx
import { Card, H1, InputField, Paragraph, SubmitButton, TextButton } from "@marwes-ui/react"

export function LoginPanelBlock() {
  return (
    <main className="login-shell">
      <Card className="login-card">
        <H1 size="h2">Welcome back</H1>
        <Paragraph>Sign in to continue to your workspace.</Paragraph>

        <form className="login-form">
          <InputField label="Email" input={{ type: "email", placeholder: "you@example.com" }} />
          <InputField label="Password" input={{ type: "password", placeholder: "••••••••" }} />
          <SubmitButton>Sign in</SubmitButton>
          <TextButton>Forgot password?</TextButton>
        </form>
      </Card>
    </main>
  )
}
```

```css
.login-shell {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  background: var(--mw-color-surface-subtle);
}

.login-card {
  width: min(100%, 26rem);
}

.login-form {
  display: grid;
  gap: var(--mw-spacing-sp-16);
  margin-top: var(--mw-spacing-sp-24);
}
```
