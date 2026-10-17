<script lang="ts">
  import { Button, SubmitButton, MarwesProvider, ThemeMode } from "@marwes-ui/svelte";
  import { buttonFormKind, recordFormButtonCallback, recordNativeReset, recordNativeSubmit } from "./button-form-events";
  let { path }: { path: string } = $props();
  const kind = $derived(buttonFormKind(path));
  const mode = $derived(path.endsWith("/dark") ? ThemeMode.dark : ThemeMode.light);
</script>
<MarwesProvider enableSystem={false} theme={{ mode }}>
  <form data-testid="button-behavior-form" onsubmit={recordNativeSubmit} onreset={recordNativeReset}>
    <label>Message <input data-testid="button-behavior-input" name="message" value="original" /></label>
    {#if kind === "submit"}
      <SubmitButton onclick={recordFormButtonCallback} dataAttributes={{ "data-testid": "button-behavior-trigger" }}>Submit</SubmitButton>
    {:else}
      <Button type="reset" onclick={recordFormButtonCallback} dataAttributes={{ "data-testid": "button-behavior-trigger" }}>Reset</Button>
    {/if}
    <output data-testid="button-behavior-callback-count">0</output>
    <output data-testid="button-behavior-submit-count">0</output>
    <output data-testid="button-behavior-reset-count">0</output>
    <output data-testid="button-behavior-submitted-value"></output>
  </form>
</MarwesProvider>
