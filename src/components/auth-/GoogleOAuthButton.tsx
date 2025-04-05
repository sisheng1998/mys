"use client"

import React, { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { toast } from "sonner"

import { LoaderButton } from "@/components/ui/loader-button"
import Google from "@/icons/Google"

const GoogleOAuthButton = () => {
  const { signIn } = useAuthActions()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      await signIn("google")
    } catch (error) {
      toast.error(String(error))
      setIsLoading(false)
    }
  }

  return (
    <LoaderButton
      size="lg"
      className="w-full"
      onClick={handleClick}
      isLoading={isLoading}
      icon={Google}
    >
      Continue with Google
    </LoaderButton>
  )
}

export default GoogleOAuthButton
