import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"
import createMDX from "@next/mdx"
import createJiti from "jiti"

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti("./src/env")

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
