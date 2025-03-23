import React from "react"
import { ImageResponse } from "next/og"

import Logo from "@/icons/Logo"

export const size = {
  width: 240,
  height: 240,
}

export const contentType = "image/png"

const Icon = () =>
  new ImageResponse(
    (
      <div
        style={{
          ...size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(225, 29, 72)", // primary
          borderRadius: 40,
        }}
      >
        <Logo
          style={{
            width: size.width * 0.85,
            height: size.height * 0.85,
            color: "rgb(255, 241, 242)", // primary-foreground
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )

export default Icon
