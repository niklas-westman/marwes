# A11y Activation Checklist

Goal: promote Storybook accessibility checks deliberately, one story file at a time, for both React and Vue.

Do not flip the global Storybook a11y default to `error` until the story set is clean. Keep the global default as `off`, then opt in each story family with `storybookA11yPolicy.smoke`.

## Promotion Progress

- [x] `Divider/Atom` React story promoted and passing.
- [x] `Divider/Atom` Vue story promoted and passing.
- [x] `Heading/Atom` React story promoted and passing.
- [x] `Heading/Atom` Vue story promoted and passing.
- [x] `Paragraph/Atom` React story promoted and passing.
- [x] `Paragraph/Atom` Vue story promoted and passing.
- [x] All React stories in `apps/storybook-react/src/stories/**` promoted with `storybookA11yPolicy.smoke`.
- [x] All Vue stories in `apps/storybook-vue/src/stories/**` promoted with `storybookA11yPolicy.smoke`.
- [x] React Storybook a11y smoke suite passing: 110 files, 368 tests.
- [x] Vue Storybook a11y smoke suite passing: 103 files, 348 tests.

## React Storybook

- [x] Pick one React story file in `apps/storybook-react/src/stories/**`.
- [x] Import `storybookA11yPolicy` from `@marwes-ui/core`.
- [x] Add `...storybookA11yPolicy.smoke` to the story file `meta.parameters`.

```ts
parameters: {
  ...storybookLayout.padded,
  ...storybookA11yPolicy.smoke,
},
```

- [x] Run the focused Storybook browser test for that story file.

```sh
pnpm --filter ./apps/storybook-react exec vitest run --config vite.config.ts --project storybook path/to/story.stories.tsx
```

- [x] Fix every reported a11y issue in that story file.
- [x] Prefer semantic HTML over ARIA patches. For example, use `output aria-busy="true" aria-label="..."` for standalone loading regions instead of `aria-label` on a plain `div`.
- [x] Re-run the focused Storybook browser test until it passes.
- [x] Run Biome on the changed file.

```sh
pnpm exec biome check path/to/story.stories.tsx
```

- [x] Move to the next React story file only after the current one passes.

## Vue Storybook

- [x] Pick one Vue story file in `apps/storybook-vue/src/stories/**`.
- [x] Import `storybookA11yPolicy` from `@marwes-ui/core`.
- [x] Add `...storybookA11yPolicy.smoke` to the story file `meta.parameters`.

```ts
parameters: {
  ...storybookLayout.padded,
  ...storybookA11yPolicy.smoke,
},
```

- [x] Run the focused Storybook browser test for that story file.

```sh
pnpm --filter ./apps/storybook-vue exec vitest run --config vite.config.ts --project storybook path/to/story.stories.ts
```

- [x] Fix every reported a11y issue in that story file.
- [x] Prefer semantic HTML over ARIA patches. For example, use `output aria-busy="true" aria-label="..."` for standalone loading regions instead of `aria-label` on a plain `div`.
- [x] Re-run the focused Storybook browser test until it passes.
- [x] Run Biome on the changed file.

```sh
pnpm exec biome check path/to/story.stories.ts
```

- [x] Move to the next Vue story file only after the current one passes.

## Final Validation

- [x] Run the promoted React smoke set.

```sh
pnpm --filter ./apps/storybook-react test:a11y:smoke
```

- [x] Run the promoted Vue smoke set.

```sh
pnpm --filter ./apps/storybook-vue test:a11y:smoke
```

- [x] Run targeted taxonomy/docs tests for any story family whose titles or docs changed.
- [ ] Only consider changing the global Storybook a11y default to `error` after all stories are promoted and passing.
