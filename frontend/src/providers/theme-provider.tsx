"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  attribute = "class",
  ...props
}: Omit<ThemeProviderProps, "attribute"> & { attribute?: React.ComponentProps<typeof NextThemesProvider>["attribute"] }) {
  return (
    <NextThemesProvider attribute={attribute} {...props}>
      {children}
    </NextThemesProvider>
  );
}
