import { spawnSync } from "node:child_process"
import { cp, mkdir, readFile } from "node:fs/promises"

const source = new URL("../figma-governance-one/ui/", import.meta.url)
const output = new URL("../dist/figma-governance-one/", import.meta.url)
const assets = ["index.html", "app.js", "styles.css"]

const syntax = spawnSync(process.execPath, ["--check", new URL("app.js", source).pathname], {
  stdio: "inherit",
})
if (syntax.status !== 0) process.exit(syntax.status ?? 1)

await mkdir(output, { recursive: true })
for (const asset of assets) {
  const content = await readFile(new URL(asset, source))
  if (!content.length) throw new Error(`UI asset is empty: ${asset}`)
  await cp(new URL(asset, source), new URL(asset, output))
}
console.log("Built figma-governance-one HTML, JavaScript and CSS assets")

const reportSource = new URL("../figma-governance-one/report/", import.meta.url)
const reportOutput = new URL("report/", output)
const reportSyntax = spawnSync(
  process.execPath,
  ["--check", new URL("report.js", reportSource).pathname],
  { stdio: "inherit" },
)
if (reportSyntax.status !== 0) process.exit(reportSyntax.status ?? 1)
await mkdir(reportOutput, { recursive: true })
for (const asset of ["shell.html", "report.js", "report.css"]) {
  const content = await readFile(new URL(asset, reportSource))
  if (!content.length) throw new Error(`Portable report asset is empty: ${asset}`)
  await cp(new URL(asset, reportSource), new URL(asset, reportOutput))
}
console.log("Built portable exact-run report assets")
