import { Construction, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface PageInProgressProps {
  title?: string
  showBackButton?: boolean
  backUrl?: string
  estimatedTime?: string
}

export function PageInProgress({
  title = "Page Under Construction",
  showBackButton = true,
  backUrl = "/",
  estimatedTime
}: PageInProgressProps) {
  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
      <div className="mb-8">
        <div className="relative">
          <Construction className="w-24 h-24 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <div className="absolute -top-2 -right-2">
            <Clock className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        <Separator className="my-4" />

    

        {estimatedTime && (
          <div className="bg-muted/50 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2 justify-center">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Estimated completion: {estimatedTime}
              </span>
            </div>
          </div>
        )}

        {showBackButton && (
          <div className="pt-6">
            <Button asChild variant="outline">
              <Link href={backUrl} className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-12 w-full max-w-xs">
        <div className="bg-muted rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-full w-1/3 rounded-full animate-pulse" />
        </div>
      </div>
      </div>
    </div>
  )
}