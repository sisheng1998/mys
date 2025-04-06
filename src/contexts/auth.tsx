"use client"

import React, { createContext, ReactNode, useContext } from "react"
import { useQuery } from "convex/react"
import { FunctionReturnType } from "convex/server"

import { api } from "@cvx/_generated/api"

type User = NonNullable<FunctionReturnType<typeof api.users.getCurrentUser>>

type AuthContextType = {
  user: User
}

const Auth = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  user: User
  children: ReactNode
}

export const AuthProvider = ({ user, children }: AuthProviderProps) => {
  const currentUser = useQuery(api.users.getCurrentUser) ?? user

  return (
    <Auth.Provider
      value={{
        user: currentUser,
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
