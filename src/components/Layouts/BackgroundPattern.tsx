import React from "react"

const BackgroundPattern = () => (
  <div
    className="pointer-events-none fixed inset-0 isolate -z-10 bg-current opacity-5"
    style={{
      maskImage: "url(/images/endless-clouds.svg)",
    }}
  />
)

export default BackgroundPattern
