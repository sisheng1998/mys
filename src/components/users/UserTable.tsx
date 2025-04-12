"use client"

import React from "react"

import { useQuery } from "@/hooks/use-query"

import { api } from "@cvx/_generated/api"

const UserTable = () => {
  const { status, data, error, isSuccess, isPending, isError } = useQuery(
    api.users.queries.list
  )
  console.log(status, data, error, isSuccess, isPending, isError)
  return <div>UserTable</div>
}

export default UserTable
