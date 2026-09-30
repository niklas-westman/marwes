import assert from "node:assert/strict"
import path from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import { createFixtureImportChecker } from "./check-reflection-fixtures.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const check = createFixtureImportChecker()
const fixture = (adapter, source, extension = "ts") =>
  check({
    adapter,
    source,
    filename: path.join(root, `tests/reflection/${adapter}-regression.${extension}`),
  })

for (const adapter of ["react", "vue", "svelte"]) {
  test(`${adapter}: rejects removed root Accordion even when aliased`, () => {
    assert.match(
      fixture(
        adapter,
        `import { Accordion as FixtureAccordion } from "@marwes-ui/${adapter}"`,
      ).join("\n"),
      /no runtime export Accordion/,
    )
  })
  test(`${adapter}: accepts public purpose component and type-only export`, () => {
    assert.deepEqual(
      fixture(
        adapter,
        `import { AccordionField, type AccordionFieldProps } from "@marwes-ui/${adapter}"`,
      ),
      [],
    )
  })
  test(`${adapter}: rejects type-only exports imported as runtime values`, () => {
    assert.match(
      fixture(adapter, `import { AccordionFieldProps } from "@marwes-ui/${adapter}"`).join("\n"),
      /no runtime export AccordionFieldProps/,
    )
  })
}

test("accepts existing private React and Vue runtime exports", () => {
  assert.deepEqual(
    fixture(
      "react",
      'import { Accordion } from "../../packages/react/src/components/accordion/accordion"',
    ),
    [],
  )
  assert.deepEqual(
    fixture(
      "vue",
      'import { Accordion } from "../../packages/vue/src/components/accordion/accordion"',
    ),
    [],
  )
})

test("accepts private Svelte component without treating props as named exports", () => {
  assert.deepEqual(
    fixture(
      "svelte",
      '<script lang="ts">import Accordion from "../../packages/svelte/src/lib/components/accordion/Accordion.svelte"; let { path }: { path: string } = $props();</script><Accordion title={path} />',
      "svelte",
    ),
    [],
  )
  assert.match(
    fixture(
      "svelte",
      'import { title } from "../../packages/svelte/src/lib/components/accordion/Accordion.svelte"',
    ).join("\n"),
    /no runtime export title/,
  )
})

test("checks imports inside Svelte scripts", () => {
  assert.match(
    fixture(
      "svelte",
      '<script lang="ts">import { Accordion } from "@marwes-ui/svelte";</script>',
      "svelte",
    ).join("\n"),
    /no runtime export Accordion/,
  )
})

test("rejects the wrong public or private adapter", () => {
  assert.match(
    fixture("react", 'import { AccordionField } from "@marwes-ui/vue"').join("\n"),
    /react fixture imports the vue adapter/,
  )
  assert.match(
    fixture(
      "react",
      'import { Accordion } from "../../packages/vue/src/components/accordion/accordion"',
    ).join("\n"),
    /private vue implementation/,
  )
})

test("rejects unresolved files and missing private symbols", () => {
  assert.match(
    fixture("react", 'import { Missing } from "./missing-fixture"').join("\n"),
    /Cannot resolve/,
  )
  assert.match(
    fixture(
      "react",
      'import { Missing } from "../../packages/react/src/components/accordion/accordion"',
    ).join("\n"),
    /no runtime export Missing/,
  )
})

test("rejects missing core and SSR runtime exports", () => {
  for (const specifier of ["@marwes-ui/core", "@marwes-ui/react/ssr"]) {
    assert.match(
      fixture("react", `import { Missing } from "${specifier}"`).join("\n"),
      /no runtime export Missing/,
    )
  }
})

test("rejects unknown Marwes package subpaths", () => {
  assert.match(
    fixture("react", 'import { Missing } from "@marwes-ui/react/does-not-exist"').join("\n"),
    /Cannot resolve fixture import @marwes-ui\/react\/does-not-exist/,
  )
})

test("accepts core runtime and type-only exports", () => {
  assert.deepEqual(
    fixture("react", 'import { IconName, type ContextMenuEntry } from "@marwes-ui/core"'),
    [],
  )
})

for (const adapter of ["react", "vue", "svelte"]) {
  test(`${adapter}: accepts SSR subpath runtime and type-only exports`, () => {
    assert.deepEqual(
      fixture(
        adapter,
        `import { createMarwesThemeScript, type MarwesThemeScriptOptions } from "@marwes-ui/${adapter}/ssr"`,
      ),
      [],
    )
  })
}
