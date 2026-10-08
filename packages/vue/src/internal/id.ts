import { useId } from "vue"

/**
 * Must run during component setup. Vue's useId() derives the id from the component's position in
 * the tree, so server and client agree and hydration does not mismatch.
 */
export function createLocalId(prefix: string): string {
  return `${prefix}-${useId()}`
}

let runtimeIdCounter = 0

/**
 * For ids created in response to user actions (never rendered on the server), where there is no
 * component setup to derive an id from.
 */
export function createRuntimeId(prefix: string): string {
  runtimeIdCounter += 1
  return `${prefix}-${runtimeIdCounter}`
}
