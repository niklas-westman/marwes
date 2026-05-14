<script lang="ts">
  import SwitchField from "./SwitchField.svelte";
  import type { SwitchProps } from "./types.js";

  interface SwitchFieldPurposeProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    switch?: Omit<SwitchProps, "children">;
    ariaDescribedBy?: string;
    class?: string;
  }

  let props: SwitchFieldPurposeProps = $props();
</script>
<div data-purpose="permission">
  <SwitchField {...props} />
</div>
