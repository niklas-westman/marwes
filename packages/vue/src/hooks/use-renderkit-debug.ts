import type { Ref } from "vue"
import { watch } from "vue"

const RENDERKIT_EVENT = "marwes/renderkit/renderkit-update"
const RENDERKIT_DEBUG_FLAG = "__MARWES_RENDERKIT_DEBUG__"

function isRenderKitDebugEnabled(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const renderKitDebugWindow = window as Window & {
    [RENDERKIT_DEBUG_FLAG]?: boolean
  }

  return renderKitDebugWindow[RENDERKIT_DEBUG_FLAG] === true
}

export function useRenderKitDebug(renderKitRef: Ref<unknown>, componentName: string) {
  watch(
    renderKitRef,
    (renderKit) => {
      if (!isRenderKitDebugEnabled()) {
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
