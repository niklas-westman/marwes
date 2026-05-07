# Slider — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `createSliderRecipe` integration
- `bind:value` + `onvaluechange` callback
- Native `<input type="range">` with proper a11y
- All props: min, max, step, disabled, orientation, ariaLabel, ariaValueText
- CSS var for fill percentage (--mw-slider-fill-percentage)
- Tooltip support
- Data attributes

### Missing ❌
- **`SliderField`** molecule (label, description, error wiring)
- **Touch area** visual treatment (showTouchArea renders differently in React)
- **Purpose variants**

### Notes
- The base slider is fully functional. `SliderField` follows the standard field molecule pattern and can be added easily.
