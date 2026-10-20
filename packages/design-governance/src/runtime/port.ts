import { createServer } from "node:net"
/** Vite interprets port zero as its default port; supply a real allocated loopback port. */
export async function allocateLoopbackPort(): Promise<number> {
  const server = createServer()
  await new Promise<void>((done, error) => {
    server.once("error", error)
    server.listen(0, "127.0.0.1", done)
  })
  const address = server.address()
  if (!address || typeof address === "string") {
    server.close()
    throw Error("No free loopback port")
  }
  await new Promise<void>((done, error) => server.close((cause) => (cause ? error(cause) : done())))
  return address.port
}
