"use client"

import React, { useEffect, useState } from "react"
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

  useEffect(() => {
    document.title = "Unauthorized | 妙音寺"

    const link: HTMLLinkElement =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link")
    link.rel = "icon"
    link.href = "/icon"

    document.getElementsByTagName("head")[0].appendChild(link)
  }, [])

  const { signOut } = useAuthActions()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      await signOut()
      push("/sign-in")
    } catch (error) {
      toast.error(String(error))
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4">
      <Alert className="w-full max-w-sm gap-y-2 has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] [&>svg]:size-5">
        <TriangleAlert />

        <AlertTitle className="text-base">Unauthorized Access</AlertTitle>

        <AlertDescription className="gap-2">
          <p>{`You don't have access to this application.`}</p>

          <p className="text-xs">
            Try signing in with a different account, or contact admin if you
            think this is a mistake.
          </p>

          <LoaderButton
            size="sm"
            className="mt-1.5"
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
