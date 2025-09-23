"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchWorkspaces } from "@/lib/features/workspaceSlice"
import { Skeleton } from "@/components/ui/skeleton"
import Loader from "@/components/ui/loader"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { workspaces, loading, error } = useSelector(
    (state: RootState) => state.workspace
  )

  useEffect(() => {
    dispatch(fetchWorkspaces())
  }, [dispatch])

  useEffect(() => {
    if (!loading && !error) {
      if (workspaces.length === 1) {
        // If user has only one workspace, redirect to it
        router.push(`/${workspaces[0].id}`)
      } else if (workspaces.length === 0) {
        // If user has no workspaces, redirect to workspace creation
        router.push('/workspace')
      } else {
        // If user has multiple workspaces, redirect to workspace selection
        router.push('/workspace')
      }
    }
  }, [workspaces, loading, error, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Workspaces</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link href="/workspace" className="text-blue-500 hover:underline">
            Go to workspace selection
          </Link>
        </div>
      </div>
    )
  }

  // This should rarely be reached as the useEffect should redirect
  return <Loader message="Please wait while we load your workspace." />
}
