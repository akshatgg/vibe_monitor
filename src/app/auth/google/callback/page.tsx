'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { tokenService } from '@/services/tokenService'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing Google authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')

        if (error) {
          setStatus('Authentication failed')
          console.error('OAuth error:', error)
          router.replace('/auth?error=' + encodeURIComponent(error))
          return
        }

        if (!code) {
          setStatus('No authorization code received')
          router.replace('/auth?error=no_code')
          return
        }

        setStatus('Exchanging code for tokens...')

        // Make POST request to backend callback endpoint with params
        const callbackParams = new URLSearchParams({
          code: code,
          redirect_uri: `${window.location.origin}/auth/google/callback`
        })

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
        const response = await fetch(`${backendUrl}/api/v1/auth/callback?${callbackParams.toString()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Store tokens using tokenService
        if (data.access_token && data.refresh_token) {
          tokenService.setTokens({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in  // Default to 1 hour if not provided
          })
        }

        setStatus('Authentication successful! Redirecting...')

        // Redirect to dashboard or home page
        router.replace('/workspace')

      } catch (error) {
        console.error('Callback error:', error)
        setStatus('Authentication failed')
        router.replace('/auth?error=callback_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>{status}</p>
      </div>
    </div>
  )
}