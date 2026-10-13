export function themeScenarios() {
  return ["style-tag", "inline"].flatMap((strategy) =>
    [
      { preference: "light", colorScheme: "light", expectedMode: "light" },
      { preference: "dark", colorScheme: "dark", expectedMode: "dark" },
      { preference: "system", colorScheme: "light", expectedMode: "light" },
      { preference: "system", colorScheme: "dark", expectedMode: "dark" },
      { preference: "light", storedPreference: "dark", colorScheme: "light", expectedMode: "dark" },
      { preference: "dark", storedPreference: "light", colorScheme: "dark", expectedMode: "light" },
    ].map((scenario) => ({
      ...scenario,
      strategy,
      name: `theme-${strategy}-${scenario.preference}-${scenario.storedPreference ?? scenario.colorScheme}`,
    })),
  )
}

// The test response supplies nonces to framework bootstraps. Marwes helper tags
// must already carry their fixture nonce; this does not claim framework CSP setup.
export function nonceFrameworkBootstraps(html) {
  return html.replace(/<script\b([^>]*)>/g, (tag, attributes) =>
    /\bnonce=/.test(attributes) ? tag : `<script nonce="ssr-fixture"${attributes}>`,
  )
}
export const scriptNoncePolicy = "script-src 'self' 'nonce-ssr-fixture'; object-src 'none'"

export function isKnownBlocked({ framework, name, reason, issues }) {
  if (
    ["theme-inline-system-dark", "theme-inline-light-dark", "theme-inline-dark-light"].includes(
      name,
    )
  ) {
    return (
      reason.includes("Theme colors must remain stable across hydration") && issues.length === 0
    )
  }
  if (name === "initially-open" && ["next", "react18", "react19"].includes(framework)) {
    return (
      reason.includes("An initially-open modal is absent from server HTML") &&
      issues.length > 0 &&
      issues.every(({ text }) => /Minified React error #(418|423)\b/.test(text))
    )
  }
  return false
}
