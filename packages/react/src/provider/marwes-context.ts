import * as React from "react";
import type { System, ThemeMode } from "@marwes/core";

export type MarwesContextValue = {
  system: System;
  onModeChange: ((mode: ThemeMode) => void) | undefined;
};

export const MarwesContext = React.createContext<MarwesContextValue | null>(
  null,
);
