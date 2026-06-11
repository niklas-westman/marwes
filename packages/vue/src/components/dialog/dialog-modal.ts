import type { VNodeChild } from "vue"
import { Teleport, computed, defineComponent, h, nextTick, ref, watch } from "vue"
import { Dialog, type DialogProps } from "./dialog"

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) {
    return []
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        "button:not([disabled])",
        "[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(","),
    ),
  ).filter(
    (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true",
  )
}

function focusFirstElement(container: HTMLElement | null): void {
  const focusableElements = getFocusableElements(container)
  const firstFocusable = focusableElements[0]

  if (firstFocusable) {
    firstFocusable.focus()
    return
  }

  container?.focus()
}

export type DialogFooterControls = {
  close: () => void
}

export type DialogModalTone = "default" | "calm"
export type DialogModalDivider = "visible" | "hidden"

export type DialogModalProps = Omit<DialogProps, "footer" | "onClose"> & {
  open?: boolean
  defaultOpen?: boolean
  closeOnEscape?: boolean
  closeOnScrimClick?: boolean
  restoreFocus?: boolean
  portalTarget?: HTMLElement | string | null
  overlayClassName?: string
  surfaceWidth?: string | number
  tone?: DialogModalTone
  divider?: DialogModalDivider
  footer?: VNodeChild | ((controls: DialogFooterControls) => VNodeChild)
}

function toCSSDimension(value: string | number | undefined): string | undefined {
  if (value === undefined) {
    return undefined
  }

  return typeof value === "number" ? `${value}px` : value
}

const dialogModalPropKeys = [
  "id",
  "title",
  "description",
  "size",
  "showFooter",
  "dismissible",
  "ariaLabel",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "className",
  "dataAttributes",
  "open",
  "defaultOpen",
  "closeOnEscape",
  "closeOnScrimClick",
  "restoreFocus",
  "portalTarget",
  "overlayClassName",
  "surfaceWidth",
  "tone",
  "divider",
  "footer",
] as const

export const DialogModal = defineComponent(
  (props: DialogModalProps, { slots, emit }) => {
    const internalOpen = ref(props.defaultOpen ?? false)
    const overlayRef = ref<HTMLDivElement | null>(null)
    const lastFocusedElementRef = ref<HTMLElement | null>(null)
    const isControlled = computed(() => props.open !== undefined)
    const resolvedOpen = computed(
      () => (isControlled.value ? props.open : internalOpen.value) ?? false,
    )
    const closeOnEscape = computed(() => props.closeOnEscape ?? true)
    const closeOnScrimClick = computed(() => props.closeOnScrimClick ?? true)
    const restoreFocus = computed(() => props.restoreFocus ?? true)

    const close = (): void => {
      if (!resolvedOpen.value) {
        return
      }

      if (!isControlled.value) {
        internalOpen.value = false
      }

      emit("update:open", false)
      emit("open-change", false)
    }

    watch(
      resolvedOpen,
      async (nextOpen, _previousOpen, onCleanup) => {
        if (!nextOpen || typeof document === "undefined") {
          return
        }

        const previousOverflow = document.body.style.overflow
        lastFocusedElementRef.value =
          document.activeElement instanceof HTMLElement ? document.activeElement : null
        document.body.style.overflow = "hidden"
        const handleDocumentKeydown = (event: KeyboardEvent) => {
          if (event.key === "Escape" && closeOnEscape.value) {
            event.preventDefault()
            close()
          }
        }

        document.addEventListener("keydown", handleDocumentKeydown)

        await nextTick()
        const dialogElement = overlayRef.value?.querySelector<HTMLElement>(".mw-dialog") ?? null
        focusFirstElement(dialogElement)

        onCleanup(() => {
          document.removeEventListener("keydown", handleDocumentKeydown)
          document.body.style.overflow = previousOverflow

          if (restoreFocus.value) {
            lastFocusedElementRef.value?.focus()
          }
        })
      },
      { immediate: true },
    )

    const footerContent = computed<VNodeChild | undefined>(() => {
      if (slots.footer) {
        return slots.footer({ close })
      }

      if (typeof props.footer === "function") {
        return props.footer({ close })
      }

      return props.footer
    })

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && closeOnEscape.value) {
        event.preventDefault()
        event.stopPropagation()
        close()
        return
      }

      if (event.key !== "Tab") {
        return
      }

      const dialogElement = overlayRef.value?.querySelector<HTMLElement>(".mw-dialog") ?? null
      const focusableElements = getFocusableElements(dialogElement)

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogElement?.focus()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable?.focus()
      } else if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable?.focus()
      }
    }

    return () => {
      if (!resolvedOpen.value) {
        return null
      }

      const modalMarkup = h(
        "div",
        {
          ref: overlayRef,
          class: ["mw-dialog-modal", props.overlayClassName].filter(Boolean).join(" "),
          style:
            props.surfaceWidth === undefined
              ? undefined
              : { "--mw-dialog-surface-width": toCSSDimension(props.surfaceWidth) },
          "data-surface-width": props.surfaceWidth === undefined ? undefined : "custom",
          "data-tone": props.tone ?? "default",
          "data-divider": props.divider ?? "visible",
          onClick: (event: MouseEvent) => {
            if (event.target === event.currentTarget && closeOnScrimClick.value) {
              close()
            }
          },
          onKeydown: handleKeydown,
        },
        [
          h("div", {
            class: "mw-dialog-modal__scrim",
            "aria-hidden": "true",
            onClick: () => {
              if (closeOnScrimClick.value) {
                close()
              }
            },
          }),
          h("div", { class: "mw-dialog-modal__surface" }, [
            h(
              Dialog as unknown as string,
              {
                ...props,
                footer: footerContent.value,
                modal: true,
                onClose: close,
              },
              slots.default ? { default: slots.default } : undefined,
            ),
          ]),
        ],
      )

      if (props.portalTarget === null) {
        return modalMarkup
      }

      return h(
        Teleport,
        { to: props.portalTarget ?? "body" },
        {
          default: () => modalMarkup,
        },
      )
    }
  },
  {
    name: "MarwesDialogModal",
    props: [...dialogModalPropKeys],
    emits: ["update:open", "open-change"],
  },
)
