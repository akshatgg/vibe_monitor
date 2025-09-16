'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GoogleCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    // const state = urlParams.get('state')
    const error = urlParams.get('error')

    // Create new URL for the main auth page with the parameters
    const authUrl = new URL('/auth', window.location.origin)

    if (code) {
      authUrl.searchParams.set('code', code)
    }
    // if (state) {
    //   authUrl.searchParams.set('state', state)
    // }
    if (error) {
      authUrl.searchParams.set('error', error)
    }

    // Redirect to the main auth page with parameters
    router.replace(authUrl.toString())
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Processing Google authentication...</p>
      </div>
    </div>
  )
}