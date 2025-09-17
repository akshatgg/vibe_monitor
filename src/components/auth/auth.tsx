'use client'

import GoogleSignInButton from './GoogleSignInButton'
import Image from 'next/image'

export default function Auth() {
  const handleGoogleSuccess = async (credentialString: string) => {
    console.log('Google Sign-In successful:', credentialString)

    try {
      // Decode the JWT token to get user information
      const payload = JSON.parse(atob(credentialString.split('.')[1]))
      console.log('User info:', payload)

      // Send user data to FastAPI backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialString,
          google_token: credentialString,
          user_info: {
            email: payload.email,
            name: payload.name,
            last_name: payload.family_name,
            picture: payload.picture,
            uid: payload.sub
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Store access token for future API calls
        localStorage.setItem('access_token', data.access_token)
        console.log('Authentication successful:', data)

        // Redirect to workspace or dashboard
        window.location.href = '/workspace'
      } else {
        console.error('Backend authentication failed')
      }
    } catch (error) {
      console.error('Failed to authenticate:', error)
    }
  }

  const handleGoogleError = (error: string | Error) => {
    console.error('Google Sign-In error:', error)
    // Handle sign-in error
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

      {/* Google Sign In Button */}
      <div className="space-y-4">
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
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