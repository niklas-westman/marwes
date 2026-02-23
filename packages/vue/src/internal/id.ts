let generatedIdCounter = 0

export function createLocalId(prefix: string): string {
  generatedIdCounter += 1
  return `${prefix}-${generatedIdCounter}`
}
