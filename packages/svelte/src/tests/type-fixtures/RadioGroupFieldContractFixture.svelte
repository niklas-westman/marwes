<script lang="ts">
  import OptionRadioGroup from "../../lib/components/radio/OptionRadioGroup.svelte";
  import type { RadioGroupFieldOption } from "../../lib/components/radio/types.js";
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte";

  interface Props {
    name: string;
    label: string;
    description?: string;
    error?: string;
    defaultValue?: string;
    value?: string;
    onchange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    ariaDescribedBy?: string;
    options: RadioGroupFieldOption[];
  }

  let props: Props = $props();
</script>

<MarwesProvider>
  <OptionRadioGroup {...props} />
</MarwesProvider>
