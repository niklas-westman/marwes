import {
  createRichTextRecipe,
  isRichTextHtmlEmpty,
  normalizeRichTextHtml,
  resolveRichTextAllowedFormats,
  richTextCommandByFormat,
} from "@marwes-ui/core"
import type { CssVars, RichTextFormat, RichTextOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"
import { Icon } from "../icon"

export type RichTextProps = RichTextOptions & {
  modelValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

const richTextPropKeys = [
  "id",
  "name",
  "value",
  "modelValue",
  "defaultValue",
  "placeholder",
  "disabled",
  "readOnly",
  "required",
  "tone",
  "invalid",
  "describedBy",
  "labelledBy",
  "ariaLabel",
  "allowedFormats",
  "onValueChange",
  "className",
] as const

const formatLabels: Record<RichTextFormat, string> = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
}

type RichTextCommandDocument = Document & {
  execCommand?: (commandId: string) => boolean
  queryCommandState?: (commandId: string) => boolean
}

function getRichTextCommandDocument(): RichTextCommandDocument {
  return document as unknown as RichTextCommandDocument
}

function isNodeWithinEditor(node: Node | null, editorElement: HTMLDivElement | null): boolean {
  if (!node || !editorElement) {
    return false
  }

  return editorElement.contains(node.nodeType === Node.TEXT_NODE ? node.parentNode : node)
}

function getActiveFormatsFromSelection(editorElement: HTMLDivElement | null): RichTextFormat[] {
  if (!editorElement || typeof window === "undefined" || typeof document === "undefined") {
    return []
  }

  const commandDocument = getRichTextCommandDocument()
  const selection = window.getSelection()
  const anchorNode = selection?.anchorNode ?? null

  if (!anchorNode || !isNodeWithinEditor(anchorNode, editorElement)) {
    return []
  }

  const activeFormats = new Set<RichTextFormat>()

  if (typeof commandDocument.queryCommandState === "function") {
    for (const format of Object.keys(richTextCommandByFormat) as RichTextFormat[]) {
      try {
        if (commandDocument.queryCommandState(richTextCommandByFormat[format])) {
          activeFormats.add(format)
        }
      } catch {
        // Ignore queryCommandState failures and fall back to DOM inspection below.
      }
    }
  }

  if (activeFormats.size > 0) {
    return Array.from(activeFormats)
  }

  let currentNode: Node | null =
    anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentNode : anchorNode

  while (currentNode && currentNode !== editorElement) {
    if (!(currentNode instanceof HTMLElement)) {
      currentNode = currentNode.parentNode
      continue
    }

    const tagName = currentNode.tagName.toLowerCase()

    if (tagName === "strong" || tagName === "b") activeFormats.add("bold")
    if (tagName === "em" || tagName === "i") activeFormats.add("italic")
    if (tagName === "u") activeFormats.add("underline")

    currentNode = currentNode.parentNode
  }

  return Array.from(activeFormats)
}

function ensureEditorSelection(editorElement: HTMLDivElement): void {
  if (typeof window === "undefined") {
    return
  }

  editorElement.focus()

  const selection = window.getSelection()
  const anchorNode = selection?.anchorNode ?? null

  if (anchorNode && isNodeWithinEditor(anchorNode, editorElement)) {
    return
  }

  const range = document.createRange()
  range.selectNodeContents(editorElement)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

function getFormatTagNames(format: RichTextFormat): string[] {
  if (format === "bold") return ["strong", "b"]
  if (format === "italic") return ["em", "i"]
  return ["u"]
}

function findNearestFormatElement(
  node: Node | null,
  editorElement: HTMLDivElement,
  format: RichTextFormat,
): HTMLElement | null {
  const tagNames = getFormatTagNames(format)
  let currentNode: Node | null = node?.nodeType === Node.TEXT_NODE ? node.parentNode : node

  while (currentNode && currentNode !== editorElement) {
    if (
      currentNode instanceof HTMLElement &&
      tagNames.includes(currentNode.tagName.toLowerCase())
    ) {
      return currentNode
    }

    currentNode = currentNode.parentNode
  }

  return null
}

function exitActiveFormatAtCaret(editorElement: HTMLDivElement, format: RichTextFormat): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    return false
  }

  const range = selection.getRangeAt(0)
  const anchorNode = selection.anchorNode

  if (!range.collapsed || !anchorNode || !isNodeWithinEditor(anchorNode, editorElement)) {
    return false
  }

  const formatElement = findNearestFormatElement(anchorNode, editorElement, format)

  if (!formatElement || !formatElement.parentNode) {
    return false
  }

  const trailingRange = document.createRange()
  trailingRange.setStart(range.startContainer, range.startOffset)
  trailingRange.setEndAfter(formatElement)

  const trailingFragment = trailingRange.extractContents()
  const caretTextNode = document.createTextNode("\u200B")
  const parentNode = formatElement.parentNode
  parentNode.insertBefore(caretTextNode, formatElement.nextSibling)
  parentNode.insertBefore(trailingFragment, caretTextNode.nextSibling)

  if (formatElement.textContent?.replaceAll("\u200B", "").trim().length === 0) {
    formatElement.remove()
  }

  const nextRange = document.createRange()
  nextRange.setStart(caretTextNode, 1)
  nextRange.collapse(true)
  selection.removeAllRanges()
  selection.addRange(nextRange)

  return true
}

