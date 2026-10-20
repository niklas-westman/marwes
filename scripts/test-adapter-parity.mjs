import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const check = resolve(dirname(fileURLToPath(import.meta.url)), "check-adapter-parity.mjs")
const cssImport = 'import "@marwes-ui/presets/firstEdition/styles.css"\n'

const adapters = {
  react: { root: "packages/react/src", components: "packages/react/src/components", ext: ".tsx" },
  vue: { root: "packages/vue/src", components: "packages/vue/src/components", ext: ".ts" },
  svelte: {
    root: "packages/svelte/src/lib",
    components: "packages/svelte/src/lib/components",
    ext: ".svelte",
  },
}

function write(root, path, content = "") {
  mkdirSync(dirname(join(root, path)), { recursive: true })
  writeFileSync(join(root, path), content)
}

/** A minimal repository in which one family, `button`, is complete in all three adapters. */
function fixture(config = {}) {
  const root = mkdtempSync(join(tmpdir(), "marwes-parity-"))
  for (const [name, adapter] of Object.entries(adapters)) {
    const family = join(adapter.components, "button")
    write(root, join(family, `button${adapter.ext === ".svelte" ? ".svelte" : adapter.ext}`))
    if (name === "svelte") write(root, join(family, "types.ts"))
    write(
      root,
      join(family, "index.ts"),
      'export { Button } from "./button"\nexport type { ButtonProps } from "./button"\n',
    )
    write(
      root,
      join(adapter.root, "index.ts"),
      `${cssImport}export { Button } from "./components/button"\nexport type { ButtonProps } from "./components/button"\n`,
    )
    write(
      root,
      `packages/${name}/package.json`,
      JSON.stringify({ dependencies: { "@marwes-ui/presets": "workspace:*" }, sideEffects: true }),
    )
  }
  write(root, "scripts/adapter-parity.config.json", JSON.stringify(config))
  return root
}

function run(root) {
  const result = spawnSync(process.execPath, [check], { cwd: root, encoding: "utf8" })
  return { status: result.status, output: `${result.stdout}${result.stderr}` }
}

const withFixture = (config, mutate, assertResult) => {
  const root = fixture(config)
  try {
    mutate?.(root)
    assertResult(run(root))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

test("a family complete in all three adapters passes", () => {
  withFixture({}, undefined, ({ status, output }) => {
    assert.equal(status, 0, output)
  })
})

test("a family missing from one adapter fails", () => {
  withFixture(
    {},
    (root) => rmSync(join(root, adapters.svelte.components, "button"), { recursive: true }),
    ({ status, output }) => {
      assert.equal(status, 1)
      assert.match(output, /missing-family-dir/)
      assert.match(output, /Svelte is missing the button family directory/)
    },
  )
})

test("an export present in two adapters and missing in the third fails", () => {
  withFixture(
    {},
    (root) =>
      write(
        root,
        join(adapters.vue.components, "button/index.ts"),
        'export { Button } from "./button"\n',
      ),
    ({ status, output }) => {
      assert.equal(status, 1)
      assert.match(output, /mismatched-family-type-export/)
      assert.match(output, /Vue button is missing type export ButtonProps/)
    },
  )
})

test("a family export missing from an adapter's package root fails", () => {
  withFixture(
    {},
    (root) => write(root, join(adapters.svelte.root, "index.ts"), cssImport),
    ({ status, output }) => {
      assert.equal(status, 1)
      assert.match(output, /missing-root-export/)
    },
  )
})

test("an adapter without a family barrel fails", () => {
  withFixture(
    {},
    (root) => rmSync(join(root, adapters.react.components, "button/index.ts")),
    ({ status, output }) => {
      assert.equal(status, 1)
      assert.match(output, /missing-family-barrel/)
    },
  )
})

test("a contract used by React and Vue but not Svelte fails", () => {
  withFixture(
    {},
    (root) => {
      write(root, "packages/react/src/button.test.tsx", 'runButtonContract("react")\n')
      write(root, "packages/vue/src/button.test.ts", 'runButtonContract("vue")\n')
    },
    ({ status, output }) => {
      assert.equal(status, 1)
      assert.match(output, /missing-contract-enrollment/)
      assert.match(output, /Svelte must enroll in runButtonContract/)
    },
  )
})

test("a package that stops importing the preset CSS fails", () => {
  withFixture(
    {},
    (root) =>
      write(
        root,
        join(adapters.vue.root, "index.ts"),
        'export { Button } from "./components/button"\n',
      ),
    ({ status, output }) => {
      assert.equal(status, 1)
      assert.match(output, /package-css-policy-mismatch/)
    },
  )
})

test("an exempt family is skipped", () => {
  withFixture(
    { excluded: { button: "test exemption" } },
    (root) => rmSync(join(root, adapters.svelte.components, "button"), { recursive: true }),
    ({ status, output }) => {
      assert.equal(status, 0, output)
    },
  )
})
