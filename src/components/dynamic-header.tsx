"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageNames: Record<string, string> = {
  "/": "Logs Dashboard",
  "/dashboard": "Dashboard",
  "/logs": "Logs",
  "/monitoring": "Monitoring",
  "/search": "Search",
  "/settings": "Settings"
}

export function DynamicHeader() {
  const pathname = usePathname()
  const currentPageName = pageNames[pathname] || "Vibe Monitor"

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="h-4 w-px bg-sidebar-border" />
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-6 rounded-full flex-shrink-0"
          style={{ backgroundColor: "var(--color-blue-line)" }}
        />
        <h1 className="text-lg font-semibold">{currentPageName}</h1>
      </div>
    </header>
  )
}