import { createElement } from "react"
import { hydrateRoot } from "react-dom/client"
import "@marwes-ui/presets/firstEdition/styles.css"
import App from "./app"
hydrateRoot(document.getElementById("root"), createElement(App, window.__MARWES_SSR_PROPS), {
  onRecoverableError: (error) => console.error(error),
})
