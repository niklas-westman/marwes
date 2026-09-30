import { StrictMode, createElement } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app"

const root = document.getElementById("app")
if (!root) throw new Error("Missing #app root")

createRoot(root).render(createElement(StrictMode, null, createElement(App)))
