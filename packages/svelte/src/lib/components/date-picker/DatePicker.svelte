<script lang="ts">
  import { createDatePickerRecipe } from "@marwes-ui/core";
  import type { DatePickerOptions } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { DatePickerProps } from "./types.js";

  let {
    monthLabel,
    weekdayLabels,
    weeks,
    device,
    previousYearLabel,
    previousMonthLabel,
    nextMonthLabel,
    nextYearLabel,
    cancelLabel,
    applyLabel,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    calendarLabel,
    dataAttributes,
    onpreviousyear,
    onpreviousmonth,
    onnextmonth,
    onnextyear,
    ondayselect,
    oncancel,
    onapply,
    class: className,
  }: DatePickerProps = $props();

  const recipeOptions = $derived.by((): DatePickerOptions => {
    const opts: DatePickerOptions = {};
    if (monthLabel !== undefined) opts.monthLabel = monthLabel;
    if (weekdayLabels !== undefined) opts.weekdayLabels = weekdayLabels;
    if (weeks !== undefined) opts.weeks = weeks;
    if (device !== undefined) opts.device = device;
    if (previousYearLabel !== undefined) opts.previousYearLabel = previousYearLabel;
    if (previousMonthLabel !== undefined) opts.previousMonthLabel = previousMonthLabel;
    if (nextMonthLabel !== undefined) opts.nextMonthLabel = nextMonthLabel;
    if (nextYearLabel !== undefined) opts.nextYearLabel = nextYearLabel;
    if (cancelLabel !== undefined) opts.cancelLabel = cancelLabel;
    if (applyLabel !== undefined) opts.applyLabel = applyLabel;
    if (ariaLabel !== undefined) opts.ariaLabel = ariaLabel;
    if (ariaLabelledBy !== undefined) opts.ariaLabelledBy = ariaLabelledBy;
    if (ariaDescribedBy !== undefined) opts.ariaDescribedBy = ariaDescribedBy;
    if (calendarLabel !== undefined) opts.calendarLabel = calendarLabel;
    if (dataAttributes !== undefined) opts.dataAttributes = dataAttributes;
    return opts;
  });

  const kit = $derived(createDatePickerRecipe(recipeOptions));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<section
  class={mergedClass}
  aria-label={kit.a11y.ariaLabel}
  aria-labelledby={kit.a11y.ariaLabelledBy}
  aria-describedby={kit.a11y.ariaDescribedBy}
  {...kit.dataAttributes}
>
  <header class={kit.slots.headerClassName}>
    <div class={kit.slots.navGroupClassName}>
      <button type="button" class={kit.slots.navButtonClassName} aria-label={kit.labels.previousYear} onclick={onpreviousyear}>«</button>
      <button type="button" class={kit.slots.navButtonClassName} aria-label={kit.labels.previousMonth} onclick={onpreviousmonth}>‹</button>
    </div>
    <div class={kit.slots.monthLabelClassName}>{kit.monthLabel}</div>
    <div class={kit.slots.navGroupClassName}>
      <button type="button" class={kit.slots.navButtonClassName} aria-label={kit.labels.nextMonth} onclick={onnextmonth}>›</button>
      <button type="button" class={kit.slots.navButtonClassName} aria-label={kit.labels.nextYear} onclick={onnextyear}>»</button>
    </div>
  </header>

  <table class={kit.slots.gridClassName} aria-label={kit.monthLabel}>
    <thead>
      <tr class="mw-date-picker__weekdays">
        {#each kit.weekdayLabels as weekday (weekday)}
          <th class={kit.slots.weekdayClassName} scope="col">{weekday}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each kit.weeks as week, weekIndex}
        <tr class={kit.slots.weekClassName}>
          {#each week as day, dayIndex}
            {@const dayKit = kit.dayKits[weekIndex]?.[dayIndex]}
            {#if dayKit}
              <td class={kit.slots.cellClassName}>
                <button
                  type="button"
                  class={dayKit.className}
                  aria-label={dayKit.ariaLabel}
                  aria-pressed={dayKit.selected ? "true" : undefined}
                  disabled={dayKit.disabled}
                  onclick={() => ondayselect?.(day)}
                  {...dayKit.dataAttributes}
                >
                  {day.label}
                </button>
              </td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <footer class={kit.slots.footerClassName}>
    <button type="button" class={kit.slots.footerButtonClassName} onclick={oncancel}>
      {kit.labels.cancel}
    </button>
    {#if kit.labels.apply}
      <button type="button" class="{kit.slots.footerButtonClassName} mw-date-picker__footer-button--primary" onclick={onapply}>
        {kit.labels.apply}
      </button>
    {/if}
  </footer>
</section>
