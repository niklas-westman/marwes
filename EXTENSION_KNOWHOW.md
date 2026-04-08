# EXTENSION_KNOWHOW.md

This document explains how I recommend testing the custom pi Storybook companion extension in **marwes**.

## Extension under test

Project-local extension path:

- `.pi/extensions/storybook-companion.ts`

This extension currently provides:

- `/story-map <family|path>`
- `/story-coverage <family|path>`
- `/story-impact <family|path>`
- `/story-review <family|path>`
- `/story-audit [family-prefix]`
- `/story-fix-plan <family|path>`
- `/story-audit-export [family-prefix]`
- `/story-fix-plan-export <family|path>`

It is Marwes-specific and understands both:

- `packages/react/src/components/<family>/`
- `apps/storybook-react/src/stories/<family>/`
- `packages/vue/src/components/<family>/`
- `apps/storybook-vue/src/stories/<family>/`

---

## 1. Start from the repo root

Work from:

- `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes`

Open pi in that directory:

```bash
cd /Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes
pi
```

Because the extension is project-local, pi should discover it from:

- `.pi/extensions/storybook-companion.ts`

If pi is already running, reload resources:

```text
/reload
```

---

## 2. Recommended smoke test sequence

Use `checkbox` first because it already has:

- React component files
- Vue component files
- React stories
- Vue stories
- docs
- tests
- taxonomy tests

### Step A — verify family mapping

```text
/story-map checkbox
```

Expected result:
- React section appears
- Vue section appears
- source files are listed
- story files are listed
- `Introduction.mdx` is listed for both frameworks if present
- tests are listed
- exports from `index.ts` are shown

If this fails, the extension is probably not loaded or pi is not running from the repo root.

### Step B — verify story coverage summary

```text
/story-coverage checkbox
```

Expected result:
- story export names are listed for React and Vue
- docs/test presence is shown
- warnings are minimal or none for `checkbox`
- cross-framework parity warnings should be low or zero if the family is aligned

### Step C — verify impact analysis from source

```text
/story-impact packages/react/src/components/checkbox/checkbox.tsx
```

Expected result:
- primary impact includes the target file and the matching React story
- secondary impact includes related wrapper files and parity-related Vue files where relevant

Then test Vue:

```text
/story-impact packages/vue/src/components/checkbox/checkbox.ts
```

Expected result:
- same kind of reasoning, but from the Vue side

### Step D — verify family review

```text
/story-review checkbox
```

Expected result:
- health score appears
- health label appears (`excellent`, `strong`, etc.)
- strengths are listed
- warnings are grouped as a normal review summary

### Step E — verify repo-wide audit

```text
/story-audit
```

Expected result:
- summary counts
- severity totals
- family health table
- families with findings sorted by severity/health
- strongest healthy families at the end

Then try a filtered audit:

```text
/story-audit check
```

Expected result:
- only families beginning with `check` are included

---

## 3. Recommended export tests

### Export audit markdown

```text
/story-audit-export
```

Expected result:
- writes latest file:
  - `.pi/reports/story-audit.md`
- writes timestamped snapshot:
  - `.pi/reports/story-audit-YYYYMMDD-HHMMSS.md`

Try a filtered export too:

```text
/story-audit-export checkbox
```

Expected result:
- `.pi/reports/story-audit-checkbox.md`
- `.pi/reports/story-audit-checkbox-YYYYMMDD-HHMMSS.md`

### Export fix plan markdown

```text
/story-fix-plan-export checkbox
```

Expected result:
- `.pi/reports/story-fix-plan-checkbox.md`
- `.pi/reports/story-fix-plan-checkbox-YYYYMMDD-HHMMSS.md`

The exported fix plan should contain markdown checkboxes:

```md
- [ ] ...
```

---

## 4. Recommended real validation workflow

After the smoke tests above, test the extension against a family that is more likely to have gaps.

### Suggested workflow

1. Find weak families:

```text
/story-audit
```

2. Pick one family with findings.

3. Inspect it:

```text
/story-review <family>
```

4. Generate cleanup checklist:

```text
/story-fix-plan <family>
```

5. Export the checklist:

```text
/story-fix-plan-export <family>
```

6. Implement fixes in the library.

7. Re-run:

```text
/story-review <family>
/story-audit <family-prefix>
```

This is the best way to validate that the extension is useful, not just technically working.

---

## 5. Recommended mutation tests

To really trust the extension, intentionally create a small mismatch and confirm the extension catches it.

## Safe examples

### Example A — title mismatch test
Temporarily change a story title in one family so it breaks Marwes taxonomy.

Then run:

```text
/story-review <family>
```

Expected result:
- title mismatch is reported
- severity should usually be `warning`

### Example B — export parity mismatch test
Temporarily remove one export from either:

- `packages/react/src/components/<family>/index.ts`
- or `packages/vue/src/components/<family>/index.ts`

Then run:

```text
/story-review <family>
/story-audit <family-prefix>
```

Expected result:
- export parity warning appears
- severity should usually be `critical`

### Example C — missing story test
Temporarily rename one story file so it no longer matches the component stem.

Then run:

```text
/story-coverage <family>
/story-fix-plan <family>
```

Expected result:
- missing story warning appears
- fix plan suggests creating/restoring the missing story file

After each mutation test, restore the original file state.

---

## 6. What good results look like

A healthy family should generally have:

- source dirs in both React and Vue
- Storybook dirs in both React and Vue
- `index.ts` in both adapters
- matching component stems
- matching story stems
- `Introduction.mdx`
- taxonomy test
- introduction docs test
- aligned exports between React and Vue
- high health score

For well-maintained families like `checkbox`, the extension should feel boring in a good way.

---

## 7. Recommended command set for daily use

### Family inspection

```text
/story-map checkbox
/story-review checkbox
/story-impact packages/react/src/components/checkbox/checkbox.tsx
```

### Repo health

```text
/story-audit
/story-audit-export
```

### Cleanup planning

```text
/story-fix-plan checkbox
/story-fix-plan-export checkbox
```

---

## 8. Troubleshooting

## Extension seems missing

Run:

```text
/reload
```

Then try command autocomplete with:

```text
/story-
```

If the commands do not appear, make sure pi was launched from the repo root.

## Output looks incomplete

Check that the family exists in both locations:

- `packages/react/src/components/<family>/`
- `packages/vue/src/components/<family>/`
- `apps/storybook-react/src/stories/<family>/`
- `apps/storybook-vue/src/stories/<family>/`

## Export files not found

Look under:

- `.pi/reports/`

---

## 9. Suggested follow-up improvements

Once this extension feels stable in daily use, good next upgrades would be:

- audit diff between two markdown snapshots
- stronger title/taxonomy validation rules
- deeper export/API parity checks
- generated cleanup TODO grouped by framework
- optional repo-wide markdown dashboard committed to docs

---

## 10. Practical recommendation

If you only do one serious validation pass, do this:

```text
/reload
/story-audit
/story-review checkbox
/story-fix-plan checkbox
/story-audit-export
/story-fix-plan-export checkbox
```

That sequence is the fastest way to verify:
- discovery works
- family mapping works
- health scoring works
- export works
- fix-plan generation is useful in real Marwes work
