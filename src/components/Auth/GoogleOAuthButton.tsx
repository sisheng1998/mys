"use client"

import React, { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"

import { LoaderButton } from "@/components/ui/loader-button"
import Google from "@/icons/Google"

// TODO: Add toast notification

const GoogleOAuthButton = () => {
  const { signIn } = useAuthActions()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      await signIn("google")
    } catch (error) {
      console.error(error)
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
