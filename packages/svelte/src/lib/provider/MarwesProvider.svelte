<script lang="ts">
  import {
    ThemeMode as MwThemeMode,
    nextThemeMode,
    resolveThemeInput,
    resolveThemePreference,
  } from "@marwes-ui/core";
  import type { ResolvedTheme, ThemeMode, ThemePreference } from "@marwes-ui/core";
  import { setMarwesContext } from "./context.js";
  import { applyThemeToElement, loadThemeFonts, themeToRootStyle } from "./runtime-theme.js";
  import {
    applyModeAttribute,
    getSystemThemeMode,
    readStoredThemePreference,
    subscribeToSystemThemeMode,
    withoutModeTransitions,
    writeStoredThemePreference,
  } from "./theme-mode-runtime.js";
  import type { MarwesContextState, MarwesProviderProps } from "./types.js";

  let {
    theme,
    defaultPreference,
    preference: controlledPreference,
    defaultMode,
    mode: controlledMode,
    fontLoading = "auto",
    onPreferenceChange,
    onModeChange,
    storageKey = false,
    enableSystem = true,
    target = "provider",
    attribute = "class",
    disableTransitionOnChange = false,
    variableStrategy = "inline",
    children,
  }: MarwesProviderProps = $props();

  let rootElement: HTMLDivElement | undefined = $state(undefined);

  let internalPreference = $state<ThemePreference>(
    defaultPreference ?? defaultMode ?? MwThemeMode.light
  );

  let systemMode = $state<ThemeMode>(
    enableSystem ? getSystemThemeMode() : MwThemeMode.light
  );

  const activePreference = $derived(
    controlledPreference ?? controlledMode ?? theme?.mode ?? internalPreference
  );

  const activeMode = $derived(resolveThemePreference(activePreference, systemMode));

  const isPreferenceControlled = $derived(
    controlledPreference !== undefined || controlledMode !== undefined || theme?.mode !== undefined
  );

  const resolved: ResolvedTheme = $derived(
    resolveThemeInput({ ...(theme ?? {}), mode: activeMode })
  );

  const rootStyle = $derived(
    variableStrategy === "style-tag" ? undefined : themeToRootStyle(resolved)
  );

  const rootStyleString = $derived(
    rootStyle
      ? Object.entries(rootStyle)
          .map(([k, v]) => (k === "backgroundColor" ? `background-color: ${v}` : `${k}: ${v}`))
          .join("; ")
      : undefined
  );

  function setPreference(nextPreference: ThemePreference): void {
    if (!isPreferenceControlled) {
      internalPreference = nextPreference;
    }
    writeStoredThemePreference(storageKey, nextPreference);
    onPreferenceChange?.(nextPreference);
  }

  function setMode(nextMode: ThemeMode): void {
    setPreference(nextMode);
    onModeChange?.(nextMode);
  }

  function toggleMode(): void {
    setMode(nextThemeMode(activeMode));
  }

  // Context state — mutated reactively by effects below
  const contextState: MarwesContextState = $state({
    theme: resolved,
    mode: activeMode,
    preference: activePreference,
    systemMode,
  });

  setMarwesContext({
    get state() { return contextState; },
    setMode,
    setPreference,
    toggleMode,
  });

  // Keep context state synced with derived values
  $effect(() => {
    contextState.theme = resolved;
    contextState.mode = activeMode;
    contextState.preference = activePreference;
    contextState.systemMode = systemMode;
  });

  // Read stored preference on mount
  $effect(() => {
    const storedPreference = readStoredThemePreference(storageKey);
    if (storedPreference !== undefined && !isPreferenceControlled) {
      internalPreference = storedPreference;
    }
  });

  // System theme subscription
  $effect(() => {
    if (!enableSystem) {
      systemMode = MwThemeMode.light;
      return;
    }

    systemMode = getSystemThemeMode();

    if (activePreference !== "system") {
      return;
    }

    const unsubscribe = subscribeToSystemThemeMode((mode) => {
      systemMode = mode;
    });

    return unsubscribe;
  });

  // Apply theme to element (inline vars)
  $effect(() => {
    if (variableStrategy === "style-tag") return;
    if (rootElement) {
      applyThemeToElement(rootElement, resolved);
    }
  });

  // Apply mode attribute to target
  $effect(() => {
    if (target === "provider") return;

    const apply = () => {
      applyModeAttribute({
        target,
        providerElement: rootElement ?? null,
        mode: activeMode,
        attribute,
      });
    };

    if (disableTransitionOnChange) {
      withoutModeTransitions(apply);
      return;
    }

    apply();
  });

  // Font loading
  $effect(() => {
    loadThemeFonts(resolved, fontLoading);
  });
</script>

<div
  bind:this={rootElement}
  class={`mw-theme--${resolved.mode}`}
  data-marwes-theme="true"
  data-marwes-mode={resolved.mode}
  style={rootStyleString}
>
  {@render children?.()}
</div>
