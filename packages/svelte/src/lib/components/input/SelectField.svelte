<script lang="ts">
  import { IconName, buildInputFieldA11yIds, resolveSelectMode } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import Select from "./Select.svelte";
  import type { SelectFieldProps, SelectProps } from "./types.js";

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  function getInitialSelectValue(select: SelectProps): string {
    if (select.value !== undefined) {
      return select.value;
    }

    if (select.defaultValue !== undefined) {
      return select.defaultValue;
    }

    if (select.placeholder !== undefined) {
      return "";
    }

    return select.options[0]?.value ?? "";
  }

  function getFirstEnabledOptionIndex(options: SelectProps["options"]): number {
    return options.findIndex((option) => !option.disabled);
  }

  function getLastEnabledOptionIndex(options: SelectProps["options"]): number {
    for (let index = options.length - 1; index >= 0; index -= 1) {
      if (!options[index]?.disabled) {
        return index;
      }
    }

    return -1;
  }

  function getSelectedOptionIndex(options: SelectProps["options"], currentValue: string): number {
    return options.findIndex((option) => option.value === currentValue && !option.disabled);
  }

  function getInitialActiveOptionIndex(options: SelectProps["options"], currentValue: string): number {
    const selectedIndex = getSelectedOptionIndex(options, currentValue);

    if (selectedIndex !== -1) {
      return selectedIndex;
    }

    return getFirstEnabledOptionIndex(options);
  }

  function getNextEnabledOptionIndex(
    options: SelectProps["options"],
    currentIndex: number,
    direction: 1 | -1
  ): number {
    if (options.length === 0) {
      return -1;
    }

    let nextIndex = currentIndex;

    for (let attempts = 0; attempts < options.length; attempts += 1) {
      nextIndex = (nextIndex + direction + options.length) % options.length;

      if (!options[nextIndex]?.disabled) {
        return nextIndex;
      }
    }

    return currentIndex;
  }

  let {
    id: userProvidedId,
    label,
    helperText,
    error,
    select = { options: [] },
    ariaDescribedBy,
    value = $bindable(getInitialSelectValue(select)),
    class: className,
  }: SelectFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-select-${uniqueId}`);
  const mode = $derived(resolveSelectMode(select));
  const hasHelperText = $derived(hasTextContent(helperText));
  const hasError = $derived(hasTextContent(error));
  const invalid = $derived(hasError || select.invalid || false);
  const disabled = $derived(select.disabled || false);

  const a11yIds = $derived(
    buildInputFieldA11yIds({ id: fieldId, hasHelperText, hasError, externalDescribedBy: ariaDescribedBy })
  );

  const wrapperClass = $derived(
    mergeClass(
      "mw-input-field",
      "mw-input-field--select",
      mode === "marwes" && "mw-input-field--select-marwes",
      disabled && "mw-input-field--disabled",
      invalid && "mw-input-field--invalid",
      className
    )
  );

  const mergedSelect = $derived({
    ...select,
    id: fieldId,
    value,
    invalid,
    ...(a11yIds.describedBy ? { describedBy: a11yIds.describedBy } : {}),
  });

  const selectedOption = $derived(
    select.options.find((option) => option.value === value) ??
      (select.placeholder === undefined ? select.options[0] : undefined)
  );
  const placeholderSelected = $derived(select.placeholder !== undefined && value === "");
  const displayText = $derived(placeholderSelected ? (select.placeholder ?? "") : (selectedOption?.label ?? ""));
  const accessibleName = $derived(
    select.ariaLabel ?? (hasTextContent(label) ? label : undefined) ?? (hasTextContent(displayText) ? displayText : undefined)
  );

  let open = $state(false);
  let activeIndex = $state(-1);
  let controlElement = $state<HTMLDivElement | undefined>(undefined);
  let triggerElement = $state<HTMLButtonElement | undefined>(undefined);

  $effect(() => {
    if (!open) {
      return;
    }

    activeIndex = getInitialActiveOptionIndex(select.options, value);
  });

  $effect(() => {
    if (disabled) {
      open = false;
    }
  });

  $effect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (controlElement?.contains(event.target as Node)) {
        return;
      }

      open = false;
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  });

  function commitValue(nextValue: string): void {
    value = nextValue;
    select.onvaluechange?.(nextValue);
  }

  function selectOptionAtIndex(index: number): void {
    const option = select.options[index];

    if (!option || option.disabled) {
      return;
    }

    commitValue(option.value);
    open = false;
    triggerElement?.focus();
  }

  function handleTriggerKeydown(event: KeyboardEvent): void {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();

        if (!open) {
          open = true;
          activeIndex = getInitialActiveOptionIndex(select.options, value);
          return;
        }

        activeIndex = getNextEnabledOptionIndex(select.options, activeIndex, 1);
        return;
      }
      case "ArrowUp": {
        event.preventDefault();

        if (!open) {
          open = true;
          activeIndex = getInitialActiveOptionIndex(select.options, value);
          return;
        }

        activeIndex = getNextEnabledOptionIndex(select.options, activeIndex, -1);
        return;
      }
      case "Home": {
        if (!open) {
          return;
        }

        event.preventDefault();
        activeIndex = getFirstEnabledOptionIndex(select.options);
        return;
      }
      case "End": {
        if (!open) {
          return;
        }

        event.preventDefault();
        activeIndex = getLastEnabledOptionIndex(select.options);
        return;
      }
      case "Enter":
      case " ": {
        event.preventDefault();

        if (!open) {
          open = true;
          activeIndex = getInitialActiveOptionIndex(select.options, value);
          return;
        }

        if (activeIndex !== -1) {
          selectOptionAtIndex(activeIndex);
        }
        return;
      }
      case "Escape": {
        if (!open) {
          return;
        }

        event.preventDefault();
        open = false;
        return;
      }
      case "Tab": {
        open = false;
        return;
      }
      default:
        return;
    }
  }

  function handleOptionKeydown(event: KeyboardEvent, optionIndex: number): void {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    selectOptionAtIndex(optionIndex);
  }
</script>

<div class={wrapperClass}>
  <label class="mw-input-field__label" for={fieldId}>
    <p class="mw-p mw-p--md">{label}</p>
  </label>
  <div class="mw-input-field__input-wrapper">
    {#if mode === "native"}
      <Select {...mergedSelect} native={true} bind:value />
    {:else}
      <div
        bind:this={controlElement}
        class={mergeClass("mw-select-field__control", open && "mw-select-field__control--open")}
      >
        <button
          bind:this={triggerElement}
          id={fieldId}
          type="button"
          class={mergeClass(
            "mw-select-field__trigger",
            placeholderSelected && "mw-select-field__trigger--placeholder",
            invalid && "is-invalid",
            open && "mw-select-field__trigger--open"
          )}
          role="combobox"
          aria-controls={`${fieldId}-listbox`}
          aria-expanded={open ? "true" : "false"}
          aria-haspopup="listbox"
          aria-label={accessibleName}
          aria-describedby={a11yIds.describedBy}
          aria-invalid={invalid ? "true" : undefined}
          aria-required={select.required ? "true" : undefined}
          aria-activedescendant={open && activeIndex !== -1 ? `${fieldId}-option-${activeIndex}` : undefined}
          disabled={disabled}
          data-placeholder-selected={placeholderSelected ? "true" : undefined}
          onclick={() => {
            if (disabled) {
              return;
            }

            open = !open;
          }}
          onkeydown={handleTriggerKeydown}
        >
          <span class="mw-select-field__trigger-text">{displayText}</span>
          <svg
            class="mw-select-field__trigger-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M11.5288 5.52876C11.7891 5.26841 12.2111 5.26841 12.4715 5.52876C12.7318 5.78911 12.7318 6.21114 12.4715 6.47147L8.47148 10.4715C8.21115 10.7318 7.78912 10.7318 7.52877 10.4715L3.52876 6.47147C3.26841 6.21112 3.26841 5.78911 3.52876 5.52876C3.78911 5.26841 4.21112 5.26841 4.47147 5.52876L6.58591 7.6432C7.36696 8.42425 8.63329 8.42425 9.41434 7.6432L11.5288 5.52876Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {#if select.name}
          <input
            aria-hidden="true"
            class="mw-select-field__proxy-input"
            name={select.name}
            type="hidden"
            {value}
            readonly
          />
        {/if}

        {#if open}
          <div class="mw-select-field__list" id={`${fieldId}-listbox`} role="listbox" tabindex="-1">
            {#each select.options as option, optionIndex (option.value)}
              {@const selected = option.value === value}
              {@const active = optionIndex === activeIndex}
              <div
                id={`${fieldId}-option-${optionIndex}`}
                class={mergeClass(
                  "mw-select-field__option",
                  active && "mw-select-field__option--active",
                  selected && "mw-select-field__option--selected",
                  option.disabled && "mw-select-field__option--disabled"
                )}
                role="option"
                aria-selected={selected ? "true" : "false"}
                aria-disabled={option.disabled ? "true" : undefined}
                tabindex="-1"
                onclick={() => selectOptionAtIndex(optionIndex)}
                onkeydown={(event) => handleOptionKeydown(event, optionIndex)}
                onmousedown={(event) => event.preventDefault()}
                onmouseenter={() => {
                  if (!option.disabled) {
                    activeIndex = optionIndex;
                  }
                }}
              >
                <span class="mw-select-field__option-label">{option.label}</span>
                {#if selected}
                  <Icon class="mw-select-field__option-check" name={IconName.Check} size="xs" decorative />
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
  {#if hasHelperText && !hasError}
    <div class="mw-input-field__helper" id={a11yIds.helperTextId}>
      <p class="mw-p mw-p--sm">{helperText}</p>
    </div>
  {/if}
  {#if hasError}
    <div class="mw-input-field__error" id={a11yIds.errorId} aria-live="polite">
      <p class="mw-p mw-p--sm">{error}</p>
    </div>
  {/if}
</div>
