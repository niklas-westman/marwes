<script lang="ts">
  import { mergeClass } from "../../internal/merge-class.js";
  import Toast from "./Toast.svelte";
  import type { ManagedToast, ToastContainerProps } from "./types.js";

  let {
    toasts,
    placement = "top-right",
    maxVisible,
    class: className,
    ondismiss,
  }: ToastContainerProps = $props();

  const mergedClass = $derived(
    mergeClass("mw-toast-container", `mw-toast-container--${placement}`, className)
  );

  const visibleToasts = $derived(
    maxVisible && maxVisible > 0 ? toasts.slice(-maxVisible) : toasts
  );

  function createDismissHandler(id: string): (() => void) | undefined {
    if (!ondismiss) return undefined;
    return () => ondismiss(id);
  }
</script>

<div class={mergedClass}>
  {#each visibleToasts as toast (toast.id)}
    <div
      class="mw-toast-container__item"
      onmouseenter={() => { /* pause timer — handled by provider */ }}
      onmouseleave={() => { /* resume timer — handled by provider */ }}
    >
      <Toast
        id={toast.id}
        {...(toast.class ? { class: toast.class } : {})}
        {...(toast.variant ? { variant: toast.variant } : {})}
        {...(toast.ariaLive ? { ariaLive: toast.ariaLive } : {})}
        {...(ondismiss ? { ondismiss: () => ondismiss(toast.id) } : {})}
        {...(toast.dataAttributes ? { dataAttributes: toast.dataAttributes } : {})}
      >
        {#snippet children()}{toast.message}{/snippet}
      </Toast>
    </div>
  {/each}
</div>
