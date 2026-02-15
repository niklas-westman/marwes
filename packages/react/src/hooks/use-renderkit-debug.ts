import { useEffect } from "react"

const RENDERKIT_EVENT = "marwes/renderkit/renderkit-update"

export function useRenderKitDebug(renderKit: unknown, componentName: string) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(`[RenderKit Debug] ${componentName}:`, renderKit)
      const event = new CustomEvent(RENDERKIT_EVENT, {
        detail: {
          ...(renderKit as Record<string, unknown>),
          _meta: { component: componentName },
        },
      })
      window.dispatchEvent(event)
    }
  }, [renderKit, componentName])
}
