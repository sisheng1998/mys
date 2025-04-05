"use client"

import React from "react"
import { useAuthActions } from "@convex-dev/auth/react"

import { useRouter } from "@/hooks/use-router"
import { useAuth } from "@/contexts/auth"

const Home = () => {
  const { user } = useAuth()
  const { push } = useRouter()
  const { signOut } = useAuthActions()

  return (
    <>
      <div>{user.name}</div>
      <button
        onClick={async () => {
          await signOut()
          push("/login")
        }}
      >
        Sign out
      </button>
    </>
  )
}

export default Home
