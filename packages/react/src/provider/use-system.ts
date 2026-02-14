import * as React from "react";
import type { System } from "@marwes/core";
import { MarwesContext } from "./marwes-context";

export function useSystem(): System {
  const ctx = React.useContext(MarwesContext);
  if (!ctx) {
    throw new Error(
      "MarwesProvider is missing. Wrap your app in <MarwesProvider />.",
    );
  }
  return ctx.system;
}
