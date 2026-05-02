import {
  type TabGroupItemState,
  buildTabGroupA11yIds,
  moveTabSelection,
  resolveTabValue,
} from "@marwes-ui/core"
import { type VNodeChild, computed, defineComponent, h, ref, watch } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Paragraph } from "../paragraph"
import { Tab } from "./tab"

export type TabGroupItem = {
  value: string
  label: VNodeChild
  panel: VNodeChild
  disabled?: boolean
  ariaLabel?: string
}

export type TabGroupProps = {
  id?: string
  label?: VNodeChild
  ariaLabel?: string
  tabs: TabGroupItem[]
  activeTab?: string
  defaultActiveTab?: string
  dataAttributes?: Record<string, string>
  className?: string
}

export type TabPanelProps = {
  id: string
  tabId: string
  hidden?: boolean
  className?: string
}

const tabGroupPropKeys = [
  "id",
  "label",
  "ariaLabel",
  "tabs",
  "activeTab",
  "defaultActiveTab",
  "dataAttributes",
  "className",
] as const

const tabPanelPropKeys = ["id", "tabId", "hidden", "className"] as const

function hasContent(value: VNodeChild | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  return true
}

function toChildren(value: VNodeChild | undefined): VNodeChild[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value === undefined || value === null || value === false) {
    return []
  }

  return [value]
}

function focusTab(tabId: string): void {
  if (typeof document === "undefined") {
    return
  }

  const tab = document.getElementById(tabId)
  if (tab instanceof HTMLButtonElement) {
    tab.focus()
  }
}

function toItemState(tab: TabGroupItem): TabGroupItemState {
  const itemState: TabGroupItemState = { value: tab.value }

  if (tab.disabled) {
    itemState.disabled = true
  }

  return itemState
}

function renderPanelValue(value: VNodeChild | undefined): VNodeChild[] {
  if (typeof value === "string" || typeof value === "number") {
    return [
      h(
        Paragraph,
        { size: "md" },
        {
          default: () => [value],
        },
      ),
    ]
  }

  return toChildren(value)
}

export const TabPanel = defineComponent(
  (props: TabPanelProps, { attrs, slots }) => {
    return () =>
      h(
        "div",
        {
          ...attrs,
          id: props.id,
          role: "tabpanel",
          "aria-labelledby": props.tabId,
          class: mergeClassNames("mw-tab-group__panel", props.className, attrs.class),
          hidden: props.hidden,
          tabindex: props.hidden ? undefined : 0,
        },
        slots.default?.(),
      )
  },
  {
    name: "MarwesTabPanel",
    inheritAttrs: false,
    props: [...tabPanelPropKeys],
  },
)

