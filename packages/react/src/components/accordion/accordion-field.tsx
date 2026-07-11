/**
 * AccordionField (Molecule) — Recommended
 *
 * An accessible accordion group with field semantics: group label, optional
 * description, optional error, and coordinated open-state management.
 *
 * Composes `Accordion` atoms into a `role="group"` container with:
 * - a visible label wired via `aria-labelledby`
 * - optional `description` and `error` regions
 * - automatic `aria-describedby` wiring (description + error + external IDs)
 * - automatic `aria-invalid` when `error` is present
 * - controlled (`openItems` + `onOpenItemsChange`) or uncontrolled (`defaultOpenItems`) state
 * - single-open (`multiple=false`, default) or multi-open (`multiple=true`) behaviour
 *
 * Use `AccordionField` for most accordion groups. Use `Accordion` directly only
 * when you need a standalone collapsible panel outside of group semantics.
 *
 * @example Basic (uncontrolled, single-open)
 * ```tsx
 * <AccordionField
 *   label="FAQ"
 *   items={[
 *     { value: "q1", title: "What is Marwes?", content: <p>A design system.</p> },
 *     { value: "q2", title: "Is it free?", content: <p>Yes.</p> },
 *   ]}
 *   defaultOpenItems={["q1"]}
 * />
 * ```
 *
 * @example Multi-open, controlled
 * ```tsx
 * const [open, setOpen] = React.useState<string[]>([]);
 *
 * <AccordionField
 *   label="Settings"
 *   items={settingsItems}
 *   openItems={open}
 *   onOpenItemsChange={setOpen}
 *   multiple
 * />
 * ```
 */

import { buildAccordionFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { Accordion } from "./accordion"

export interface AccordionFieldItem {
  value: string
  title: React.ReactNode
  content?: React.ReactNode
  /** @deprecated Use `content` instead for cross-framework parity. */
  children?: React.ReactNode
  disabled?: boolean
}

export interface AccordionFieldProps {
  /** Visible label for the accordion group. */
  label: React.ReactNode

  /** Optional description text below the label. */
  description?: React.ReactNode

  /** Error message. When present, sets aria-invalid on the group. */
  error?: React.ReactNode

  /** Accordion items to render. */
  items: AccordionFieldItem[]

  /** Allow multiple items open simultaneously. Defaults to `true`. */
  multiple?: boolean

  /** Controlled: currently open item values. */
  openItems?: string[]

  /** Controlled: called with the new open-items array when state changes. */
  onOpenItemsChange?: (openItems: string[]) => void

  /** Uncontrolled: initially open item values. */
  defaultOpenItems?: string[]

  /** Disables all accordion items. */
  disabled?: boolean

  /** Explicit ID. If omitted, generated via useId(). */
  id?: string

  /** Additional aria-describedby IDs to merge with internal description/error IDs. */
  ariaDescribedBy?: string

  /** Data attributes for AI-friendly metadata (used by context variants). */
  dataAttributes?: Record<string, string>
}

function hasContent(value: React.ReactNode | undefined): boolean {
  if (value === undefined || value === null || value === false) return false
  if (typeof value === "string") return value.trim().length > 0
  return true
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function resolveAccordionItemContent(item: AccordionFieldItem): React.ReactNode {
  return item.content ?? item.children
}

export function AccordionField(props: AccordionFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-accordion-field-${reactId}`
  const multipleAllowed = props.multiple ?? true

  const hasDescription = hasContent(props.description)
  const hasError = hasContent(props.error)
  const isInvalid = hasError || false

  const { labelId, descriptionId, errorId, describedBy } = buildAccordionFieldA11yIds({
    id,
    hasDescription,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  // Controlled vs uncontrolled state
  const isControlled = props.openItems !== undefined
  const [internalOpenItems, setInternalOpenItems] = React.useState<string[]>(
    props.defaultOpenItems ?? [],
  )
  const openItems = isControlled ? (props.openItems ?? []) : internalOpenItems

  const handleToggle = (itemValue: string): void => {
    const isCurrentlyOpen = openItems.includes(itemValue)
    let nextOpenItems: string[]

    if (isCurrentlyOpen) {
      nextOpenItems = openItems.filter((v) => v !== itemValue)
    } else if (multipleAllowed) {
      nextOpenItems = [...openItems, itemValue]
    } else {
      nextOpenItems = [itemValue]
    }

    if (!isControlled) {
      setInternalOpenItems(nextOpenItems)
    }
    props.onOpenItemsChange?.(nextOpenItems)
  }

  const wrapperClass = cx(
    "mw-accordion-field",
    props.disabled && "mw-accordion-field--disabled",
    isInvalid && "mw-accordion-field--invalid",
  )

  return (
    <fieldset
      className={wrapperClass}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      aria-invalid={isInvalid ? true : undefined}
      {...props.dataAttributes}
    >
      <legend className="mw-accordion-field__label" id={labelId}>
        <Text variant="label">{props.label}</Text>
      </legend>

      <div className="mw-accordion-field__items">
        {props.items.map((item) => {
          const isDisabled = props.disabled || item.disabled || false
          const isOpen = openItems.includes(item.value)

          return (
            <Accordion
              key={item.value}
              id={`${id}-item-${item.value}`}
              title={item.title}
              open={isOpen}
              disabled={isDisabled}
              onToggle={() => handleToggle(item.value)}
            >
              {resolveAccordionItemContent(item)}
            </Accordion>
          )
        })}
      </div>

      {hasDescription && (
        <div className="mw-accordion-field__description" id={descriptionId}>
          <Text variant="caption">{props.description}</Text>
        </div>
      )}

      {hasError && (
        <div className="mw-accordion-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      )}
    </fieldset>
  )
}
