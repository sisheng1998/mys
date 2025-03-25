"use client"

import React from "react"
import { useAuthActions } from "@convex-dev/auth/react"

import { useRouter } from "@/hooks/useRouter"

const Home = () => {
  const { push } = useRouter()
  const { signOut } = useAuthActions()

  return (
    <button
      onClick={async () => {
        await signOut()
        push("/login")
      }}
    >
      Sign out
    </button>
  )
}

export default Home
