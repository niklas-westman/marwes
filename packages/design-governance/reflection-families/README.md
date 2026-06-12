# Reflection Families

This directory contains package-owned visual contracts for Reflection component
baselines.

Each family owns one `reflection-contract.json` plus its Figma-exported baseline
PNGs. Reflection configs, Figma export tooling, and cohesive validation should
read these contracts instead of maintaining separate case lists.

```text
packages/design-governance/reflection-families/<family>/
  reflection-contract.json
  baselines/
    <case>.chromium-linux.<mode>.png
```

Normal Reflection run output still belongs under `.reflection/` locally or
`artifacts/reflection/` in CI. Do not copy runtime evidence screenshots into
this directory. Baselines here must come from the Figma export workflow.
