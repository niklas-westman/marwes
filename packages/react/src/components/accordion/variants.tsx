import type * as React from "react"
import { AccordionField, type AccordionFieldProps } from "./accordion-field"

/**
 * Context Variant Accordion Groups - AI-Friendly Components
 *
 * These variants encode common accordion patterns and automatically set
 * AI-friendly metadata, making it easier for both developers and AI tools
 * to understand the purpose of each accordion group.
 */

// ============================================================================
// FAQ ACCORDION - Single-open Q&A style
// ============================================================================

export type FAQAccordionProps = Omit<AccordionFieldProps, "multiple">

/**
 * FAQAccordion - For question-and-answer sections.
 *
 * **AI Context:**
 * - Enforces single-open behaviour (opening one closes others)
 * - Adds `data-purpose="faq"` for AI parsing
 * - Ideal for FAQ pages, help sections, knowledge bases
 *
 * @example
 * ```tsx
 * import { FAQAccordion } from "@marwes-ui/react";
 *
 * export function Example() {
 *   return (
 *     <FAQAccordion
 *       label="Frequently Asked Questions"
 *       items={[
 *         { value: "q1", title: "What is Marwes?", children: <p>A design system.</p> },
 *         { value: "q2", title: "Is it free?", children: <p>Yes.</p> },
 *       ]}
 *       defaultOpenItems={["q1"]}
 *     />
 *   );
 * }
 * ```
 */
export function FAQAccordion(props: FAQAccordionProps): React.ReactElement {
  return (
    <AccordionField
      {...props}
      multiple={false}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "faq",
      }}
    />
  )
}

// ============================================================================
// SETTINGS ACCORDION - Multi-open configuration panels
// ============================================================================

export type SettingsAccordionProps = Omit<AccordionFieldProps, "multiple">

/**
 * SettingsAccordion - For configuration and settings panels.
 *
 * **AI Context:**
 * - Enforces multi-open behaviour (multiple sections open simultaneously)
 * - Adds `data-purpose="settings"` for AI parsing
 * - Ideal for preferences, admin panels, configuration forms
 *
 * @example
 * ```tsx
 * import { SettingsAccordion } from "@marwes-ui/react";
 *
 * export function Example() {
 *   return (
 *     <SettingsAccordion
 *       label="Account Settings"
 *       items={[
 *         { value: "profile", title: "Profile", children: <ProfileForm /> },
 *         { value: "notifications", title: "Notifications", children: <NotificationsForm /> },
 *         { value: "privacy", title: "Privacy", children: <PrivacyForm /> },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function SettingsAccordion(props: SettingsAccordionProps): React.ReactElement {
  return (
    <AccordionField
      {...props}
      multiple={true}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "settings",
      }}
    />
  )
}

// ============================================================================
// SECTIONS ACCORDION - Flexible content sections
// ============================================================================

export type SectionsAccordionProps = AccordionFieldProps

/**
 * SectionsAccordion - For generic collapsible content sections.
 *
 * **AI Context:**
 * - Same API as `AccordionField` with `data-purpose="sections"` for AI parsing
 * - Defaults to multi-open but can be overridden with `multiple={false}`
 * - Use when no more specific context variant fits
 * - Documentation, product details, order breakdowns
 *
 * @example
 * ```tsx
 * import { SectionsAccordion } from "@marwes-ui/react";
 *
 * export function Example() {
 *   return (
 *     <SectionsAccordion
 *       label="Product Details"
 *       items={[
 *         { value: "desc", title: "Description", children: <p>Full description.</p> },
 *         { value: "specs", title: "Specifications", children: <SpecsTable /> },
 *         { value: "reviews", title: "Reviews", children: <ReviewsList /> },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function SectionsAccordion(props: SectionsAccordionProps): React.ReactElement {
  return (
    <AccordionField
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "sections",
      }}
    />
  )
}
