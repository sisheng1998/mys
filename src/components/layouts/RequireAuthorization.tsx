"use client"

import React, { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { useRouter } from "@/hooks/use-router"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth"

const RequireAuthorization = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  return !user.isAuthorized ? <Unauthorized /> : children
}

export default RequireAuthorization

const Unauthorized = () => {
  const { push } = useRouter()
  const { signOut } = useAuthActions()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      await signOut()
      push("/login")
    } catch (error) {
      toast.error(String(error))
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4">
      <Alert className="w-full max-w-sm gap-y-2">
        <TriangleAlert />

        <AlertTitle>Unauthorized Access</AlertTitle>

        <AlertDescription className="gap-2 text-xs">
          <p>{`It looks like you don't have access to this application.`}</p>

          <p>
            Try signing in with a different account, or contact admin if you
            think this is a mistake.
          </p>

          <Button
            size="sm"
            className="mt-1"
            onClick={handleClick}
            disabled={isLoading}
          >
            Okay
          </Button>
        </AlertDescription>
      </Alert>
    </main>
  )
}
