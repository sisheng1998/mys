import { fileURLToPath } from "node:url"
import createMDX from "@next/mdx"
import createJiti from "jiti"

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti("./src/env")

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm", { strict: true, throwOnError: true }]],
  },
})

export default withMDX(nextConfig)