export const RichText = defineComponent(
  (props: RichTextProps, { emit, expose }) => {
    const attrs = useAttrs()
    const kit = computed(() => createRichTextRecipe(props))
    const allowedFormats = computed(() => resolveRichTextAllowedFormats(props.allowedFormats))
    const normalizedControlledValue = computed(() =>
      normalizeRichTextHtml(props.modelValue ?? props.value),
    )
    const isControlled = computed(() => props.modelValue !== undefined || props.value !== undefined)
    const internalHtml = ref(normalizeRichTextHtml(props.defaultValue))
    const isEditorEmpty = ref(
      isRichTextHtmlEmpty(
        isControlled.value ? normalizedControlledValue.value : internalHtml.value,
      ),
    )
    const activeFormats = ref<RichTextFormat[]>([])
    const editorElement = ref<HTMLDivElement | null>(null)

    useRenderKitDebug(kit, "RichText")

    const editorHtml = computed(() =>
      isControlled.value ? normalizedControlledValue.value : internalHtml.value,
    )
    const showToolbar = computed(() => !props.readOnly)

    function syncEditorState(nextHtml: string): string {
      const normalizedHtml = normalizeRichTextHtml(nextHtml)
      isEditorEmpty.value = isRichTextHtmlEmpty(normalizedHtml)

      if (!isControlled.value) {
        internalHtml.value = normalizedHtml
      }

      props.onValueChange?.(normalizedHtml)
      emit("update:modelValue", normalizedHtml)
      emit("value-change", normalizedHtml)

      return normalizedHtml
    }

    function refreshActiveFormats(): void {
      activeFormats.value = getActiveFormatsFromSelection(editorElement.value)
    }

    function toggleFormat(format: RichTextFormat): void {
      if (props.disabled || props.readOnly || typeof document === "undefined") {
        return
      }

      const commandDocument = getRichTextCommandDocument()

      if (!editorElement.value) {
        return
      }

      ensureEditorSelection(editorElement.value)
      const activeFormatsBeforeToggle = getActiveFormatsFromSelection(editorElement.value)

      if (exitActiveFormatAtCaret(editorElement.value, format)) {
        if (
          typeof commandDocument.queryCommandState === "function" &&
          commandDocument.queryCommandState(richTextCommandByFormat[format]) &&
          typeof commandDocument.execCommand === "function"
        ) {
          commandDocument.execCommand(richTextCommandByFormat[format])
        }

        if (
          typeof commandDocument.queryCommandState === "function" &&
          typeof commandDocument.execCommand === "function"
        ) {
          for (const activeFormat of activeFormatsBeforeToggle) {
            if (activeFormat === format) {
              continue
            }

            if (!commandDocument.queryCommandState(richTextCommandByFormat[activeFormat])) {
              commandDocument.execCommand(richTextCommandByFormat[activeFormat])
            }
          }
        }

        syncEditorState(editorElement.value.innerHTML)
        refreshActiveFormats()
        return
      }

      if (typeof commandDocument.execCommand === "function") {
        commandDocument.execCommand(richTextCommandByFormat[format])
      }

      syncEditorState(editorElement.value?.innerHTML ?? "")
      refreshActiveFormats()
    }

    function handleSelectionChange(): void {
      refreshActiveFormats()
    }

    onMounted(() => {
      if (editorElement.value) {
        editorElement.value.innerHTML = editorHtml.value
        isEditorEmpty.value = isRichTextHtmlEmpty(editorHtml.value)
      }

      if (typeof document !== "undefined") {
        document.addEventListener("selectionchange", handleSelectionChange)
      }
    })

    onBeforeUnmount(() => {
      if (typeof document !== "undefined") {
        document.removeEventListener("selectionchange", handleSelectionChange)
      }
    })

    watch(
      editorHtml,
      (nextHtml) => {
        const currentElement = editorElement.value

        if (!currentElement) {
          return
        }

        const normalizedDomHtml = normalizeRichTextHtml(currentElement.innerHTML)

        if (normalizedDomHtml !== nextHtml) {
          currentElement.innerHTML = nextHtml
        }

        isEditorEmpty.value = isRichTextHtmlEmpty(nextHtml)
      },
      { immediate: true },
    )

    expose({
      focus: () => editorElement.value?.focus(),
      element: editorElement,
    })

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      return h(
        "div",
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          class: className,
          style,
        },
        [
          showToolbar.value
            ? h(
                "div",
                { class: "mw-rich-text__toolbar", "data-rich-text-toolbar": "true" },
                allowedFormats.value.map((format) => {
                  const isActive = activeFormats.value.includes(format)
                  const iconName =
                    format === "bold" ? "bold" : format === "italic" ? "italic" : "underline"

                  return h(
                    "button",
                    {
                      key: format,
                      type: "button",
                      class: "mw-rich-text__toolbar-button",
                      "data-format": format,
                      "data-active": isActive ? "true" : undefined,
                      "aria-label": formatLabels[format],
                      "aria-pressed": isActive,
                      disabled: props.disabled,
                      onMousedown: (event: MouseEvent) => {
                        event.preventDefault()
                      },
                      onClick: () => {
                        toggleFormat(format)
                      },
                    },
                    [h(Icon, { name: iconName, size: "xs", decorative: true })],
                  )
                }),
              )
            : null,

          h("div", {
            ref: editorElement,
            class: "mw-rich-text__editor",
            "data-rich-text-editor": "true",
            "data-empty": isEditorEmpty.value ? "true" : undefined,
            "data-placeholder": props.placeholder,
            id: renderKit.a11y.id,
            role: renderKit.a11y.role,
            tabindex: renderKit.a11y.tabIndex,
            "aria-label": renderKit.a11y.ariaLabel,
            "aria-labelledby": renderKit.a11y.ariaLabelledBy,
            "aria-describedby": renderKit.a11y.ariaDescribedBy,
            "aria-invalid": renderKit.a11y.ariaInvalid,
            "aria-disabled": renderKit.a11y.ariaDisabled,
            "aria-readonly": renderKit.a11y.ariaReadOnly,
            "aria-required": renderKit.a11y.ariaRequired,
            "aria-multiline": renderKit.a11y.ariaMultiline,
            contenteditable: !props.disabled && !props.readOnly,
            onInput: () => {
              syncEditorState(editorElement.value?.innerHTML ?? "")
              refreshActiveFormats()
            },
            onKeydown: (event: KeyboardEvent) => {
              if (!(event.metaKey || event.ctrlKey) || event.altKey) {
                return
              }

              const formatByKey: Partial<Record<string, RichTextFormat>> = {
                b: "bold",
                i: "italic",
                u: "underline",
              }
              const requestedFormat = formatByKey[event.key.toLowerCase()]

              if (!requestedFormat || !allowedFormats.value.includes(requestedFormat)) {
                return
              }

              event.preventDefault()
              toggleFormat(requestedFormat)
            },
            onFocus: refreshActiveFormats,
            onBlur: () => {
              syncEditorState(editorElement.value?.innerHTML ?? "")
              activeFormats.value = []
            },
          }),

          props.name
            ? h("input", {
                type: "hidden",
                name: props.name,
                value: editorHtml.value,
                disabled: props.disabled,
              })
            : null,
        ],
      )
    }
  },
  {
    name: "MarwesRichText",
    inheritAttrs: false,
    props: [...richTextPropKeys],
    emits: ["update:modelValue", "value-change"],
  },
)
