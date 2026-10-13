export function trackHydrationNodes(container: HTMLElement): () => string[] {
  const controls = Array.from(
    container.querySelectorAll("input, select, textarea, [contenteditable]"),
  )
  const ids = Array.from(container.querySelectorAll("[id]")).map((node) => node.id)
  return () => {
    const issues: string[] = []
    for (const control of controls)
      if (!container.contains(control))
        issues.push("A server-rendered control was replaced during hydration")
    const hydratedIds = Array.from(container.querySelectorAll("[id]")).map((node) => node.id)
    if (JSON.stringify(ids) !== JSON.stringify(hydratedIds))
      issues.push("Server-rendered ids changed during hydration")
    if (new Set(hydratedIds).size !== hydratedIds.length) issues.push("Hydrated ids are duplicated")
    return issues
  }
}
