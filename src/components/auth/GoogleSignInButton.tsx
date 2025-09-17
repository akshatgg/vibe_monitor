'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface GoogleSignInButtonProps {
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
  text?: string
}

export default function GoogleSignInButton({
  onError,
  disabled = false,
  className = "",
  text = "Sign in with Google"
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (window.google) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => setScriptLoaded(true)
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script')
      onError?.('Failed to load Google Sign-In')
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [onError])

  const handleGoogleSignIn = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('Google Client ID not configured')
      onError?.('Google Sign-In not properly configured')
      return
    }

    setIsLoading(true)

    try {
      // Use frontend callback URL to match Google console config
      const redirectUri = `${window.location.origin}/auth/google/callback`
      const scope = 'openid email profile'
      const responseType = 'code'
      // const state = Math.random().toString(36).substring(2, 15)

      // Store state for validation
      // localStorage.setItem('oauth_state', state)
      // console.log('Generated state:', state)

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        response_type: responseType,
        // state,
        access_type: 'offline',
        prompt: 'consent'
      })

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

      // Redirect to Google OAuth
      window.location.href = authUrl

    } catch (error) {
      setIsLoading(false)
      console.error('Google Sign-In error:', error)
      onError?.(error instanceof Error ? error.message : 'Unknown error occurred')
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={`w-full border border-gray-700 hover:bg-gray-900 transition-colors ${className}`}
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      {isLoading ? 'Signing in...' : text}
    </Button>
  )
}