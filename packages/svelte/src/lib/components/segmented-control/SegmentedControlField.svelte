<script lang="ts" generics="T extends string = string">
  import { buildInputFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import SegmentedControl from "./SegmentedControl.svelte";
  import type { SegmentedControlFieldProps, SegmentedControlProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    description,
    error,
    segmentedControl,
    ariaDescribedBy,
    class: className,
  }: SegmentedControlFieldProps<T> = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-segmented-control-${uniqueId}`);
  const labelId = $derived(`${fieldId}-label`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasDescription = $derived(hasTextContent(description));
  const hasError = $derived(hasTextContent(error));

  const a11yIds = $derived(
    buildInputFieldA11yIds({
      id: fieldId,
      hasHelperText: hasDescription,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass(
      "mw-segmented-control-field",
      hasError && "mw-segmented-control-field--invalid",
      className
    )
  );

  const scProps = $derived.by((): SegmentedControlProps<T> => {
    const sc: SegmentedControlProps<T> = {
      ...segmentedControl,
      ariaLabelledBy: labelId,
    } as SegmentedControlProps<T>;
    if (a11yIds.describedBy) {
      sc.ariaDescribedBy = a11yIds.describedBy;
    }
    return sc;
  });
</script>

<div class={wrapperClass}>
  <span class="mw-segmented-control-field__label" id={labelId}>
    <Text variant="label">{label}</Text>
  </span>

  {#if hasDescription && !hasError}
    <div class="mw-segmented-control-field__description" id={a11yIds.helperTextId}>
      <Text variant="caption">{description}</Text>
    </div>
  {/if}

  <SegmentedControl {...scProps} />

  {#if hasError}
    <div class="mw-segmented-control-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {/if}
</div>
