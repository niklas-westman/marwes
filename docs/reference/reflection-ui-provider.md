# Marwes Reflection UI provider v1

This is the proposed Marwes integration contract for the separately developed
`reflection-check-ui`. It is not Reflection's native report schema or acceptance
of an external UI implementation.

```bash
pnpm governance:inventory
pnpm governance:provider
pnpm governance:ui
```

The running inspector serves `GET /api/provider/v1`. The CLI emits the same
versioned projection (normal pnpm command banners are separate from the JSON).
For a JSON-only integration, call `createUIProvider(repoRoot)` directly or read
the HTTP endpoint rather than parsing package-runner banners.

The envelope identifies `marwes.reflection-ui-provider/v1`, project,
implementations, integration readiness, capabilities, validation groups and the
public inventory. Public inventory describes active inputs; a selected family's
run may use an explicitly identified stage. Never merge their scope labels.

Each required item has a stable identity, dimensions, declared proof kinds,
source and gaps. Its implementation comparisons use exact group, case, mode,
adapter and run identities. Outcomes are supplied by governance policy. Artifacts
carry explicit roles, MIME types, SHA-256 hashes and URLs under `/api/artifact`.
Legacy artifacts without declared roles remain generic evidence; consumers must
not infer reference/actual roles from filename substrings.

Required rows and denominators always describe current requirements. Older
staged evidence may satisfy a row only when its requirement and fixture
definitions still match, including source, mode, viewport and path. Validated
PNG/WebP encoding changes preserve that identity. Changed or missing definitions
produce `unmatched` comparisons without inherited outcomes or artifacts; the
rows remain visible. Behavior obligations expose their behavior artifacts and
do not borrow visual measurements or Figma URLs from a shared fixture.

Resolve relative URLs against the provider server. A UI hosted at another origin
must use its own trusted server-side provider connection/proxy or serve under the
same origin; the existing local server does not grant arbitrary browser origins
access. An exported JSON manifest does not include image bytes and is not a
self-contained offline bundle.

Validation capability describes the existing structured `/api/jobs` endpoint.
Its capability header is obtained from the local catalog. Retain exact stage
identity for staged reruns. Acceptance and reference promotion capabilities remain
false; a viewer must not add an ungoverned approval/update action.

The external Reflection checkout currently provides a mockup, not a runnable
consumer. Therefore integration is `provider-ready-ui-unavailable`, and rollout
beyond Button remains blocked. Acceptance requires real Button evidence,
preserved missing rows/denominators, side-by-side/zoom/diff tools, artifact
integrity and staged reruns, plus an independent non-Marwes fixture.

Implementation and fixtures:

- `packages/design-governance/src/evidence/ui-provider.ts`
- `packages/design-governance/src/evidence/ui-provider.test.ts`
- `packages/design-governance/figma-governance-one/server/server.test.ts`

See the [rollout tracker](../guides/design-compliance-rollout.md).

## Reflection text diagnostics

Reflection 0.5.0 emits additive `reflection.text-diagnostics/v1` records under
`check.metadata.textDiagnostics` in its schema-2 report and in a separate HTML
report panel. These are diagnostic-only records, not additional Marwes passing
proof. The proposed Marwes provider does not yet project these records; never
assume its artifact roles or schema are identical to Reflection's record. A future
consumer must retain exact run/item/adapter/theme binding, source scope, unknown
version/font identity and the native visual outcome. An HTML report panel does
not meet the external interactive UI gate.
