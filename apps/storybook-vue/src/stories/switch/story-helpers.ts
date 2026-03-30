import { Switch, type SwitchFieldProps, type SwitchProps } from "@marwes-ui/vue"
import { ref, watch } from "vue"

export function createToggleableSwitchRender(label: string): (args: SwitchProps) => object {
  return (args: SwitchProps) => ({
    components: { Switch },
    setup() {
      const checked = ref(args.checked ?? false)

      watch(
        () => args.checked,
        (nextChecked) => {
          checked.value = nextChecked ?? false
        },
      )

      return { args, checked, label }
    },
    template: `<Switch v-bind="args" v-model="checked">{{ label }}</Switch>`,
  })
}

export function createToggleableSwitchFieldRender<TProps extends SwitchFieldProps>(
  componentName: string,
  component: unknown,
): (args: TProps) => object {
  return (args: TProps) => ({
    components: { [componentName]: component as object },
    setup() {
      const enabled = ref(args.switch?.checked ?? false)

      watch(
        () => args.switch?.checked,
        (nextChecked) => {
          enabled.value = nextChecked ?? false
        },
      )

      return { args, enabled }
    },
    template: `<${componentName} v-bind="args" v-model="enabled" />`,
  })
}
