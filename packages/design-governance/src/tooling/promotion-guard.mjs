import { existsSync, realpathSync } from "node:fs"
import { dirname, relative, resolve, sep } from "node:path"

export function refuseActivePromotion(command) {
  throw new Error(
    `${command} cannot write active references or receipts. Capture files outside the active family directories, then run pnpm --filter @marwes-ui/design-governance governance source-stage --family <family> --capture <capture.json>. Inspect with source-stage-preview --stage <stage-id>. Only an exact owner-authored approval permits source-apply --family <family> --stage <stage-id> --approval <approval.json>.`,
  )
}

function resolvedDestination(destination) {
  let ancestor = resolve(destination)
  const tail = []
  while (!existsSync(ancestor)) {
    tail.unshift(relative(dirname(ancestor), ancestor))
    const parent = dirname(ancestor)
    if (parent === ancestor) throw new Error(`Cannot resolve output path: ${destination}`)
    ancestor = parent
  }
  return resolve(realpathSync(ancestor), ...tail)
}

export function assertIncomingOutput(repoRoot, destination) {
  const families = resolvedDestination(
    resolve(repoRoot, "packages/design-governance/reflection-families"),
  )
  const incoming = resolve(families, "_incoming")
  if (resolvedDestination(incoming) !== incoming)
    refuseActivePromotion("Symlinked incoming staging directory")
  const target = resolvedDestination(destination)
  const subpath = relative(incoming, target)
  if (
    subpath === "" ||
    (!subpath.startsWith(`..${sep}`) && subpath !== ".." && !subpath.startsWith(sep))
  )
    return
  refuseActivePromotion("Legacy PNG sorting outside the incoming staging directory")
}
