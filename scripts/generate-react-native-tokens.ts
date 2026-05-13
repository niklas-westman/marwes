import * as fs from "node:fs"
import * as path from "node:path"
import {
  generateFirstEditionNativeTokenData,
  nativeTokenOutputPath,
  repoRoot,
} from "./react-native-token-extractor"

const generated = generateFirstEditionNativeTokenData()

if (process.argv.includes("--check")) {
  const current = fs.existsSync(nativeTokenOutputPath)
    ? fs.readFileSync(nativeTokenOutputPath, "utf8")
    : ""
  if (current !== generated) {
    console.error("Generated native token data is out of date. Run: pnpm native-tokens:generate")
    process.exit(1)
  }

  console.log("Generated native token data is up to date.")
} else {
  fs.mkdirSync(path.dirname(nativeTokenOutputPath), { recursive: true })
  fs.writeFileSync(nativeTokenOutputPath, generated)
  console.log(`Generated ${path.relative(repoRoot, nativeTokenOutputPath)}`)
}
