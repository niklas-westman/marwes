import type { Ref } from "vue"
import { watch } from "vue"

const RENDERKIT_EVENT = "marwes/renderkit/renderkit-update"

export function useRenderKitDebug(renderKitRef: Ref<unknown>, componentName: string) {
  watch(
    renderKitRef,
    (renderKit) => {
      if (typeof window === "undefined") {
        return
      }

      const event = new CustomEvent(RENDERKIT_EVENT, {
        detail: {
          ...(renderKit as Record<string, unknown>),
          _meta: { component: componentName },
        },
      })

      window.dispatchEvent(event)
    },
    { deep: true, immediate: true },
  )
}
