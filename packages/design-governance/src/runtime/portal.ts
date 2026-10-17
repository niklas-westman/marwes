import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { type ViteDevServer, createServer } from "vite"
import type { Adapter } from "../contracts/report.js"
import { allocateLoopbackPort } from "./port.js"
export type PortalCase = {
  caseId: string
  mode: string
  portalPath: string
  viewportSize: { width: number; height: number }
  framing?: { background?: string; align?: "center" | "start"; padding?: number }
}
/** A fresh ephemeral Vite process always serves this checkout; no existing server reuse. */
export async function startPortal(repoRoot: string, adapter: Adapter, cases: PortalCase[]) {
  const parent = join(repoRoot, ".reflection")
  const { mkdir } = await import("node:fs/promises")
  await mkdir(parent, { recursive: true })
  const root = await mkdtemp(join(parent, "governance-portal-"))
  const entry = join(
    repoRoot,
    `tests/reflection/${adapter}-portal.${adapter === "react" ? "tsx" : "ts"}`,
  )
  await writeFile(
    join(root, "index.html"),
    '<html><head><meta charset="utf-8"></head><body><script type="module" src="/portal.js"></script></body></html>',
  )
  await writeFile(
    join(root, "portal.js"),
    `import {mountReflectionCase} from ${JSON.stringify(`/@fs/${entry}`)};
const cases=${JSON.stringify(cases)};
async function boot(){
 const c=cases.find(c=>c.portalPath===location.pathname); if(!c) throw Error('Unknown governed case');
 document.body.innerHTML='<main id="reflection-root"><div id="reflection-case-root"></div></main>';
 const frame=document.querySelector('#reflection-root'),root=document.querySelector('#reflection-case-root');
 const framing={background:'#ffffff',align:'center',padding:0,...c.framing};
 document.documentElement.style.cssText='margin:0;width:100%;height:100%;overflow:hidden;background:'+framing.background;
 document.body.style.cssText='margin:0;width:100%;height:100%;overflow:hidden;background:'+framing.background;
 Object.assign(frame.style,{boxSizing:'border-box',width:c.viewportSize.width+'px',height:c.viewportSize.height+'px',margin:'0',padding:framing.padding+'px',background:framing.background,overflow:'hidden',display:framing.align==='center'?'grid':'block'});
 if(framing.align==='center')frame.style.placeItems='center'; else {root.style.width='100%';root.style.height='100%';}
 await mountReflectionCase({id:c.caseId,path:c.portalPath,root,viewport:'governance',viewportSize:c.viewportSize,framing});
 await document.fonts.ready;
 window.__governanceReady=true;
}
boot().catch(error=>{window.__governanceError=String(error)});`,
  )
  let vite: ViteDevServer | undefined
  try {
    // Allocation and Vite binding are separate; retry a genuine bind race using another fresh port.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const port = await allocateLoopbackPort()
        vite = await createServer({
          root,
          configFile: join(repoRoot, `apps/storybook-${adapter}/reflection.vite.config.ts`),
          logLevel: "error",
          server: {
            host: "127.0.0.1",
            port,
            strictPort: true,
            hmr: false,
            fs: { allow: [repoRoot] },
          },
        })
        await vite.listen()
        break
      } catch (error) {
        await vite?.close()
        vite = undefined
        if (attempt === 2 || !String(error).includes("already in use")) throw error
      }
    }
    const server = vite
    const address = server?.httpServer?.address()
    if (!server || !address || typeof address === "string")
      throw Error("Portal has no loopback address")
    return {
      url: `http://127.0.0.1:${address.port}`,
      close: async () => {
        try {
          await server.close()
        } finally {
          await rm(root, { recursive: true, force: true })
        }
      },
    }
  } catch (error) {
    try {
      await vite?.close()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
    throw error
  }
}
