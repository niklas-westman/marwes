import { firstEdition } from "@marwes-ui/presets"
import { Button, ButtonVariant, IconName, MarwesProvider, SecondaryButton } from "@marwes-ui/react"

import "@marwes-ui/presets/firstEdition/styles.css"

function App() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Marwes Playground</h1>

      <MarwesProvider
        preset={firstEdition}
        theme={{
          color: { primary: " #5B8CFF", secondary: "#b216c4" },
          font: {
            primary: "Open sans",
          },
          // color: { primary: "#5B8CFF", secondary: "#111111" },
          // ui: { radius: 12 },
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <SecondaryButton iconLeft={IconName.Music}>Danger</SecondaryButton>

          <Button variant={ButtonVariant.secondary}>Secondary</Button>
          <Button as="a" href="https://example.com" variant="text">
            Link Button
          </Button>
          <Button disabled>Disabled</Button>
          <Button loading ariaLabel="Loading button" hasVisibleText>
            Loading
          </Button>
        </div>
      </MarwesProvider>
    </div>
  )
}

export default App
