<script lang="ts">
  import { mergeClass } from "../../internal/merge-class.js";
  import Dialog from "./Dialog.svelte";
  import type { DialogModalProps } from "./types.js";

  let {
    open = $bindable(false),
    closeOnEscape = true,
    closeOnScrimClick = true,
    restoreFocus = true,
    onopenchange,
    overlayClass,
    footer,
    ...dialogProps
  }: DialogModalProps = $props();

  let overlayElement: HTMLDivElement | undefined = $state(undefined);
  let surfaceElement: HTMLDivElement | undefined = $state(undefined);
  let previouslyFocused: HTMLElement | null = $state(null);

  const mergedOverlayClass = $derived(mergeClass("mw-dialog-modal", overlayClass));

  function close(): void {
    if (!open) return;
    onopenchange?.(false);
    if (!onopenchange) {
      open = false;
    }
  }

  function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
      )
    ).filter(el => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true");
  }

  $effect(() => {
    if (open && typeof document !== "undefined") {
      const previousOverflow = document.body.style.overflow;
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      document.body.style.overflow = "hidden";

      // Focus first focusable element
      requestAnimationFrame(() => {
        const dialogEl = overlayElement?.querySelector<HTMLElement>(".mw-dialog") ?? null;
        const focusable = getFocusableElements(dialogEl);
        const firstEl = focusable[0];
        if (firstEl) {
          firstEl.focus();
        } else {
          dialogEl?.focus();
        }
      });

      return () => {
        document.body.style.overflow = previousOverflow;
        if (restoreFocus && previouslyFocused) {
          previouslyFocused.focus();
        }
      };
    }
  });

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape" && closeOnEscape) {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }

    if (e.key !== "Tab") return;

    const dialogEl = overlayElement?.querySelector<HTMLElement>(".mw-dialog") ?? null;
    const focusable = getFocusableElements(dialogEl);
    if (focusable.length === 0) {
      e.preventDefault();
      dialogEl?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first?.focus();
    }
  }

  function handleScrimClick(e: MouseEvent): void {
    if (!closeOnScrimClick) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (surfaceElement?.contains(target)) return;
    close();
  }
</script>

{#if open}
  <div
    bind:this={overlayElement}
    class={mergedOverlayClass}
    onclick={handleScrimClick}
    onkeydown={handleKeyDown}
    role="presentation"
  >
    <div class="mw-dialog-modal__scrim" aria-hidden="true"></div>
    <div bind:this={surfaceElement} class="mw-dialog-modal__surface">
      <Dialog {...dialogProps} modal onclose={close} {...(footer ? { footer } : {})} />
    </div>
  </div>
{/if}
