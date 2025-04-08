"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"
import { toast } from "sonner"

import Logo from "@/icons/Logo"

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

  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <Logo className="text-primary size-20 animate-spin" />
    </div>
  )
}

export default RedirectToSignIn
