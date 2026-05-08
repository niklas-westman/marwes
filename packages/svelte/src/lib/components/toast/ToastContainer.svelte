<script lang="ts">
  import { mergeClass } from "../../internal/merge-class.js";
  import ErrorToast from "./ErrorToast.svelte";
  import InfoToast from "./InfoToast.svelte";
  import SuccessToast from "./SuccessToast.svelte";
  import Toast from "./Toast.svelte";
  import WarningToast from "./WarningToast.svelte";
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
</script>

<div class={mergedClass}>
  {#each visibleToasts as toast (toast.id)}
    <div class="mw-toast-container__item">
      {#if toast.intent === "success"}
        <SuccessToast
          id={toast.id}
          {...(toast.class ? { class: toast.class } : {})}
          {...(toast.variant ? { variant: toast.variant } : {})}
          {...(toast.ariaLive ? { ariaLive: toast.ariaLive } : {})}
          {...(ondismiss ? { ondismiss: () => ondismiss(toast.id) } : {})}
          {...(toast.dataAttributes ? { dataAttributes: toast.dataAttributes } : {})}
        >
          {#snippet children()}{toast.message}{/snippet}
        </SuccessToast>
      {:else if toast.intent === "error"}
        <ErrorToast
          id={toast.id}
          {...(toast.class ? { class: toast.class } : {})}
          {...(toast.variant ? { variant: toast.variant } : {})}
          {...(toast.ariaLive ? { ariaLive: toast.ariaLive } : {})}
          {...(ondismiss ? { ondismiss: () => ondismiss(toast.id) } : {})}
          {...(toast.dataAttributes ? { dataAttributes: toast.dataAttributes } : {})}
        >
          {#snippet children()}{toast.message}{/snippet}
        </ErrorToast>
      {:else if toast.intent === "warning"}
        <WarningToast
          id={toast.id}
          {...(toast.class ? { class: toast.class } : {})}
          {...(toast.variant ? { variant: toast.variant } : {})}
          {...(toast.ariaLive ? { ariaLive: toast.ariaLive } : {})}
          {...(ondismiss ? { ondismiss: () => ondismiss(toast.id) } : {})}
          {...(toast.dataAttributes ? { dataAttributes: toast.dataAttributes } : {})}
        >
          {#snippet children()}{toast.message}{/snippet}
        </WarningToast>
      {:else if toast.intent === "info"}
        <InfoToast
          id={toast.id}
          {...(toast.class ? { class: toast.class } : {})}
          {...(toast.variant ? { variant: toast.variant } : {})}
          {...(toast.ariaLive ? { ariaLive: toast.ariaLive } : {})}
          {...(ondismiss ? { ondismiss: () => ondismiss(toast.id) } : {})}
          {...(toast.dataAttributes ? { dataAttributes: toast.dataAttributes } : {})}
        >
          {#snippet children()}{toast.message}{/snippet}
        </InfoToast>
      {:else}
        <Toast
          id={toast.id}
          {...(toast.class ? { class: toast.class } : {})}
          {...(toast.variant ? { variant: toast.variant } : {})}
          {...(toast.ariaLive ? { ariaLive: toast.ariaLive } : {})}
          {...(ondismiss ? { ondismiss: () => ondismiss(toast.id) } : {})}
          {...(toast.dataAttributes ? {
            dataAttributes: {
              ...toast.dataAttributes,
              ...(toast.intent ? { "data-intent": toast.intent } : {}),
            },
          } : (toast.intent ? { dataAttributes: { "data-intent": toast.intent } } : {}))}
        >
          {#snippet children()}{toast.message}{/snippet}
        </Toast>
      {/if}
    </div>
  {/each}
</div>
