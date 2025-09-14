"use client";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import GoogleSignInButton from "@/components/auth/GoogleSignInButton"

export default function SigninPage() {
  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center px-4"  
    >
      <div 
        className="w-full max-w-sm space-y-4 rounded-lg p-8 shadow-xl" 
        style={{ 
          backgroundColor: 'var(--color-surface)',
       
        }}
      >
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Vibe Monitor"
              width={40}
              height={40}
              className="mr-3"
            />
            <h1 
              className="text-2xl font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Vibe Monitor
            </h1>
          </div>
          <p 
            className="text-base mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Welcome back! Sign in to your account.
          </p>
        </div>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-1 block">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-1 block">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span 
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Remember me
              </span>
            </label>
            <a 
              href="#" 
              className="text-sm underline"
              style={{ color: 'var(--color-text-brand)' }}
            >
              Forgot password?
            </a>
          </div>
          <Button 
            type="submit" 
            className="w-full text-white hover:brightness-90" 
            style={{ backgroundColor: 'var(--color-text-brand)' }}
          >
            Sign In
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" style={{ borderColor: 'var(--color-border)' }} />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span 
              className="px-2" 
              style={{ 
                backgroundColor: 'var(--color-surface)', 
                color: 'var(--color-text-tertiary)' 
              }}
            >
              or Continue with
        </span>
          </div>
        </div>

        <GoogleSignInButton />

        <p 
          className="text-center text-xs"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          By continuing, you agree to our{' '}
          <a 
            href="#" 
            className="underline"
            style={{ color: 'var(--color-text-brand)' }}
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a 
            href="#" 
            className="underline"
            style={{ color: 'var(--color-text-brand)' }}
          >
            Privacy Policy
          </a>.
        </p>

        <div className="text-center mt-4">
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Don&apos;t have an account?{' '}
            <a 
              href="/auth/signup" 
              className="font-medium underline"
              style={{ color: 'var(--color-text-brand)' }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}