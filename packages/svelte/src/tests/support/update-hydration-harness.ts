import { render } from "@testing-library/svelte"
import { hydrateFromServerMarkup } from "./hydrate-from-server"

export type SvelteComponent = Parameters<typeof render>[0]

export function createUpdateHydrationHarness<Props extends object>(options: {
  component: SvelteComponent
  componentPath: string
  toSvelteProps: (props: Props) => Record<string, unknown>
}) {
  let rerenderComponent: ((props: Record<string, unknown>) => Promise<void>) | undefined
  let renderedKeys: string[] = []

  return {
    render(props: Props) {
      const svelteProps = options.toSvelteProps(props)
      renderedKeys = Object.keys(svelteProps)
      rerenderComponent = render(options.component, { props: svelteProps }).rerender
    },
    async rerender(props: Props) {
      const svelteProps = options.toSvelteProps(props)
      // rerender() only assigns the props it is given, so a prop dropped between renders (an error
      // that goes away) would keep its previous value unless it is cleared explicitly.
      const clearedProps = Object.fromEntries(
        renderedKeys.filter((key) => !(key in svelteProps)).map((key) => [key, undefined]),
      )
      renderedKeys = [...new Set([...renderedKeys, ...Object.keys(svelteProps)])]

      await rerenderComponent?.({ ...clearedProps, ...svelteProps })
    },
    hydrate(props: Props) {
      const clientProps = options.toSvelteProps(props)
      const serverProps = Object.fromEntries(
        Object.entries(clientProps).filter(([, value]) => typeof value !== "function"),
      )

      return hydrateFromServerMarkup({
        componentPath: options.componentPath,
        component: options.component as never,
        serverProps,
        clientProps,
      })
    },
  }
}
