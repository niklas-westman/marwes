import type { SwitchFieldProps } from "@marwes-ui/react"
import * as React from "react"
// Atom is no longer publicly exported; deep-import for story-helpers.
import {
  Switch,
  type SwitchProps,
} from "../../../../../packages/react/src/components/switch/switch"

type SwitchFieldComponent<TProps extends SwitchFieldProps> = (props: TProps) => React.ReactElement

export function ToggleableSwitchStory(props: SwitchProps): React.ReactElement {
  const [checked, setChecked] = React.useState(props.checked ?? false)

  React.useEffect(() => {
    setChecked(props.checked ?? false)
  }, [props.checked])

  return (
    <Switch
      {...props}
      checked={checked}
      onCheckedChange={(nextChecked) => {
        props.onCheckedChange?.(nextChecked)
        setChecked(nextChecked)
      }}
    />
  )
}

export function createToggleableSwitchFieldRender<TProps extends SwitchFieldProps>(
  Component: SwitchFieldComponent<TProps>,
): (args: TProps) => React.ReactElement {
  return function ToggleableSwitchFieldRender(args: TProps): React.ReactElement {
    const [checked, setChecked] = React.useState(args.switch?.checked ?? false)

    React.useEffect(() => {
      setChecked(args.switch?.checked ?? false)
    }, [args.switch?.checked])

    return (
      <Component
        {...args}
        switch={{
          ...args.switch,
          checked,
          onCheckedChange: (nextChecked) => {
            args.switch?.onCheckedChange?.(nextChecked)
            setChecked(nextChecked)
          },
        }}
      />
    )
  }
}
