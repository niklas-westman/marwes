import type { Theme } from "@marwes/core";
import { useSystem } from "./use-system";

export function useTheme(): Theme {
  return useSystem().theme;
}
