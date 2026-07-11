<script lang="ts">
  import RichTextField from "../../lib/components/input/RichTextField.svelte"
  import type { RichTextFieldProps } from "../../lib/components/input/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let { id, label, helperText, error, editor, ariaDescribedBy }: RichTextFieldProps = $props()
</script>

<MarwesProvider>
  <RichTextField {id} {label} {helperText} {error} {editor} {ariaDescribedBy} />
</MarwesProvider>
