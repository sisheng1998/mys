"use client"

import React from "react"
import { useAuthActions } from "@convex-dev/auth/react"

const SignIn = () => {
  const { signIn } = useAuthActions()

  return (
    <button onClick={() => void signIn("google")}>Sign in with Google</button>
  )
}

export default SignIn
