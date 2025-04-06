"use client"

import React, { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { LogOut, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { useRouter } from "@/hooks/use-router"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderButton } from "@/components/ui/loader-button"
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
      <Alert className="w-full max-w-sm">
        <TriangleAlert />

        <AlertTitle>Unauthorized</AlertTitle>

        <AlertDescription className="gap-3">
          <p>You are not authorized to access this application.</p>

          <LoaderButton
            size="sm"
            onClick={handleClick}
            isLoading={isLoading}
            icon={LogOut}
          >
            Sign Out
          </LoaderButton>
        </AlertDescription>
      </Alert>
    </main>
  )
}
