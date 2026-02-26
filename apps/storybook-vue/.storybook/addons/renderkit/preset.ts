import { fileURLToPath } from "node:url"

export function managerEntries(entry: string[] = []) {
  const managerEntryPath = fileURLToPath(new URL("./manager.tsx", import.meta.url))
  return [...entry, managerEntryPath]
}

export default { managerEntries }
