<script lang="ts">
  import { buildInputFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import Pagination from "./Pagination.svelte";
  import type { PaginationFieldProps, PaginationProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    description,
    error,
    pagination,
    ariaDescribedBy,
    class: className,
  }: PaginationFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-pagination-${uniqueId}`);
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
    mergeClass("mw-pagination-field", hasError && "mw-pagination-field--invalid", className)
  );

  const paginationProps = $derived.by((): PaginationProps => {
    const props: PaginationProps = {
      ...pagination,
      ariaLabelledBy: labelId,
    } as PaginationProps;
    if (a11yIds.describedBy) {
      props.ariaDescribedBy = a11yIds.describedBy;
    }
    return props;
  });
</script>

<div class={wrapperClass}>
  <span class="mw-pagination-field__label" id={labelId}>
    <Text variant="label">{label}</Text>
  </span>

  {#if hasDescription && !hasError}
    <div class="mw-pagination-field__description" id={a11yIds.helperTextId}>
      <Text variant="caption">{description}</Text>
    </div>
  {/if}

  <Pagination {...paginationProps} />

  {#if hasError}
    <div class="mw-pagination-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {/if}
</div>
