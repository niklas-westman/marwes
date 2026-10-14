import { readFile } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, resolve } from "node:path"
import { createMarwesThemeScript, createMarwesThemeStyle } from "@marwes-ui/react/ssr"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import App from "./dist-server/app.js"
const dist = resolve("dist")
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost")
    if (url.pathname.startsWith("/assets/") || url.pathname === "/favicon.svg") {
      const file = resolve(dist, `.${url.pathname}`)
      if (!file.startsWith(`${dist}/`)) {
        response.writeHead(403).end()
        return
      }
      response.setHeader(
        "content-type",
        { ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" }[extname(file)] ??
          "application/octet-stream",
      )
      response.end(await readFile(file))
      return
    }
    const [preference, strategy] = url.pathname.slice(1).split("/")
    const props = {
      preference: ["light", "dark", "system"].includes(preference) ? preference : "light",
      strategy: strategy === "inline" ? "inline" : "style-tag",
      initialOpen: url.searchParams.get("initialOpen") === "1",
      secondPage: false,
    }
    const markup = renderToString(createElement(App, props))
    const head = `<style nonce="ssr-fixture">${createMarwesThemeStyle({ target: "html" })}</style><script nonce="ssr-fixture">${createMarwesThemeScript({ target: "html", defaultPreference: props.preference, storageKey: "marwes-ssr-theme" })}</script><script nonce="ssr-fixture">window.__MARWES_SSR_PROPS=${JSON.stringify(props)}</script>`
    response.setHeader("content-type", "text/html")
    response.end(
      (await readFile(resolve(dist, "index.html"), "utf8"))
        .replace("<!--head-->", head)
        .replace("<!--app-html-->", markup),
    )
  } catch (error) {
    console.error(error)
    response.writeHead(500).end(String(error))
  }
}).listen(Number(process.env.PORT), "127.0.0.1")
