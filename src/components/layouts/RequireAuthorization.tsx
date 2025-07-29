"use client"

import React, { useEffect, useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { LogOut, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { useRouter } from "@/hooks/use-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-2 flex items-center justify-center">
            <TriangleAlert className="text-destructive size-10" />
          </div>

          <CardTitle className="text-destructive">Unauthorized</CardTitle>
          <CardDescription>{`You don't have access to the application`}</CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm">
          Try signing in with a different account, or contact the administrator
          if you think this is a mistake.
        </CardContent>

        <CardFooter className="justify-center">
          <LoaderButton
            onClick={handleClick}
            isLoading={isLoading}
            icon={LogOut}
          >
            Sign Out
          </LoaderButton>
        </CardFooter>
      </Card>
    </main>
  )
}
