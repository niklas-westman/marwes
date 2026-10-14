export function load({ params, url }) {
  return {
    preference:
      params.preference === "dark" ? "dark" : params.preference === "system" ? "system" : "light",
    strategy: params.strategy === "inline" ? "inline" : "style-tag",
    initialOpen: url.searchParams.get("initialOpen") === "1",
    secondPage: url.searchParams.get("view") === "next",
  }
}
