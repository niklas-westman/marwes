import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { runInNewContext } from "node:vm"

const workflow = readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8")

test("publishes with OIDC without an npm publishing token", () => {
  assert.match(workflow, /id-token: write/)
  assert.match(workflow, /node-version: 24/)
  assert.match(workflow, /package-manager-cache: false/)
  assert.doesNotMatch(workflow, /NPM_TOKEN|NODE_AUTH_TOKEN|_authToken|npm whoami/)
  assert.match(workflow, /needs: \[ci\]/)
  assert.match(workflow, /name: dist\s+path: packages/)
  assert.match(workflow, /changesets\/action@v1/)
  assert.match(workflow, /version: pnpm version-packages/)
  assert.match(workflow, /publish: pnpm release/)
  assert.match(workflow, /GITHUB_TOKEN: \$\{\{ secrets\.CHANGESETS_PR_TOKEN \}\}/)
})

const guard = workflow.match(/node <<'NODE'\n([\s\S]*?)\n\s+NODE/)?.[1]
assert.ok(guard, "The publish job must check npm's OIDC version requirement")

for (const [version, accepted] of [
  ["10.9.3", false],
  ["11.4.2", false],
  ["11.5.0", false],
  ["11.5.1", true],
  ["11.6.0", true],
  ["12.0.0", true],
  ["invalid", false],
]) {
  test(`npm preflight ${accepted ? "accepts" : "rejects"} ${version}`, () => {
    let exitCode = 0
    const errorMessages = []
    runInNewContext(guard, {
      require: () => ({ execFileSync: () => version }),
      console: { error: (message) => errorMessages.push(message) },
      process: {
        exit: (code) => {
          exitCode = code
        },
      },
    })
    assert.equal(exitCode, accepted ? 0 : 1)
    assert.equal(errorMessages.length, accepted ? 0 : 1)
  })
}
