# Storybook Docs Sync

Keep Introduction.mdx documentation consistent across all framework storybooks.

## The problem

Each storybook has its own `Introduction.mdx` per component family. The prose —
headings, descriptions, usage notes, accessibility notes, component references —
should be identical. Only code examples differ between frameworks.

Currently 23 out of 24 docs pages have drifted.

## The solution: shared doc contracts

A **doc contract** is a JSON file in `packages/core/src/storybook/docs/` that
defines all the shared prose for a component family's Introduction page. Each
storybook's Introduction.mdx is then **generated** from the contract plus
framework-specific code examples.

### Contract structure

```
packages/core/src/storybook/docs/
  toast.doc.json       ← shared prose
  toast.examples.tsx   ← React code examples (raw strings)
  toast.examples.svelte.ts
  toast.examples.vue.ts
```

### Contract JSON schema

```json
{
  "family": "toast",
  "title": "Toast Components",
  "storybookTitle": "Toast/Introduction",
  "intro": "Marwes provides toast feedback at three layers...",
  "sections": [
    {
      "heading": "Recommended: Purpose Components",
      "body": "Use purpose-built toasts when the message intent is already known:",
      "exampleKey": "purposeComponents",
      "dynamicLists": [
        { "type": "ol", "source": "toastWhyPurposeComponents" },
        { "type": "ul", "source": "toastPurposeComponentReference" }
      ]
    },
    {
      "heading": "Base: ToastContainer + useToast (Molecule)",
      "body": "Use `ToastProvider` plus `useToast` when...",
      "exampleKey": "moleculeUsage",
      "features": [
        "**Stacking and placement** — supports top/bottom plus left/right viewport placement",
        "**Imperative workflow support** — `useToast()` exposes `show`, `dismiss`, and `clear`"
      ]
    }
  ],
  "accessibilityNotes": "**Numeric-only badges always need `ariaLabel`.**...",
  "componentReference": [
    {
      "group": "Purpose Components",
      "components": [
        { "name": "SuccessToast", "description": "Positive completion and confirmation feedback" }
      ]
    }
  ],
  "storyCoverage": [
    "**Atom**: `Default`, `AllVariants`, `DarkVariants`"
  ]
}
```

### Example files

Each framework provides its code examples as a simple key→string map:

```ts
// toast.examples.tsx
export const toastExamples = {
  purposeComponents: `import { SuccessToast, ErrorToast } from "@marwes-ui/react"

<SuccessToast>Project saved.</SuccessToast>
<ErrorToast>Publishing failed.</ErrorToast>`,

  moleculeUsage: `import { ToastProvider, useToast } from "@marwes-ui/react"
...`,

  atomUsage: `import { Toast } from "@marwes-ui/react"
...`,
}
```

### Generator script

```bash
# Generate all Introduction.mdx files from contracts
pnpm docs:generate

# Check for drift (CI-friendly)
pnpm docs:check
```

The generator reads each `*.doc.json`, merges framework examples, and writes
the final `Introduction.mdx` to each storybook. The check command verifies
that generated files match what's on disk.

## File layout

```
packages/core/src/storybook/docs/
  ├─ toast.doc.json
  ├─ badge.doc.json
  ├─ avatar.doc.json
  ├─ ...
  └─ examples/
       ├─ toast.react.ts
       ├─ toast.svelte.ts
       ├─ toast.vue.ts
       ├─ badge.react.ts
       ├─ badge.svelte.ts
       ├─ badge.vue.ts
       └─ ...

scripts/
  └─ generate-storybook-docs.ts    ← generator + checker
```

## Workflow

1. Edit the `.doc.json` contract for shared prose changes
2. Edit `examples/<family>.<framework>.ts` for framework-specific code
3. Run `pnpm docs:generate` to regenerate all Introduction.mdx
4. Pre-push hook runs `pnpm docs:check` to catch drift

## CI integration

```yaml
- name: Check storybook docs sync
  run: pnpm docs:check
```

## Migration path

1. Start with one family (e.g. badge — already aligned)
2. Create the contract JSON and examples
3. Build the generator script
4. Verify it produces identical output
5. Migrate remaining families one at a time
6. Add `docs:check` to the pre-push hook

## Design decisions

- **JSON over MDX template**: JSON is easy to validate, diff, and process.
  MDX templating would be more complex and harder to lint.
- **Examples as TypeScript string exports**: Keeps syntax highlighting in
  editors, easy to lint framework code, and avoids template escaping issues.
- **Generated MDX committed to git**: Storybook reads MDX directly — no build
  step needed at dev time. The generator only runs when contracts change.
- **Story coverage stays in the contract**: Single source of truth for which
  stories each component should have, usable by both docs and the alignment
  audit script.
