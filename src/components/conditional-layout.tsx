"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DynamicHeader } from "@/components/dynamic-header"

const authPaths = ["/auth", "/login", "/register", "/signup", "/signin", "/forgot-password", "/reset-password"]

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if current path is an auth page
  const isAuthPage = authPaths.some(path => pathname.startsWith(path))

  if (isAuthPage) {
    // Render without sidebar for auth pages
    return (
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    )
  }

  // Render with sidebar for all other pages
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DynamicHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}