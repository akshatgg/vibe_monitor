/* eslint-disable react/jsx-no-comment-textnodes */
"use client";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ConnectAppProps {
  workspaceName: string;
}

export default function ConnectApp({ }: ConnectAppProps) {
  const [apiKey] = useState("vibe_sk_1234567890abcdef");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = () => {
    setIsLoading(true);
    console.log("Testing connection...");

    // Show loader for 2 seconds then redirect
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div
        className="w-full max-w-sm space-y-6 rounded-lg p-8 shadow-xl m-8"
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
              className="sm:text-xl md:text-2xl lg:text-2xl font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Connect your app
            </h1>
          </div>
          <p
            className="text-base mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Follow these simple steps to start monitoring vibes
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Copy API Key */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white font-semibold"
                style={{ backgroundColor: 'var(--color-text-brand)' }}
              >
                1
              </div>
              <h3
                className="text-lg font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Copy your API key
              </h3>
            </div>
            <div
              className="rounded-md p-4 font-mono text-sm"
              style={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            >
              <div className="flex items-center justify-between">
                <code>{apiKey}</code>
                <Button
                  onClick={handleCopyApiKey}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Paste in App */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white font-semibold"
                style={{ backgroundColor: 'var(--color-text-brand)' }}
              >
                2
              </div>
              <h3
                className="text-lg font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Paste in your app
              </h3>
            </div>
            <div
              className="rounded-md p-4 font-mono text-sm overflow-x-auto"
              style={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
              }}
            >
                {/* provide colour to our snippet */}
                <pre>
                <span style={{ color: '#6A9955' }}>// Initialize Vibe monitoring</span>{'\n'}
                <span style={{ color: '#C586C0' }}>import</span>{' '}
                <span style={{ color: '#569CD6' }}>{'{'}</span>{' '}
                <span style={{ color: '#9CDCFE' }}>Vibe</span>{' '}
                <span style={{ color: '#569CD6' }}>{'}'}</span>{' '}
                <span style={{ color: '#C586C0' }}>from</span>{' '}
                <span style={{ color: '#CE9178' }}>&apos;@vibe/sdk&apos;</span>
                <span style={{ color: '#569CD6' }}>;</span>{'\n'}
                <span style={{ color: '#C586C0' }}>const</span>{' '}
                <span style={{ color: '#9CDCFE' }}>vibe</span>{' '}
                <span style={{ color: '#D4D4D4' }}>=</span>{' '}
                <span style={{ color: '#C586C0' }}>new</span>{' '}
                <span style={{ color: '#4EC9B0' }}>Vibe</span>
                <span style={{ color: '#569CD6' }}>({'{'}</span>{'\n'}
                {'  '}
                <span style={{ color: '#9CDCFE' }}>apiKey</span>
                <span style={{ color: '#569CD6' }}>:</span>{' '}
                <span style={{ color: '#CE9178' }}>&apos;</span>
                <span style={{ color: '#CE9178' }}>{apiKey}</span>
                <span style={{ color: '#CE9178' }}>&apos;</span>{'\n'}
                <span style={{ color: '#569CD6' }}>{'});'}</span>
              </pre>
            </div>
          </div>

          {/* Step 3: Test Connection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white font-semibold"
                style={{ backgroundColor: 'var(--color-text-brand)' }}
              >
                3
              </div>
              <h3
                className="text-lg font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                See vibes flow! 📊
              </h3>
            </div>
            <p
              className="text-sm ml-11"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Test your connection to make sure everything is working
            </p>
            <div className="ml-11">
              <Button
                onClick={handleTestConnection}
                disabled={isLoading}
                className="text-white hover:brightness-90"
                style={{ backgroundColor: 'var(--color-text-brand)' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing connection...
                  </>
                ) : (
                  "Test connection"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}