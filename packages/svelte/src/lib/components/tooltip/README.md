# Tooltip — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Tooltip` atom with `createTooltipRecipe`
- `role="tooltip"`, CSS vars for positioning
- `TooltipGroup` molecule with icon trigger, hover/focus reveal
- Controlled (`open`) and uncontrolled (`defaultOpen`) modes
- `onopenchange` callback
- Dismiss on pointer leave, focus leave, and Escape
- Exit animation delay (160ms) before unmounting
- Default icon: `IconName.HelpCircle`, swappable via `icon` prop
- `triggerLabel` for accessible trigger button name
- `aria-describedby` wired from trigger to tooltip when open

### Svelte-specific
- `content` prop accepts `Snippet | string` (React uses `ReactNode`)
- Uses `$props.id()` for stable unique IDs

### Notes
- Tooltip is for non-interactive contextual help only. For interactive content, use a popover or dialog pattern.
