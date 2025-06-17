"use client"

import type React from "react"

import { useEffect } from "react"

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Remove no-transition class after page load to enable smooth transitions
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("no-transition")
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return <>{children}</>
}
