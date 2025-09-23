"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchWorkspaces, createWorkspace, clearCreateError, setCurrentWorkspace } from "@/lib/features/workspaceSlice"
import ConnectApp from "./ConnectApp"

export default function WorkspacePage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDomain, setWorkspaceDomain] = useState("");
  const [visibleToOrg, setVisibleToOrg] = useState(false);
  const [showConnectApp, setShowConnectApp] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { workspaces, loading, error, createLoading, createError, currentWorkspace } = useSelector(
    (state: RootState) => state.workspace
  );

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (createError) {
      const timer = setTimeout(() => {
        dispatch(clearCreateError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [createError, dispatch]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim() && workspaceDomain.trim()) {
      const result = await dispatch(createWorkspace({
        name: workspaceName.trim(),
        domain: workspaceDomain.trim(),
        visible_to_org: visibleToOrg
      }));

      if (createWorkspace.fulfilled.match(result)) {
        // Workspace created successfully, refresh the list
        dispatch(fetchWorkspaces());
        // Set the newly created workspace as current
        dispatch(setCurrentWorkspace(result.payload));
        setWorkspaceName("");
        setWorkspaceDomain("");
        setVisibleToOrg(false);
        setShowCreateForm(false);
        // Navigate to the new workspace
        window.location.href = `/${result.payload.id}`;
      }
      // If creation failed, the error will be shown via createError state
    }
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      dispatch(setCurrentWorkspace(workspace));
      // Navigate to the workspace dashboard instead of showing ConnectApp
      window.location.href = `/${workspaceId}`;
    }
  };

  if (showConnectApp && (currentWorkspace || selectedWorkspace)) {
    return <ConnectApp
      workspaceName={currentWorkspace?.name || workspaceName}
      onBack={() => setShowConnectApp(false)}
    />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div
        className="w-full max-w-md space-y-6 rounded-lg p-8 shadow-xl m-8"
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
            Select a workspace or create a new one
          </p>
        </div>

        {error && (
          <div
            className="p-4 rounded-lg border-l-4 flex items-center space-x-3"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderLeftColor: '#ef4444',
              color: '#dc2626'
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-sm">Failed to load workspaces</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          </div>
        )}

        {createError && (
          <div
            className="p-4 rounded-lg border-l-4 flex items-center space-x-3"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderLeftColor: '#ef4444',
              color: '#dc2626'
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-sm">Failed to create workspace</p>
              <p className="text-xs opacity-90">{createError}</p>
            </div>
          </div>
        )}

        {/* Existing Workspaces */}
        {loading ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Your Workspaces
            </h3>
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          </div>
        ) : workspaces.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Your Workspaces
              </h3>
              <span
                className="text-sm px-2 py-1 rounded"
                style={{
                  backgroundColor: 'var(--color-surface-secondary)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {workspaces.length}
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto sidebar-scrollbar">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceSelect(workspace.id)}
                  className="w-full p-3 rounded-lg border text-left hover:shadow-sm transition-shadow duration-150"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{workspace.name}</div>
                      <div
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Created {new Date(workspace.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <svg className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div
              className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-surface-secondary)',
                color: 'var(--color-text-secondary)'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
              No workspaces yet
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Create your first workspace to get started
            </p>
          </div>
        )}

        {workspaces.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" style={{ borderColor: 'var(--color-border)' }} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span
                className="bg-inherit px-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Or
              </span>
            </div>
          </div>
        )}

        {/* Create New Workspace */}
        {!showCreateForm ? (
          <Button
            onClick={() => setShowCreateForm(true)}
            variant="outline"
            className="w-full"
            style={{
              borderColor: 'var(--color-text-brand)',
              color: 'var(--color-text-brand)'
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Workspace
          </Button>
        ) : (
          <div
            className="p-4 rounded-lg border space-y-4"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface-secondary)'
            }}
          >
            <h4 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Create New Workspace
            </h4>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="workspace-name" className="mb-2 block">
                  Workspace Name
                </Label>
                <Input
                  type="text"
                  id="workspace-name"
                  placeholder="Enter workspace name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  disabled={createLoading}
                />
              </div>

              <div>
                <Label htmlFor="workspace-domain" className="mb-2 block">
                  Domain
                </Label>
                <Input
                  type="text"
                  id="workspace-domain"
                  placeholder="Enter workspace domain"
                  value={workspaceDomain}
                  onChange={(e) => setWorkspaceDomain(e.target.value)}
                  disabled={createLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visible-to-org"
                  checked={visibleToOrg}
                  onCheckedChange={(checked) => setVisibleToOrg(checked === true)}
                  disabled={createLoading}
                />
                <Label htmlFor="visible-to-org" className="text-sm">
                  Visible to organization
                </Label>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createLoading || !workspaceName.trim() || !workspaceDomain.trim()}
                  className="flex-1 text-white"
                  style={{ backgroundColor: 'var(--color-text-brand)' }}
                >
                  {createLoading ? "Creating..." : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setWorkspaceName("");
                    setWorkspaceDomain("");
                    setVisibleToOrg(false);
                    dispatch(clearCreateError());
                  }}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}