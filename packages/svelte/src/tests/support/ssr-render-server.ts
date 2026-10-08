/**
 * Vitest global setup: serves server-compiled Svelte renders to the jsdom tests.
 *
 * A component is compiled for either the server or the client, and the jsdom test environment
 * compiles for the client. Hydration tests need both, so server markup is rendered here (in plain
 * Node, through Vite's SSR loader) and fetched by the tests over a local port.
 */
import { createServer as createHttpServer } from "node:http"
import type { AddressInfo } from "node:net"
import { createServer as createViteServer } from "vite"
import type { TestProject } from "vitest/node"

interface RenderRequest {
  componentPath: string
  props: Record<string, unknown>
}

export default async function setup(project: TestProject): Promise<() => Promise<void>> {
  const vite = await createViteServer({
    configFile: "vitest.config.ts",
    // The test config resolves the browser build of Svelte; server renders need the server build.
    resolve: { conditions: [] },
    ssr: { resolve: { conditions: ["node"] } },
    // HMR changes the compiled output (extra anchors around components and render tags), so a dev
    // server with HMR on produces server markup that the HMR-less test client cannot hydrate.
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "error",
  })

  const httpServer = createHttpServer(async (request, response) => {
    let body = ""
    for await (const chunk of request) {
      body += chunk
    }

    try {
      const { componentPath, props } = JSON.parse(body) as RenderRequest
      const component = await vite.ssrLoadModule(componentPath)
      const { render } = await vite.ssrLoadModule("svelte/server")
      const output = render(component.default, { props })
      response.end(output.body)
    } catch (error) {
      console.error("SSR render server error:", error)
      response.statusCode = 500
      // Test-only server on localhost: the body is what surfaces the cause in the failing test.
      response.end(String(error))
    }
  })

  await new Promise<void>((resolve) => httpServer.listen(0, "127.0.0.1", resolve))
  project.provide("ssrRenderPort", (httpServer.address() as AddressInfo).port)

  return async () => {
    httpServer.close()
    await vite.close()
  }
}

declare module "vitest" {
  export interface ProvidedContext {
    ssrRenderPort: number
  }
}
