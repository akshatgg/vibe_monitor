"use client";

import { useState } from "react";
import { ChevronDown, Plus, Building2, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCurrentWorkspace, type Workspace } from "@/lib/features/workspaceSlice";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


export function WorkspaceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { workspaces, currentWorkspace, loading } = useAppSelector((state) => state.workspace);

  const getWorkspaceInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const truncateName = (name: string, maxLength: number = 16) => {
    return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
  };

  const handleWorkspaceSelect = (workspace: Workspace) => {
    dispatch(setCurrentWorkspace(workspace));
    setIsOpen(false);
    // Navigate to the workspace dashboard
    router.push(`/${workspace.id}`);
  };

  const handleCreateNewWorkspace = () => {
    setIsOpen(false);
    router.push("/workspace");
  };

  // Default workspace display if none selected
  const displayWorkspace = currentWorkspace || {
    name: "Select Workspace",
    domain: "",
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: currentWorkspace
                      ? 'var(--color-blue-line)'
                      : 'var(--color-surface-secondary)',
                    color: currentWorkspace
                      ? 'white'
                      : 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {currentWorkspace ? (
                    getWorkspaceInitial(currentWorkspace.name)
                  ) : (
                    <Building2 className="h-4 w-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {truncateName(displayWorkspace.name)}
                  </span>
                  <span
                    className="truncate text-xs"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {currentWorkspace?.domain || "No workspace selected"}
                  </span>
                </div>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-72"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel
              className="font-medium text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Workspaces
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {loading ? (
              <div className="px-2 py-6 text-center">
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Loading workspaces...
                </div>
              </div>
            ) : workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => handleWorkspaceSelect(workspace)}
                  className="cursor-pointer p-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                      style={{
                        backgroundColor: currentWorkspace?.id === workspace.id
                          ? 'var(--color-blue-line)'
                          : 'var(--color-surface-secondary)',
                        color: currentWorkspace?.id === workspace.id
                          ? 'white'
                          : 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {getWorkspaceInitial(workspace.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {workspace.name}
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {workspace.domain || "No domain"}
                      </div>
                    </div>
                    {currentWorkspace?.id === workspace.id && (
                      <Check
                        className="h-4 w-4 shrink-0"
                        style={{ color: 'var(--color-text-brand)' }}
                      />
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  No workspaces
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Create your first workspace to get started
                </p>
              </div>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCreateNewWorkspace}
              className="cursor-pointer p-3"
              style={{ color: 'var(--color-text-brand)' }}
            >
              <Plus className="h-4 w-4 mr-3" />
              <span className="font-medium">Create new workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}