"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import ConnectApp from "./ConnectApp"

export default function WorkspacePage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [showConnectApp, setShowConnectApp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      setShowConnectApp(true);
    }
  };

  if (showConnectApp) {
    return <ConnectApp workspaceName={workspaceName} />;
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
    >
      <div
        className=" w-full max-w-sm space-y-4 rounded-lg p-8 shadow-xl m-8"
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
              Vibe Monitor
            </h1>
          </div>
          <p
            className="text-base mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            This will be your team&apos;s home for monitoring vibes


          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label htmlFor="workspace-name" className="mb-1 block">
              Workspace Name
            </Label>
            <Input
              type="text"
              id="workspace-name"
              placeholder="Enter workspace name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white hover:brightness-90 "
            style={{ backgroundColor: 'var(--color-text-brand)' }}
          >
            Continue
          </Button>
        </form>


      </div>
    </div>
  )
}