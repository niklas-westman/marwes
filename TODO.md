# TODO

- [ ] Configure the Codex Browser tool workflow so local visual checks can use the in-app browser directly.

  Status on 2026-05-22:
  - Browser plugin is installed and enabled.
  - `browser-client.mjs` exists at `~/.codex/plugins/cache/openai-bundled/browser/0.1.0-alpha2/scripts/browser-client.mjs`.
  - The plugin docs expect a Node REPL bridge (`mcp__node_repl__js`), but this Codex session does not expose it. `codex features list` also reports `js_repl` as removed, so this is not something the Marwes repo can fix directly.

- [x] Configure the available Playwright MCP fallback to use an installed browser.

  Done on 2026-05-22:
  - Updated the user-wide Codex MCP config for `playwright` to use Brave:
    `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`
  - Restart Codex for the active Playwright MCP server to pick up the new executable path.
