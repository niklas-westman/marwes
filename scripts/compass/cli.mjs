import { compassConfig } from "./config.mjs"

export function printCompass() {
  console.log("Marwes Compass")
  console.log("")
  console.log(`Human entry: ${compassConfig.entrypointPath}`)
  console.log(`Repo map: ${compassConfig.repoMapPath}`)
  console.log("")

  for (const route of compassConfig.routeModel) {
    console.log(`- ${route.intent}`)
    console.log(`  Docs: ${route.docs}`)
    console.log(`  Run:  ${route.command}`)
  }
}

printCompass()
