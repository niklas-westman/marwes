import { buildAccordionFieldA11yIds } from "@marwes-ui/core"
import { type VNodeChild, computed, defineComponent, h, ref } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Paragraph } from "../paragraph"
import { Accordion } from "./accordion"

export interface AccordionFieldItem {
  value: string
  title: VNodeChild
  content: VNodeChild
  disabled?: boolean
}

export interface AccordionFieldProps {
  label: string
  description?: string
  error?: string
  items: AccordionFieldItem[]
  multiple?: boolean
  openItems?: string[]
  onOpenItemsChange?: (openItems: string[]) => void
  defaultOpenItems?: string[]
  disabled?: boolean
  id?: string
  ariaDescribedBy?: string
  dataAttributes?: Record<string, string>
  modelValue?: string[]
}

const accordionFieldPropKeys = [
  "label",
  "description",
  "error",
  "items",
  "multiple",
  "openItems",
  "onOpenItemsChange",
  "defaultOpenItems",
  "disabled",
  "id",
  "ariaDescribedBy",
  "dataAttributes",
  "modelValue",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
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

export const AccordionField = defineComponent(
  (props: AccordionFieldProps, { emit }) => {
    const localId = createLocalId("mw-accordion-field")
    const id = computed(() => props.id ?? localId)
    const multipleAllowed = computed(() => props.multiple ?? true)

    const hasDescription = computed(() => hasTextContent(props.description))
    const hasError = computed(() => hasTextContent(props.error))

    const a11yIds = computed(() =>
      buildAccordionFieldA11yIds({
        id: id.value,
        hasDescription: hasDescription.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const isControlled = computed(
      () => props.modelValue !== undefined || props.openItems !== undefined,
    )
    const internalOpenItems = ref<string[]>(props.defaultOpenItems ?? [])
    const currentOpenItems = computed(() => {
      if (props.modelValue !== undefined) return props.modelValue
      if (props.openItems !== undefined) return props.openItems
      return internalOpenItems.value
    })

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-accordion-field",
        props.disabled && "mw-accordion-field--disabled",
        hasError.value && "mw-accordion-field--invalid",
      ),
    )

    function handleToggle(itemValue: string): void {
      const isCurrentlyOpen = currentOpenItems.value.includes(itemValue)
      let nextOpenItems: string[]

      if (isCurrentlyOpen) {
        nextOpenItems = currentOpenItems.value.filter((v) => v !== itemValue)
      } else if (multipleAllowed.value) {
        nextOpenItems = [...currentOpenItems.value, itemValue]
      } else {
        nextOpenItems = [itemValue]
      }

      if (!isControlled.value) {
        internalOpenItems.value = nextOpenItems
      }
      props.onOpenItemsChange?.(nextOpenItems)
      emit("update:modelValue", nextOpenItems)
      emit("change", nextOpenItems)
    }

    return () =>
      h(
        "fieldset",
        {
          class: wrapperClass.value,
          "aria-labelledby": a11yIds.value.labelId,
          "aria-describedby": a11yIds.value.describedBy,
          "aria-invalid": hasError.value ? true : undefined,
          ...(props.dataAttributes ?? {}),
        },
        [
          h("legend", { class: "mw-accordion-field__label", id: a11yIds.value.labelId }, [
            h(Paragraph, { size: "md" }, { default: () => [props.label] }),
          ]),

          h(
            "div",
            { class: "mw-accordion-field__items" },
            props.items.map((item) => {
              const isDisabled = props.disabled || item.disabled || false
              const isOpen = currentOpenItems.value.includes(item.value)

              return h(
                Accordion as unknown as string,
                {
                  key: item.value,
                  id: `${id.value}-item-${item.value}`,
                  open: isOpen,
                  disabled: isDisabled,
                  onToggle: () => handleToggle(item.value),
                },
                {
                  title: () => toChildren(item.title),
                  default: () => toChildren(item.content),
                },
              )
            }),
          ),

          hasDescription.value
            ? h(
                "div",
                { class: "mw-accordion-field__description", id: a11yIds.value.descriptionId },
                [h(Paragraph, { size: "sm" }, { default: () => [props.description] })],
              )
            : null,

          hasError.value
            ? h(
                "div",
                {
                  class: "mw-accordion-field__error",
                  id: a11yIds.value.errorId,
                  "aria-live": "polite",
                },
                [h(Paragraph, { size: "sm" }, { default: () => [props.error] })],
              )
            : null,
        ],
      )
  },
  {
    name: "MarwesAccordionField",
    props: [...accordionFieldPropKeys],
    emits: ["update:modelValue", "change"],
  },
)
