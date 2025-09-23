"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DynamicHeader } from "@/components/dynamic-header"
import { AuthGuard } from "@/components/auth-guard"

const authPaths = ["/auth", "/auth/google/callback", "/workspace"]

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if current path is an auth page
  const isAuthPage = authPaths.some(path => pathname.startsWith(path))

  return (
    <AuthGuard>
      {isAuthPage ? (
        // Render without sidebar for auth pages
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      ) : (
        // Render with sidebar for all other pages
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden">
            <AppSidebar />
            <SidebarInset className="flex-1 min-w-0 min-h-0">
              <DynamicHeader />
              <div className="flex flex-1 flex-col h-full overflow-auto">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      )}
    </AuthGuard>
  )
}