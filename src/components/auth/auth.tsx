'use client'

import GoogleSignInButton from './GoogleSignInButton'
import Image from 'next/image'
import { authController } from '@/controllers/authController'

export default function Auth() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

    const result = await authController.handleGoogleSignIn(credentialString)

    if (result.success) {
      console.log('Authentication successful')
      window.location.href = result.redirectUrl || '/workspace'
    } else {
      console.error('Authentication failed:', result.error)
      // Handle error - could show toast notification
    }
  }

  const handleGoogleError = (error: string | Error) => {
    console.error('Google Sign-In error:', error)
    setError(typeof error === 'string' ? error : error.message)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Processing authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="sm-w-[50%] md-w-full max-w-sm space-y-4 rounded-lg p-8 shadow-xl m-8"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xl)'
      }}
    >
      {/* Logo and Brand Section */}
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Vibe Monitor"
            width={42}
            height={42}
            className="mr-3"
          />
          <h1
            className=" sm:text-xl md:text-2xl lg:text-2xl font-semibold"
            style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 'var(--font-semibold)',
            }}
          >
            Vibe Monitor
          </h1>
        </div>

        <div className="mb-8">

          <p
            className="leading-relaxed"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-relaxed)'
            }}
          >
           Sign in to monitor, trace, and troubleshoot your applications effortlessly.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Google Sign In Button */}
      <div className="space-y-4">
        <GoogleSignInButton
          onError={handleGoogleError}
          text="Continue with Google"
        />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span
              className="w-full border-t"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className="px-2"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--text-xs)'
              }}
            >
              Secure Authentication
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        <p
          className="text-center text-xs leading-relaxed"
          style={{
            color: 'var(--color-text-tertiary)',
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--leading-relaxed)'
          }}
        >
          By continuing, you agree to our{' '}
          <a
            href="#"
            className="underline hover:opacity-80 transition-opacity"
            style={{
              color: 'var(--color-text-brand)',
              transition: 'var(--transition-fast)'
            }}
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="#"
            className="underline hover:opacity-80 transition-opacity"
            style={{
              color: 'var(--color-text-brand)',
              transition: 'var(--transition-fast)'
            }}
          >
            Privacy Policy
          </a>
        </p>

     
    
      </div>
    </div>
  )
}