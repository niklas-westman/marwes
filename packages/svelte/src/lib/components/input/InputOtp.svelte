<script lang="ts">
  import { createInputOtpRecipe, sanitizeInputOtpValue } from "@marwes-ui/core";
  import type { InputOtpOptions } from "@marwes-ui/core";
  import { cssVarsToStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { InputOtpProps } from "./types.js";

  /**
   * InputOtp (Atom) — bare OTP cells. Renders the visual cells and a hidden
   * native `<input>` that captures keyboard entry. Pair with `InputOtpField`
   * for label + helper/error wiring.
   */
  let {
    id: userProvidedId,
    name,
    value: controlledValue,
    defaultValue,
    length: lengthProp,
    placeholderCharacter,
    disabled,
    readOnly,
    required,
    invalid,
    ariaLabel,
    label,
    ariaLabelledBy,
    describedBy,
    onvaluechange,
    class: className,
  }: InputOtpProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-input-otp-${uniqueId}`);
  const otpLength = $derived(Math.max(1, lengthProp ?? 6));

  const isControlled = $derived(controlledValue !== undefined);

  function getInitialUncontrolledValue(): string {
    return sanitizeInputOtpValue(defaultValue, lengthProp ?? 6);
  }

  let uncontrolledValue = $state(getInitialUncontrolledValue());

  const currentValue = $derived(
    sanitizeInputOtpValue(isControlled ? controlledValue : uncontrolledValue, otpLength)
  );

  const recipeOptions = $derived.by((): InputOtpOptions => {
    const opts: InputOtpOptions = {
      id: fieldId,
      value: currentValue,
      length: otpLength,
    };
    if (name) opts.name = name;
    if (placeholderCharacter) opts.placeholderCharacter = placeholderCharacter;
    if (disabled) opts.disabled = true;
    if (readOnly) opts.readOnly = true;
    if (required) opts.required = true;
    if (invalid) opts.invalid = true;
    if (describedBy) opts.describedBy = describedBy;
    if (ariaLabel) opts.ariaLabel = ariaLabel;
    if (label) opts.label = label;
    if (ariaLabelledBy) opts.ariaLabelledBy = ariaLabelledBy;
    return opts;
  });

  const kit = $derived(createInputOtpRecipe(recipeOptions));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(cssVarsToStyle(kit.vars));

  function handleChange(e: Event & { currentTarget: HTMLInputElement }): void {
    const nextValue = sanitizeInputOtpValue(e.currentTarget.value, otpLength);
    if (!isControlled) {
      uncontrolledValue = nextValue;
    }
    onvaluechange?.(nextValue);
  }
</script>

<div
  class={mergedClass}
  style={mergedStyle}
  data-component="input-otp"
  data-invalid={invalid ? "true" : undefined}
  data-disabled={disabled ? "true" : undefined}
>
  <div class="mw-input-otp__cells">
    {#each kit.displayCells as cell (cell.key)}
      <span
        class={mergeClass("mw-input-otp__cell", cell.filled && "mw-input-otp__cell--filled")}
        aria-hidden="true"
      >
        {cell.character}
      </span>
    {/each}

    <input
      id={kit.a11y.id}
      class="mw-input-otp__input"
      type="text"
      name={kit.a11y.name}
      inputmode={kit.a11y.inputMode}
      autocomplete={kit.a11y.autoComplete}
      maxlength={kit.a11y.maxLength}
      pattern={kit.a11y.pattern}
      disabled={kit.a11y.disabled}
      readonly={kit.a11y.readOnly}
      required={kit.a11y.required}
      aria-label={kit.a11y.ariaLabel}
      aria-labelledby={kit.a11y.ariaLabelledBy}
      aria-invalid={kit.a11y.ariaInvalid}
      aria-describedby={kit.a11y.ariaDescribedBy}
      value={kit.displayValue}
      oninput={handleChange}
    />
  </div>
</div>
