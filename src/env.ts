import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT: z.string().min(1),
    CONVEX_SITE_URL: z.string().url(),
    SITE_URL: z.string().url(),
    JWKS: z.string().min(1),
    JWT_PRIVATE_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  },
  runtimeEnv: {
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
    SITE_URL: process.env.SITE_URL,
    JWKS: process.env.JWKS,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  },
})