export const TabGroup = defineComponent(
  (props: TabGroupProps, { attrs, emit }) => {
    const localId = createLocalId("mw-tab-group")
    const id = computed(() => props.id ?? localId)
    const hasLabel = computed(() => hasContent(props.label))
    const isControlled = computed(() => props.activeTab !== undefined)
    const itemStates = computed<TabGroupItemState[]>(() =>
      props.tabs.map((tab) => toItemState(tab)),
    )
    const internalActiveTab = ref<string | undefined>(
      resolveTabValue(itemStates.value, props.defaultActiveTab),
    )

    watch(
      itemStates,
      (nextStates) => {
        if (!isControlled.value) {
          internalActiveTab.value = resolveTabValue(
            nextStates,
            internalActiveTab.value ?? props.defaultActiveTab,
          )
        }
      },
      { immediate: true },
    )

    const resolvedActiveTab = computed(() =>
      resolveTabValue(
        itemStates.value,
        isControlled.value ? props.activeTab : internalActiveTab.value,
      ),
    )

    const a11yIds = computed(() =>
      buildTabGroupA11yIds({
        id: id.value,
        itemValues: props.tabs.map((tab) => tab.value),
        hasLabel: hasLabel.value,
      }),
    )

    const selectTab = (nextValue: string | undefined): void => {
      const resolvedValue = resolveTabValue(itemStates.value, nextValue)
      const currentValue = resolvedActiveTab.value

      if (!resolvedValue) {
        return
      }

      if (!isControlled.value) {
        internalActiveTab.value = resolvedValue
      }

      if (resolvedValue !== currentValue) {
        emit("update:activeTab", resolvedValue)
        emit("tab-change", resolvedValue)
      }
    }

    const handleKeydown = (event: KeyboardEvent): void => {
      let direction: "next" | "previous" | "start" | "end" | undefined

      switch (event.key) {
        case "ArrowRight":
          direction = "next"
          break
        case "ArrowLeft":
          direction = "previous"
          break
        case "Home":
          direction = "start"
          break
        case "End":
          direction = "end"
          break
        default:
          return
      }

      event.preventDefault()

      const nextValue = moveTabSelection(itemStates.value, resolvedActiveTab.value, direction)
      if (!nextValue) {
        return
      }

      selectTab(nextValue)
      const nextTabId = a11yIds.value.tabIds[nextValue]
      if (nextTabId) {
        focusTab(nextTabId)
      }
    }

    return () =>
      h(
        "section",
        {
          ...attrs,
          class: mergeClassNames("mw-tab-group", props.className, attrs.class),
          ...(props.dataAttributes ?? {}),
        },
        [
          hasLabel.value
            ? (() => {
                const paragraphProps: Record<string, unknown> = { size: "md" }
                const labelId = a11yIds.value.labelId ?? `${id.value}-label`

                if (labelId) {
                  paragraphProps.id = labelId
                }

                return h("div", { class: "mw-tab-group__header" }, [
                  h(Paragraph, paragraphProps, {
                    default: () => toChildren(props.label),
                  }),
                ])
              })()
            : null,

          h(
            "div",
            {
              id: a11yIds.value.tabListId,
              class: "mw-tab-group__list",
              role: "tablist",
              "aria-label": hasLabel.value ? undefined : (props.ariaLabel ?? "Tabs"),
              "aria-labelledby": hasLabel.value ? a11yIds.value.labelId : undefined,
              onKeydown: handleKeydown,
            },
            props.tabs.map((tab) =>
              (() => {
                const tabId = a11yIds.value.tabIds[tab.value] ?? `${id.value}-tab-${tab.value}`
                const panelId =
                  a11yIds.value.panelIds[tab.value] ?? `${id.value}-panel-${tab.value}`
                const tabProps: Record<string, unknown> = {
                  key: tab.value,
                  id: tabId,
                  selected: tab.value === resolvedActiveTab.value,
                  ariaControls: panelId,
                  onClick: () => selectTab(tab.value),
                }

                if (tab.disabled) {
                  tabProps.disabled = true
                }

                if (tab.ariaLabel) {
                  tabProps.ariaLabel = tab.ariaLabel
                }

                return h(Tab, tabProps, { default: () => toChildren(tab.label) })
              })(),
            ),
          ),

          h(
            "div",
            { class: "mw-tab-group__panels" },
            props.tabs.map((tab) =>
              (() => {
                const panelId =
                  a11yIds.value.panelIds[tab.value] ?? `${id.value}-panel-${tab.value}`
                const tabId = a11yIds.value.tabIds[tab.value] ?? `${id.value}-tab-${tab.value}`

                return h(
                  TabPanel,
                  {
                    key: tab.value,
                    id: panelId,
                    tabId,
                    hidden: tab.value !== resolvedActiveTab.value,
                  },
                  {
                    default: () => renderPanelValue(tab.panel),
                  },
                )
              })(),
            ),
          ),
        ],
      )
  },
  {
    name: "MarwesTabGroup",
    inheritAttrs: false,
    props: [...tabGroupPropKeys],
    emits: ["update:activeTab", "tab-change"],
  },
)
