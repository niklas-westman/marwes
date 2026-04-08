import type * as React from "react"

export type SelectArrowIconProps = {
  className?: string
}

export function SelectArrowIcon(props: SelectArrowIconProps): React.ReactElement {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11.5288 5.52876C11.7891 5.26841 12.2111 5.26841 12.4715 5.52876C12.7318 5.78911 12.7318 6.21114 12.4715 6.47147L8.47148 10.4715C8.21115 10.7318 7.78912 10.7318 7.52877 10.4715L3.52876 6.47147C3.26841 6.21112 3.26841 5.78911 3.52876 5.52876C3.78911 5.26841 4.21112 5.26841 4.47147 5.52876L6.58591 7.6432C7.36696 8.42425 8.63329 8.42425 9.41434 7.6432L11.5288 5.52876Z"
        fill="currentColor"
      />
    </svg>
  )
}
