"use client"

import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useBreadcrumb } from "@/contexts/breadcrumb"

const AppBreadcrumb = () => {
  const { links } = useBreadcrumb()

  if (links.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, index) => {
          const isActiveLink = index === links.length - 1

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem
                className={cn(!isActiveLink && "hidden md:block")}
              >
                {isActiveLink ? (
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                ) : link.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  link.label
                )}
              </BreadcrumbItem>

              {!isActiveLink && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default AppBreadcrumb
