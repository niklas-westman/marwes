import { firstEdition } from "@marwes/presets"
import { Button, MarwesProvider } from "@marwes/react"

import "@marwes/presets/firstEdition/styles.css"

function App() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Marwes Playground</h1>

      <MarwesProvider
        preset={firstEdition}
        theme={{
          color: { primary: "#5B8CFF", secondary: "#111111" },
          ui: { radius: 12 },
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button>Primary</Button>

          <Button tone="secondary">Secondary</Button>
          <Button as="a" href="https://example.com" tone="text">
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
