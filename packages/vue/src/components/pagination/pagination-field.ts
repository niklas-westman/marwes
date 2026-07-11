import { buildInputFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Text } from "../text"
import { Pagination, type PaginationPropsVue as PaginationProps } from "./pagination"

export type PaginationFieldProps = {
  id?: string
  label: string
  description?: string
  error?: string
  pagination: Omit<PaginationProps, "ariaLabel" | "ariaLabelledBy" | "ariaDescribedBy">
  ariaDescribedBy?: string
  className?: string
}

const paginationFieldPropKeys = [
  "id",
  "label",
  "description",
  "error",
  "pagination",
  "ariaDescribedBy",
  "className",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

/**
 * PaginationField (Molecule)
 *
 * A labeled wrapper around `Pagination`.
 */
export const PaginationField = defineComponent(
  (props: PaginationFieldProps) => {
    const localId = createLocalId("mw-pagination")
    const id = computed(() => props.id ?? localId)
    const labelId = computed(() => `${id.value}-label`)

    const hasDescription = computed(() => hasTextContent(props.description))
    const hasError = computed(() => hasTextContent(props.error))

    const a11yIds = computed(() =>
      buildInputFieldA11yIds({
        id: id.value,
        hasHelperText: hasDescription.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-pagination-field",
        hasError.value && "mw-pagination-field--invalid",
        props.className,
      ),
    )

    return () => {
      const paginationProps: PaginationProps = {
        ...(props.pagination as PaginationProps),
        ariaLabelledBy: labelId.value,
      }
      if (a11yIds.value.describedBy) {
        paginationProps.ariaDescribedBy = a11yIds.value.describedBy
      }

      return h("div", { class: wrapperClass.value }, [
        h(
          "span",
          { class: "mw-pagination-field__label", id: labelId.value },
          h(Text, { variant: "label" }, () => [props.label]),
        ),
        hasDescription.value && !hasError.value
          ? h(
              "div",
              {
                class: "mw-pagination-field__description",
                id: a11yIds.value.helperTextId,
              },
              h(Text, { variant: "caption" }, () => [props.description]),
            )
          : null,
        h(Pagination, paginationProps),
        hasError.value
          ? h(
              "div",
              {
                class: "mw-pagination-field__error",
                id: a11yIds.value.errorId,
                "aria-live": "polite",
              },
              h(Text, { variant: "caption" }, () => [props.error]),
            )
          : null,
      ])
    }
  },
  {
    name: "MarwesPaginationField",
    props: [...paginationFieldPropKeys],
  },
)
