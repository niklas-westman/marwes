import { buildRichTextFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Text } from "../text"
import { RichText, type RichTextProps } from "./rich-text"

export type RichTextFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  editor: RichTextProps
  ariaDescribedBy?: string
  modelValue?: string
}

const richTextFieldPropKeys = [
  "id",
  "label",
  "helperText",
  "error",
  "editor",
  "ariaDescribedBy",
  "modelValue",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export const RichTextField = defineComponent(
  (props: RichTextFieldProps, { emit, slots }) => {
    const localEditorId = createLocalId("mw-rich-text")
    const id = computed(() => props.id ?? localEditorId)

    const hasHelperText = computed(() => hasTextContent(props.helperText))
    const hasError = computed(() => hasTextContent(props.error))

    const a11yIds = computed(() =>
      buildRichTextFieldA11yIds({
        id: id.value,
        hasHelperText: hasHelperText.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const editorProps = computed<RichTextProps>(() => {
      const invalid = hasError.value || props.editor.invalid || false
      const nextEditorProps: RichTextProps = {
        ...props.editor,
        id: id.value,
        invalid,
        labelledBy: a11yIds.value.labelId,
      }

      if (props.modelValue !== undefined) {
        nextEditorProps.modelValue = props.modelValue
      }

      if (a11yIds.value.describedBy) {
        nextEditorProps.describedBy = a11yIds.value.describedBy
      }

      return nextEditorProps
    })

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-input-field",
        "mw-input-field--rich-text",
        props.editor.disabled && "mw-input-field--disabled",
        (hasError.value || props.editor.invalid) && "mw-input-field--invalid",
        props.editor.readOnly && "mw-input-field--readonly",
      ),
    )

    const labelContent = () => slots.label?.() ?? [props.label]
    const helperContent = () => slots.helper?.() ?? (props.helperText ? [props.helperText] : [])
    const errorContent = () => slots.error?.() ?? (props.error ? [props.error] : [])

    return () =>
      h("div", { class: wrapperClass.value }, [
        h(
          "button",
          {
            type: "button",
            class: "mw-input-field__label",
            id: a11yIds.value.labelId,
            onClick: () => {
              const editorElement = document.getElementById(id.value) as HTMLDivElement | null
              editorElement?.focus()
            },
          },
          [h(Text, { variant: "label" }, { default: labelContent })],
        ),

        h("div", { class: "mw-input-field__input-wrapper" }, [
          h(RichText, {
            ...editorProps.value,
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
            "onValue-change": (value: string) => emit("value-change", value),
          }),
        ]),

        hasHelperText.value && !hasError.value
          ? h("div", { class: "mw-input-field__helper", id: a11yIds.value.helperTextId }, [
              h(Text, { variant: "caption" }, { default: helperContent }),
            ])
          : null,

        hasError.value
          ? h(
              "div",
              {
                class: "mw-input-field__error",
                id: a11yIds.value.errorId,
                "aria-live": "polite",
              },
              [h(Text, { variant: "caption" }, { default: errorContent })],
            )
          : null,
      ])
  },
  {
    name: "MarwesRichTextField",
    props: [...richTextFieldPropKeys],
    emits: ["update:modelValue", "value-change"],
  },
)
