'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Set `mounted` to true after the component is mounted on the client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted yet, return null (avoid SSR issues)
  if (!mounted) {
    return null
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
