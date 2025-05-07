"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    // Return children directly to avoid layout shift if `enableSystem` is true,
    // or return null/placeholder if strict flicker avoidance is needed.
    // For this app, returning children is acceptable as initial theme is light.
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
