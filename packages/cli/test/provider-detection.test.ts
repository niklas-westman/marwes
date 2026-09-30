import { describe, expect, it } from "vitest"
import { hasConfiguredProvider } from "../src/provider-detection"
import type { Adapter } from "../src/recipes"

const configuredProviders: [Adapter, string][] = [
  [
    "react",
    'import * as Marwes from "@marwes-ui/react"; const App = () => <Marwes.MarwesProvider />',
  ],
  [
    "react",
    'import { MarwesProvider as Provider } from "@marwes-ui/react"; const App = () => <Provider />',
  ],
  [
    "react",
    'import { MarwesProvider } from "@marwes-ui/react"; import { createElement as element } from "react"; element(MarwesProvider, null)',
  ],
  [
    "react",
    'import * as Marwes from "@marwes-ui/react"; import React from "react"; React.createElement(Marwes.MarwesProvider, null)',
  ],
  [
    "vue",
    '<script setup>import { MarwesProvider } from "@marwes-ui/vue"</script><template><marwes-provider /></template>',
  ],
  [
    "vue",
    '<script setup>import { MarwesProvider as ThemeProvider } from "@marwes-ui/vue"</script><template><theme-provider /></template>',
  ],
  [
    "vue",
    'import { MarwesProvider } from "@marwes-ui/vue"; import { h } from "vue"; h(MarwesProvider, null)',
  ],
  [
    "vue",
    'import * as Marwes from "@marwes-ui/vue"; import { h as render } from "vue"; render(Marwes.MarwesProvider, null)',
  ],
  [
    "vue",
    'import { MarwesProvider } from "@marwes-ui/vue"; import * as Vue from "vue"; Vue.h(MarwesProvider, null)',
  ],
  [
    "svelte",
    '<script>import { MarwesProvider } from "@marwes-ui/svelte";</script><MarwesProvider />',
  ],
  [
    "svelte",
    '<script>import { MarwesProvider as Provider } from "@marwes-ui/svelte";</script><Provider />',
  ],
]

describe("provider detection", () => {
  it.each([
    'const docs = "import provider below"\n',
    "const docs = 'import provider below'\n",
    "const docs = `import provider below`\n",
    'const docs = "import provider below";\n',
    "const docs = 'import provider below';\n",
    "const docs = `import provider below`;\n",
  ])("ignores partial import examples before an actual import: %s", (prefix) => {
    expect(
      hasConfiguredProvider(
        `${prefix}import { MarwesProvider } from "@marwes-ui/react"\nconst App = () => <MarwesProvider />`,
        "react",
      ),
    ).toBe(true)
  })

  it("does not let commented import text swallow the actual import", () => {
    expect(
      hasConfiguredProvider(
        '// import MarwesProvider below\nimport { MarwesProvider } from "@marwes-ui/react"\nconst App = () => <MarwesProvider />',
        "react",
      ),
    ).toBe(true)
  })

  it.each([
    'import { MarwesProvider } /* from "@marwes-ui/react" */ from "wrong-package"; const App = () => <MarwesProvider />',
    'import { MarwesProvider } from "wrong-package/*@marwes-ui/react*/"; const App = () => <MarwesProvider />',
    'import { MarwesProvider } from "wrong-package//@marwes-ui/react"; const App = () => <MarwesProvider />',
  ])("reads the actual module string without using comment contents: %s", (source) => {
    expect(hasConfiguredProvider(source, "react")).toBe(false)
  })

  it.each(configuredProviders)("recognizes %s runtime wiring: %s", (adapter, source) => {
    expect(hasConfiguredProvider(source, adapter)).toBe(true)
  })

  it.each([
    'import { MarwesProvider } from "@marwes-ui/vue"; <MarwesProvider />',
    'import type { MarwesProvider } from "@marwes-ui/react"; <MarwesProvider />',
    'import { type MarwesProvider } from "@marwes-ui/react"; <MarwesProvider />',
    '/* import { MarwesProvider } from "@marwes-ui/react"; <MarwesProvider /> */',
    '// import { MarwesProvider } from "@marwes-ui/react";\n<MarwesProvider />',
    'const docs = `import { MarwesProvider } from "@marwes-ui/react"; <MarwesProvider />`',
    'import { MarwesProvider } from "@marwes-ui/react"; const text = "<MarwesProvider />"',
    'import { MarwesProvider } from "@marwes-ui/react"; /* <MarwesProvider /> */',
    'import { MarwesProvider } from "@marwes-ui/react"; const App = () => <MarwesProviderFake />',
    'import { MarwesProvider } from "@marwes-ui/react"; import type { createElement } from "react"; createElement(MarwesProvider, null)',
    'import { MarwesProvider } from "@marwes-ui/react"; createElement(MarwesProvider, null)',
    'import { MarwesProvider } from "@marwes-ui/react"; import { createElement } from "react"; fake.createElement(MarwesProvider, null)',
  ])("rejects non-runtime or wrong-adapter examples: %s", (source) => {
    expect(hasConfiguredProvider(source, "react")).toBe(false)
  })

  it("rejects HTML comments", () => {
    expect(
      hasConfiguredProvider(
        '<script>import { MarwesProvider } from "@marwes-ui/vue"</script><!-- <marwes-provider /> -->',
        "vue",
      ),
    ).toBe(false)
  })
})
