"use client"

import { useCallback, useState } from "react"

export const useDialog = () => {
  const [open, onOpenChange] = useState<boolean>(false)

  const trigger = useCallback(() => onOpenChange(true), [onOpenChange])

  return { props: { open, onOpenChange }, trigger }
}
