"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"

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
