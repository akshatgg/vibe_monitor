"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { tokenService } from "@/services/tokenService"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const hasValidToken = tokenService.hasValidToken()

      // List of auth pages that don't require authentication
      const authPaths = ["/auth", "/auth/google/callback"]
      const isAuthPage = authPaths.some(path => pathname.startsWith(path))

      if (!hasValidToken && !isAuthPage) {
        // No valid token and not on auth page - redirect to auth
        router.push("/auth")
        return
      }

      if (hasValidToken && isAuthPage) {
        // Has valid token but on auth page - redirect to workspace
        router.push("/workspace")
        return
      }

      // All checks passed
      setIsChecking(false)
    }

    checkAuth()
  }, [router, pathname])

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}