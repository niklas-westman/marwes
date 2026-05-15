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

  type TimerState = {
    duration: number | null | undefined;
    focusInside: boolean;
    handle: ReturnType<typeof setTimeout> | null;
    pointerInside: boolean;
    remaining: number | null;
    startedAt: number | null;
  };

  const timerStates = new Map<string, TimerState>();

  function getTimerState(toast: ManagedToast): TimerState {
    let state = timerStates.get(toast.id);
    if (!state) {
      state = {
        duration: undefined,
        focusInside: false,
        handle: null,
        pointerInside: false,
        remaining: null,
        startedAt: null,
      };
      timerStates.set(toast.id, state);
    }
    return state;
  }

  function clearDismissTimer(state: TimerState): void {
    if (state.handle === null) return;
    clearTimeout(state.handle);
    state.handle = null;
    state.startedAt = null;
  }

  function scheduleDismissTimer(toast: ManagedToast, delay: number): void {
    const state = getTimerState(toast);
    if (!ondismiss || delay <= 0 || state.pointerInside || state.focusInside || state.handle !== null) {
      return;
    }

    state.startedAt = Date.now();
    state.handle = setTimeout(() => {
      state.handle = null;
      state.startedAt = null;
      state.remaining = 0;
      ondismiss?.(toast.id);
    }, delay);
  }

  function pauseDismissTimer(toast: ManagedToast): void {
    const state = getTimerState(toast);
    if (state.handle === null || state.startedAt === null) return;

    const elapsed = Date.now() - state.startedAt;
    state.remaining = Math.max((state.remaining ?? 0) - elapsed, 0);
    clearDismissTimer(state);
  }

  function resumeDismissTimer(toast: ManagedToast): void {
    const state = getTimerState(toast);
    if (state.pointerInside || state.focusInside || state.remaining === null || state.remaining <= 0) {
      return;
    }

    scheduleDismissTimer(toast, state.remaining);
  }

  $effect(() => {
    const visibleIds = new Set(visibleToasts.map((toast) => toast.id));

    for (const [id, state] of timerStates) {
      if (!visibleIds.has(id)) {
        clearDismissTimer(state);
        timerStates.delete(id);
      }
    }

    for (const toast of visibleToasts) {
      const state = getTimerState(toast);
      if (state.duration === toast.duration) continue;

      clearDismissTimer(state);
      state.duration = toast.duration;
      state.focusInside = false;
      state.pointerInside = false;
      state.remaining = toast.duration ?? null;

      if (toast.duration !== null && toast.duration !== undefined && toast.duration > 0) {
        scheduleDismissTimer(toast, toast.duration);
      }
    }
  });
</script>

<div class={mergedClass}>
  {#each visibleToasts as toast (toast.id)}
    <div
      class="mw-toast-container__item"
      role="presentation"
      onmouseenter={() => {
        const state = getTimerState(toast);
        state.pointerInside = true;
        pauseDismissTimer(toast);
      }}
      onmouseleave={() => {
        const state = getTimerState(toast);
        state.pointerInside = false;
        resumeDismissTimer(toast);
      }}
      onfocusin={() => {
        const state = getTimerState(toast);
        state.focusInside = true;
        pauseDismissTimer(toast);
      }}
      onfocusout={(event) => {
        const related = event.relatedTarget;
        if (related instanceof Node && event.currentTarget.contains(related)) return;

        const state = getTimerState(toast);
        state.focusInside = false;
        resumeDismissTimer(toast);
      }}
    >
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
