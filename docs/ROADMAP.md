# Marwes Roadmap

Vision and feature planning for the Marwes component system.

## v0.1 - Foundation (Current Phase)

**Goal:** Establish core architecture and ship essential daily-use components.

### ✅ Completed
- [x] Core package architecture (framework-agnostic)
- [x] Preset system (firstEdition with CSS variables)
- [x] React adapter package
- [x] Theme system (merge, normalize, defaults)
- [x] MarwesProvider
- [x] Button component
- [x] Input component
- [x] Checkbox component
- [x] Icon component (lucide icons)
- [x] CheckboxField molecule
- [x] Typography components (H1, H2, H3, Paragraph)
- [x] Figma MCP integration
- [x] Storybook setup
- [x] Documentation structure

### 🚧 In Progress
- [ ] Select component (native `<select>` for v0.1)
- [ ] Textarea component
- [ ] FormField wrapper
- [ ] Card component
- [ ] Divider component
- [ ] Spinner/Loading component

### 📋 Planned
- [ ] Switch component
- [ ] Radio component
- [ ] RadioGroup wrapper
- [ ] Enhanced Figma token sync workflow
- [ ] Component unit tests (core)
- [ ] Component integration tests (React)

**Target:** Q1 2026

---

## v0.2 - Enhanced Components

**Goal:** Add common UI patterns and improve developer experience.

### Components
- [ ] Dialog/Modal component
- [ ] Toast notification system
- [ ] Tabs component
- [ ] Accordion component
- [ ] Tooltip component
- [ ] Popover component
- [ ] Badge component
- [ ] Avatar component
- [ ] Progress bar
- [ ] Skeleton loader

### Developer Experience
- [ ] CLI tool for component generation
- [ ] Code snippets for VS Code
- [ ] Improved TypeScript autocomplete
- [ ] Component composition patterns documentation
- [ ] Form validation examples

### Design System
- [ ] Dark mode support
- [ ] Additional color themes
- [ ] Responsive design utilities
- [ ] Animation/transition system

**Target:** Q2 2026

---

## v0.3 - Complex Components

**Goal:** Ship advanced components requiring significant interaction logic.

### Components
- [ ] Combobox (searchable select)
- [ ] DatePicker
- [ ] TimePicker
- [ ] DateRangePicker
- [ ] DataTable with sorting/filtering
- [ ] Pagination
- [ ] Multi-select
- [ ] Autocomplete
- [ ] Command palette
- [ ] Color picker

### Features
- [ ] Keyboard navigation framework
- [ ] Focus management utilities
- [ ] Virtualization support for lists
- [ ] Advanced form patterns

**Target:** Q3 2026

---

## v0.4 - Multi-Framework Support

**Goal:** Extend beyond React to support more frameworks.

### Framework Adapters
- [ ] `@marwes/vue` - Vue 3 adapter
- [ ] `@marwes/svelte` - Svelte adapter
- [ ] `@marwes/solid` - SolidJS adapter (maybe)
- [ ] `@marwes/core-dom` - Vanilla JS utilities

### Tooling
- [ ] Framework-agnostic playground
- [ ] Cross-framework test suite
- [ ] Migration guides

**Target:** Q4 2026

---

## v1.0 - Stable Release

**Goal:** Production-ready component library with stable API.

### Requirements
- [ ] All v0.1-v0.3 components stable
- [ ] Comprehensive test coverage (>90%)
- [ ] Complete documentation
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Breaking change policy established
- [ ] Semantic versioning commitment

### Documentation
- [ ] Interactive component playground
- [ ] Video tutorials
- [ ] Real-world examples
- [ ] Migration guides from popular libraries
- [ ] Figma design kit

**Target:** 2027

---

## Beyond v1.0 - Future Possibilities

### Additional Presets
- [ ] `materialEdition` - Material Design inspired
- [ ] `fluentEdition` - Fluent Design System
- [ ] `brandEdition` - Customizable brand preset template

### Advanced Features
- [ ] CSS-in-JS adapter option (for teams that need it)
- [ ] Server Components support (React)
- [ ] React Native adapter (exploration)
- [ ] Animation library integration
- [ ] Design token documentation generator

### Community
- [ ] Community preset marketplace
- [ ] Plugin system
- [ ] Component contribution guidelines
- [ ] Design partner program

---

## Principles Guiding the Roadmap

1. **Quality over Quantity** - Ship excellent components, not a huge catalog
2. **Accessibility First** - Every component passes WCAG 2.1 AA
3. **Performance Matters** - Keep bundle sizes small, runtime fast
4. **Developer Experience** - Simple API, great docs, helpful errors
5. **Framework Agnostic** - Core stays pure, adapters stay thin
6. **Design System Ready** - Easy to customize, works with Figma

---

## How to Influence the Roadmap

- **GitHub Discussions** - Share use cases and component requests
- **Issues** - Report bugs or missing features
- **Pull Requests** - Contribute implementations
- **Figma Community** - Share design patterns

---

## Notes

This roadmap is aspirational and subject to change based on:
- Community feedback
- Real-world usage patterns
- Framework ecosystem changes
- Team capacity

Last updated: 2026-02-10
