<script lang="ts" module>
  import { getContext, setContext } from "svelte";
  import type { ToastController } from "./types.js";

  const TOAST_CONTEXT_KEY = Symbol("marwes-toast");

  export function setToastContext(controller: ToastController): void {
    setContext(TOAST_CONTEXT_KEY, controller);
  }

  export function useToast(): ToastController {
    const ctx = getContext<ToastController | undefined>(TOAST_CONTEXT_KEY);
    if (!ctx) {
      throw new Error("ToastProvider is missing. Wrap your app in <ToastProvider />.");
    }
    return ctx;
  }
</script>

<script lang="ts">
  import ToastContainer from "./ToastContainer.svelte";
  import type { ManagedToast, ShowToastOptions, ToastProviderProps } from "./types.js";

  let {
    children,
    placement,
    maxVisible,
    defaultDuration,
    class: className,
  }: ToastProviderProps = $props();

  let toasts = $state<ManagedToast[]>([]);
  let nextId = $state(0);

  function show(options: ShowToastOptions): string {
    nextId += 1;
    const id = `mw-toast-${nextId}`;
    const duration = options.duration === undefined
      ? (defaultDuration === undefined ? 4000 : defaultDuration)
      : options.duration;

    toasts = [...toasts, { ...options, id, duration }];

    // Auto-dismiss timer
    if (duration !== null && duration !== undefined && duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }

    return id;
  }

  function dismiss(id: string): void {
    const toast = toasts.find((t) => t.id === id);
    toast?.ondismiss?.();
    toasts = toasts.filter((t) => t.id !== id);
  }

  function clear(): void {
    for (const toast of toasts) {
      toast.ondismiss?.();
    }
    toasts = [];
  }

  const controller: ToastController = { show, dismiss, clear };
  setToastContext(controller);
</script>

{@render children?.()}
<ToastContainer
  {toasts}
  ondismiss={dismiss}
  {...(placement ? { placement } : {})}
  {...(maxVisible !== undefined ? { maxVisible } : {})}
  {...(className ? { class: className } : {})}
/>
