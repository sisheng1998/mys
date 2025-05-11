"use client"

import React, { useEffect } from "react"

import { useRouter } from "@/hooks/use-router"
import { LoadingAnimation } from "@/components/layouts/Preloader"

const Error = () => {
  const { replace } = useRouter()

  useEffect(() => {
    replace("/templates")
  }, [replace])

  return <LoadingAnimation />
}

export default Error
