<script lang="ts">
  import {
    createRichTextRecipe,
    isRichTextHtmlEmpty,
    normalizeRichTextHtml,
    resolveRichTextAllowedFormats,
    richTextCommandByFormat,
  } from "@marwes-ui/core";
  import type { RichTextFormat, RichTextOptions } from "@marwes-ui/core";
  import { cssVarsToStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import type { RichTextProps } from "./types.js";

  let {
    value: controlledValue,
    defaultValue,
    onvaluechange,
    class: className,
    ...options
  }: RichTextProps = $props();

  const kit = $derived(createRichTextRecipe({
    ...options,
    ...(controlledValue !== undefined ? { value: controlledValue } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
  }));
  const allowedFormats = $derived(resolveRichTextAllowedFormats(options.allowedFormats));
  const isControlled = $derived(controlledValue !== undefined);
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(cssVarsToStyle(kit.vars));
  const showToolbar = $derived(!options.readOnly);

  let editorElement: HTMLDivElement | undefined = $state(undefined);
  let uncontrolledHtml = $state(normalizeRichTextHtml(defaultValue));
  let isEditorEmpty = $state(isRichTextHtmlEmpty(isControlled ? normalizeRichTextHtml(controlledValue) : uncontrolledHtml));
  let activeFormats = $state<RichTextFormat[]>([]);

  const editorHtml = $derived(isControlled ? normalizeRichTextHtml(controlledValue) : uncontrolledHtml);

  const formatLabels: Record<RichTextFormat, string> = {
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
  };

  function syncEditorState(nextHtml: string): string {
    const normalized = normalizeRichTextHtml(nextHtml);
    const empty = isRichTextHtmlEmpty(normalized);
    if (!isControlled) uncontrolledHtml = normalized;
    isEditorEmpty = empty;
    onvaluechange?.(normalized);
    return normalized;
  }

  function getActiveFormatsFromSelection(): RichTextFormat[] {
    if (!editorElement || typeof window === "undefined" || typeof document === "undefined") return [];
    const doc = document as any;
    const selection = window.getSelection();
    const anchorNode = selection?.anchorNode ?? null;
    if (!anchorNode || !editorElement.contains(anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentNode : anchorNode)) return [];

    const active = new Set<RichTextFormat>();
    if (typeof doc.queryCommandState === "function") {
      for (const format of Object.keys(richTextCommandByFormat) as RichTextFormat[]) {
        try { if (doc.queryCommandState(richTextCommandByFormat[format])) active.add(format); } catch {}
      }
    }
    if (active.size > 0) return Array.from(active);

    let node: Node | null = anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentNode : anchorNode;
    while (node && node !== editorElement) {
      if (node instanceof HTMLElement) {
        const tag = node.tagName.toLowerCase();
        if (tag === "strong" || tag === "b") active.add("bold");
        if (tag === "em" || tag === "i") active.add("italic");
        if (tag === "u") active.add("underline");
      }
      node = node.parentNode;
    }
    return Array.from(active);
  }

  function refreshActiveFormats(): void {
    activeFormats = getActiveFormatsFromSelection();
  }

  function toggleFormat(format: RichTextFormat): void {
    if (options.disabled || options.readOnly || typeof document === "undefined" || !editorElement) return;
    const doc = document as any;
    editorElement.focus();
    if (typeof doc.execCommand === "function") doc.execCommand(richTextCommandByFormat[format]);
    syncEditorState(editorElement.innerHTML);
    refreshActiveFormats();
  }

  function handleInput(): void {
    if (!editorElement || options.disabled || options.readOnly) return;
    syncEditorState(editorElement.innerHTML);
    refreshActiveFormats();
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
    const formatByKey: Partial<Record<string, RichTextFormat>> = { b: "bold", i: "italic", u: "underline" };
    const requested = formatByKey[e.key.toLowerCase()];
    if (!requested || !allowedFormats.includes(requested)) return;
    e.preventDefault();
    toggleFormat(requested);
  }

  $effect(() => {
    if (!editorElement) return;
    const normalizedDom = normalizeRichTextHtml(editorElement.innerHTML);
    if (normalizedDom !== editorHtml) editorElement.innerHTML = editorHtml;
    isEditorEmpty = isRichTextHtmlEmpty(editorHtml);
  });

  $effect(() => {
    if (typeof document === "undefined") return;
    const handler = () => refreshActiveFormats();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  });
</script>

<div class={mergedClass} style={mergedStyle} {...kit.dataAttributes}>
  {#if showToolbar}
    <div class="mw-rich-text__toolbar" data-rich-text-toolbar>
      {#each allowedFormats as format (format)}
        {@const isActive = activeFormats.includes(format)}
        {@const iconName = format === "bold" ? "bold" : format === "italic" ? "italic" : "underline"}
        <button
          type="button"
          class="mw-rich-text__toolbar-button"
          data-format={format}
          data-active={isActive ? "true" : undefined}
          aria-label={formatLabels[format]}
          aria-pressed={isActive}
          disabled={options.disabled}
          onmousedown={(e) => e.preventDefault()}
          onclick={() => toggleFormat(format)}
        >
          <Icon name={iconName} size="xs" decorative />
        </button>
      {/each}
    </div>
  {/if}

  <div
    bind:this={editorElement}
    class="mw-rich-text__editor"
    data-rich-text-editor
    data-empty={isEditorEmpty ? "true" : undefined}
    data-placeholder={options.placeholder}
    id={kit.a11y.id}
    role={kit.a11y.role}
    tabindex={kit.a11y.tabIndex}
    aria-label={kit.a11y.ariaLabel}
    aria-labelledby={kit.a11y.ariaLabelledBy}
    aria-describedby={kit.a11y.ariaDescribedBy}
    aria-invalid={kit.a11y.ariaInvalid}
    aria-disabled={kit.a11y.ariaDisabled}
    aria-readonly={kit.a11y.ariaReadOnly}
    aria-required={kit.a11y.ariaRequired}
    aria-multiline={kit.a11y.ariaMultiline}
    contenteditable={!options.disabled && !options.readOnly}
    oninput={handleInput}
    onkeydown={handleKeyDown}
    onfocus={refreshActiveFormats}
    onblur={() => { syncEditorState(editorElement?.innerHTML ?? ""); activeFormats = []; }}
  ></div>

  {#if options.name}
    <input type="hidden" name={options.name} value={editorHtml} disabled={options.disabled} />
  {/if}
</div>
