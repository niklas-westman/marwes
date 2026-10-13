import App from "../../client-app"
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ preference: string; strategy: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const p = await params
  const query = await searchParams
  return (
    <App
      preference={p.preference === "dark" ? "dark" : p.preference === "system" ? "system" : "light"}
      strategy={p.strategy === "inline" ? "inline" : "style-tag"}
      initialOpen={query.initialOpen === "1"}
      secondPage={query.view === "next"}
    />
  )
}
