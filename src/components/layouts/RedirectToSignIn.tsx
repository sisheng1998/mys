"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"
import { toast } from "sonner"

import { LoadingAnimation } from "@/components/layouts/Preloader"

const RedirectToSignIn = () => {
  const { push } = useRouter()
  const { signOut } = useAuthActions()

  useEffect(() => {
    let isMounted = true

    const handleRedirect = async () => {
      try {
        await signOut()
        if (isMounted) push("/sign-in")
      } catch (error) {
        toast.error(String(error))
      }
    }

    handleRedirect()

    return () => {
      isMounted = false
    }
  }, [signOut, push])

  return <LoadingAnimation />
}

export default RedirectToSignIn
