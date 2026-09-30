"use client"

import { Button } from "@rewardkit/packages/ui/components/button"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  const navigateToHome = () => {
    return router.push("/")
  }
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-xl font-bold tracking-tight">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist. It may have been moved or
        removed permanently.
      </p>

      <div className={"mt-4 flex lg:flex-row flex-col items-center justify-center gap-2"}>
        <Button onClick={() => navigateToHome()}>Go Home</Button>
        <Button variant={"link"} onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    </div>
  )
}
