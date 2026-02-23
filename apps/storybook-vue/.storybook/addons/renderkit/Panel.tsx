import { createElement, useEffect, useState } from "react"

const RENDERKIT_EVENT = "marwes/renderkit/renderkit-update"

export const RenderKitPanel = ({ active }) => {
  const [renderKit, setRenderKit] = useState(null)

  useEffect(() => {
    const handleRenderKit = (event) => {
      console.log("[RenderKit Panel] Event received:", event.detail)
      setRenderKit(event.detail)
    }

    if (typeof window !== "undefined") {
      console.log("[RenderKit Panel] Registering event listener")
      window.addEventListener(RENDERKIT_EVENT, handleRenderKit)
      return () => {
        window.removeEventListener(RENDERKIT_EVENT, handleRenderKit)
      }
    }
  }, [])

  if (!active) return null

  if (!renderKit) {
    return createElement(
      "div",
      {
        style: { padding: "20px", color: "#999", textAlign: "center" },
      },
      "No RenderKit data available. Select a component story to see data.",
    )
  }

  return createElement(
    "div",
    {
      style: {
        padding: "16px",
        fontFamily: "monospace",
        fontSize: "13px",
        overflow: "auto",
      },
    },
    createElement(
      "pre",
      {
        style: { background: "#f5f5f5", padding: "12px", borderRadius: "4px" },
      },
      JSON.stringify(renderKit, null, 2),
    ),
  )
}
