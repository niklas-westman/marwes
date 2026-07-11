<script lang="ts">
  import { buildInputFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import InputOtp from "./InputOtp.svelte";
  import type { InputOtpFieldProps, InputOtpProps } from "./types.js";

  /**
   * InputOtpField (Molecule) — labeled wrapper around `InputOtp`.
   */
  let {
    id: userProvidedId,
    label,
    helperText,
    error,
    inputOtp = {},
    ariaDescribedBy,
    class: className,
  }: InputOtpFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-input-otp-${uniqueId}`);
  const labelId = $derived(`${fieldId}-label`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasHelperText = $derived(hasTextContent(helperText));
  const hasError = $derived(hasTextContent(error));
  const isInvalid = $derived(hasError || inputOtp.invalid === true);

  const a11yIds = $derived(
    buildInputFieldA11yIds({
      id: fieldId,
      hasHelperText,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass(
      "mw-input-otp-field",
      hasError && "mw-input-otp-field--invalid",
      inputOtp.disabled && "mw-input-otp-field--disabled",
      className
    )
  );

  const otpProps = $derived.by((): InputOtpProps => {
    const props: InputOtpProps = {
      ...inputOtp,
      id: fieldId,
      invalid: isInvalid,
      ariaLabelledBy: labelId,
    };
    if (a11yIds.describedBy) {
      props.describedBy = a11yIds.describedBy;
    }
    return props;
  });
</script>

<div class={wrapperClass}>
  <label class="mw-input-otp-field__label" for={fieldId} id={labelId}>
    <Text variant="label">{label}</Text>
  </label>

  <InputOtp {...otpProps} />

  {#if hasError}
    <div class="mw-input-otp-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {:else if hasHelperText}
    <div class="mw-input-otp-field__helper" id={a11yIds.helperTextId}>
      <Text variant="caption">{helperText}</Text>
    </div>
  {/if}
</div>
