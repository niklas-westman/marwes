# Outlined SVG source diagnostics

Use **Marwes Figma Bridge**, manifest
`packages/design-governance/figma-plugin/manifest.json`, for this export.
It scans local WebSocket ports **9223–9232**. Its existing connection to a
`figma-console-mcp` process on 9231 may remain open. The capture CLI opens another
available port in that range; it never replaces the existing listener.

**Marwes Reflection Frame Prep** is a different plugin, using ports 9243–9252.
Figma's native Dev Mode MCP server on 3845 is also separate. Neither is required
by this source export command.

After updating plugin code, close its window and run Plugins → Development →
Marwes Figma Bridge again. Keep the intended file open. The command is read-only:
it calls native SVG export with `svgOutlineText: true`, `svgSimplifyStroke: false`
and `svgIdAttribute: true`. It does not clone, flatten, rename or restyle nodes.

## Capture explicit source nodes

Verify the active desktop file URL and exact file name first. For the current
Marwes copy, the Refresh label example is:

```bash
pnpm reflection:figma:export-source-svg -- \
  --file-key nybMu3iJUnnOvWtuxjMG8b \
  --file-name 'Marwes governance — 2026-10-14' \
  --verified-file-url 'https://www.figma.com/design/nybMu3iJUnnOvWtuxjMG8b' \
  --node 'I3978:38909;3873:42870' \
  --node 'I3978:39216;3873:42870'
```

`--verified-file-url` is an explicit operator attestation of an independently
observed URL, needed only when Figma reports no file key. Do not supply it from a
filename guess. A non-null mismatching key is always rejected. A null reported key
remains null in the capture, with `caller-verified-file-name` verification; the
expected key is never substituted for a reported key. Duplicate matching clients
are rejected rather than selected arbitrarily.

The command accepts 1–16 unique explicit node IDs, including nested instance IDs.
Optional `--port` selects an exact free port from 9223–9232. Optional `--timeout`
sets 1–120000ms (default 30000). Live source capture is disabled in CI.

## Outputs and evidence scope

Each invocation creates a fresh `.reflection/figma-source-svg/<id>/` directory:

- Numbered `.svg` files contain outlined source geometry.
- `capture.json` records SHA-256 hashes, UTF-8 byte lengths, export settings,
  requested/reported file identity, node bounds, variable modes and typography,
  including styled text segments where available.
- Per-node failures are retained beside successful exports; partial batches exit
  nonzero. Missing, duplicated or foreign response nodes and unoutlined text are
  rejected by the CLI.

The capture is a **live diagnostic observation**, not a pinned source version,
approved reference or family certification. SVGs are limited to 2MiB each and
8MiB per batch. No active baseline, compact snapshot or approval record is written.
Inspect source glyphs against runtime font outlines to diagnose font/rendering
differences; do not render source text outlines as a replacement component label.

On 2026-10-15, the updated plugin successfully exported both Refresh labels:
two 5,511-byte SVGs, each containing a path and no text element. The capture used
port 9226 while the existing 9231 listener remained available. File identity was
independently checked against the native desktop URL and transparently recorded
as caller-verified because the plugin reported a null file key.
