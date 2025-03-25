import { useCallback } from "react"
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useRouter as useNextRouter, usePathname } from "next/navigation"
import NProgress from "nprogress"

export const useRouter = () => {
  const router = useNextRouter()
  const pathname = usePathname()

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      if (href !== pathname) NProgress.start()
      router.replace(href, options)
    },
    [router, pathname]
  )

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      if (href !== pathname) NProgress.start()
      router.push(href, options)
    },
    [router, pathname]
  )

  return {
    ...router,
    replace,
    push,
  }
}
