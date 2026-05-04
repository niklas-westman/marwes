const routes = [
  {
    intent: "Build an app",
    docs: "docs/start-here.md → docs/guides/vite.md or docs/guides/next.md → docs/blocks/README.md",
    command: "pnpm validate:docs",
  },
  {
    intent: "Change a component",
    docs: "docs/start-here.md → docs/reference/repo-map.md → docs/reference/family-validation.md",
    command: "pnpm validate:family <family>",
  },
  {
    intent: "Update docs/registry/generated truth",
    docs: "docs/start-here.md → docs/reference/repo-map.md → docs/registry/README.md",
    command: "pnpm validate:docs",
  },
  {
    intent: "Check a branch quickly",
    docs: "docs/start-here.md → docs/reference/testing.md",
    command: "pnpm check:changed",
  },
  {
    intent: "Prepare release confidence",
    docs: "docs/start-here.md → docs/reference/governance.md → docs/reference/testing.md",
    command: "pnpm validate:release",
  },
]

console.log("Marwes repo routes")
console.log("")
console.log("Human entry: docs/start-here.md")
console.log("Spiderweb map: docs/reference/repo-map.md")
console.log("")

for (const route of routes) {
  console.log(`- ${route.intent}`)
  console.log(`  Docs: ${route.docs}`)
  console.log(`  Run:  ${route.command}`)
}
