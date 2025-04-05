"use client"

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

type Link = {
  label: string
  href?: string
}

type BreadcrumbContextType = {
  links: Link[]
  setLinks: (links: Link[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
)

type BreadcrumbProviderProps = {
  children: ReactNode
}

export const BreadcrumbProvider = ({ children }: BreadcrumbProviderProps) => {
  const [links, setLinks] = useState<Link[]>([])

  return (
    <BreadcrumbContext.Provider value={{ links, setLinks }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useBreadcrumb = (): BreadcrumbContextType => {
  const context = useContext(BreadcrumbContext)

  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider")
  }

  return context
}

export const Breadcrumb = ({ links }: { links: Link[] }) => {
  const { setLinks } = useBreadcrumb()

  useEffect(() => {
    setLinks(links)
    return () => setLinks([])
  }, [links, setLinks])

  return null
}
