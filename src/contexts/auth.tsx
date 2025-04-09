"use client"

import React, { createContext, ReactNode, useContext } from "react"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { FunctionReturnType } from "convex/server"

import RedirectToSignIn from "@/components/layouts/RedirectToSignIn"

import { api } from "@cvx/_generated/api"

type User = NonNullable<FunctionReturnType<typeof api.users.getCurrentUser>>

type AuthContextType = {
  user: User
}

const Auth = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  preloadedUser: Preloaded<typeof api.users.getCurrentUser>
  children: ReactNode
}

export const AuthProvider = ({
  preloadedUser,
  children,
}: AuthProviderProps) => {
  const user = usePreloadedQuery(preloadedUser)

  if (!user) return <RedirectToSignIn />

  return (
    <Auth.Provider
      value={{
        user,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(Auth)

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider")
  }

  return context
}
