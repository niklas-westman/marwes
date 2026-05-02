import {
  createRichTextRecipe,
  isRichTextHtmlEmpty,
  normalizeRichTextHtml,
  resolveRichTextAllowedFormats,
  richTextCommandByFormat,
} from "@marwes-ui/core"
import type { CssVars, RichTextFormat, RichTextOptions } from "@marwes-ui/core"
import * as React from "react"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { Icon } from "../icon"

type StyleWithVars = React.CSSProperties & CssVars

export type RichTextProps = RichTextOptions & {
  onValueChange?: (value: string) => void
  className?: string
}

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

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): (value: T | null) => void {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue

      if (typeof ref === "function") {
        ref(value)
        continue
      }
      ;(ref as React.MutableRefObject<T | null>).current = value
    }
  }
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

export const RichText = React.forwardRef<HTMLDivElement, RichTextProps>((props, forwardedRef) => {
  const kit = createRichTextRecipe(props)
  const allowedFormats = React.useMemo(
    () => resolveRichTextAllowedFormats(props.allowedFormats),
    [props.allowedFormats],
  )
  const normalizedControlledValue = React.useMemo(
    () => normalizeRichTextHtml(props.value),
    [props.value],
  )
  const initialUncontrolledValue = React.useMemo(
    () => normalizeRichTextHtml(props.defaultValue),
    [props.defaultValue],
  )
  const isControlled = props.value !== undefined
  const [uncontrolledHtml, setUncontrolledHtml] = React.useState(initialUncontrolledValue)
  const [isEditorEmpty, setIsEditorEmpty] = React.useState(
    isRichTextHtmlEmpty(isControlled ? normalizedControlledValue : initialUncontrolledValue),
  )
  const [activeFormats, setActiveFormats] = React.useState<RichTextFormat[]>([])
  const editorElementRef = React.useRef<HTMLDivElement | null>(null)

  useRenderKitDebug(kit, "RichText")

  const editorHtml = isControlled ? normalizedControlledValue : uncontrolledHtml
  const style = kit.vars as StyleWithVars
  const className = props.className ? `${kit.className} ${props.className}` : kit.className
  const showToolbar = !props.readOnly

  const syncEditorState = React.useCallback(
    (nextHtml: string) => {
      const normalizedHtml = normalizeRichTextHtml(nextHtml)
      const emptyState = isRichTextHtmlEmpty(normalizedHtml)

      if (!isControlled) {
        setUncontrolledHtml(normalizedHtml)
      }

      setIsEditorEmpty(emptyState)
      props.onValueChange?.(normalizedHtml)

      return normalizedHtml
    },
    [isControlled, props],
  )

  const refreshActiveFormats = React.useCallback(() => {
    setActiveFormats(getActiveFormatsFromSelection(editorElementRef.current))
  }, [])

  React.useLayoutEffect(() => {
    const editorElement = editorElementRef.current

    if (!editorElement) {
      return
    }

    const normalizedDomHtml = normalizeRichTextHtml(editorElement.innerHTML)

    if (normalizedDomHtml !== editorHtml) {
      editorElement.innerHTML = editorHtml
    }

    setIsEditorEmpty(isRichTextHtmlEmpty(editorHtml))
  }, [editorHtml])

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return undefined
    }

    const handleSelectionChange = () => {
      refreshActiveFormats()
    }

    document.addEventListener("selectionchange", handleSelectionChange)

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [refreshActiveFormats])

  const handleInput = () => {
    const editorElement = editorElementRef.current

    if (!editorElement || props.disabled || props.readOnly) {
      return
    }

    syncEditorState(editorElement.innerHTML)
    refreshActiveFormats()
  }

  const toggleFormat = (format: RichTextFormat) => {
    if (props.disabled || props.readOnly || typeof document === "undefined") {
      return
    }

    const commandDocument = getRichTextCommandDocument()
    const editorElement = editorElementRef.current

    if (!editorElement) {
      return
    }

    ensureEditorSelection(editorElement)
    const activeFormatsBeforeToggle = getActiveFormatsFromSelection(editorElement)

    if (exitActiveFormatAtCaret(editorElement, format)) {
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

      syncEditorState(editorElement.innerHTML)
      refreshActiveFormats()
      return
    }

    if (typeof commandDocument.execCommand === "function") {
      commandDocument.execCommand(richTextCommandByFormat[format])
    }

    syncEditorState(editorElement.innerHTML)
    refreshActiveFormats()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey) {
      return
    }

    const formatByKey: Partial<Record<string, RichTextFormat>> = {
      b: "bold",
      i: "italic",
      u: "underline",
    }

    const requestedFormat = formatByKey[event.key.toLowerCase()]

    if (!requestedFormat || !allowedFormats.includes(requestedFormat)) {
      return
    }

    event.preventDefault()
    toggleFormat(requestedFormat)
  }

  return (
    <div className={className} style={style} {...kit.dataAttributes}>
      {showToolbar && (
        <div className="mw-rich-text__toolbar" data-rich-text-toolbar>
          {allowedFormats.map((format) => {
            const isActive = activeFormats.includes(format)
            const iconName =
              format === "bold" ? "bold" : format === "italic" ? "italic" : "underline"

            return (
              <button
                key={format}
                type="button"
                className="mw-rich-text__toolbar-button"
                data-format={format}
                data-active={isActive ? "true" : undefined}
                aria-label={formatLabels[format]}
                aria-pressed={isActive}
                disabled={props.disabled}
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
                onClick={() => {
                  toggleFormat(format)
                }}
              >
                <Icon name={iconName} size="xs" decorative />
              </button>
            )
          })}
        </div>
      )}

      <div
        ref={mergeRefs(editorElementRef, forwardedRef)}
        className="mw-rich-text__editor"
        data-rich-text-editor
        data-empty={isEditorEmpty ? "true" : undefined}
        data-placeholder={props.placeholder}
        id={kit.a11y.id}
        role={kit.a11y.role}
        tabIndex={kit.a11y.tabIndex}
        aria-label={kit.a11y.ariaLabel}
        aria-labelledby={kit.a11y.ariaLabelledBy}
        aria-describedby={kit.a11y.ariaDescribedBy}
        aria-invalid={kit.a11y.ariaInvalid}
        aria-disabled={kit.a11y.ariaDisabled}
        aria-readonly={kit.a11y.ariaReadOnly}
        aria-required={kit.a11y.ariaRequired}
        aria-multiline={kit.a11y.ariaMultiline}
        contentEditable={!props.disabled && !props.readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={refreshActiveFormats}
        onBlur={() => {
          syncEditorState(editorElementRef.current?.innerHTML ?? "")
          setActiveFormats([])
        }}
      />

      {props.name && (
        <input type="hidden" name={props.name} value={editorHtml} disabled={props.disabled} />
      )}
    </div>
  )
})

RichText.displayName = "RichText"
