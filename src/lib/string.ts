import * as OpenCC from "opencc-js"

export const getValidFilename = (
  input: string,
  replacementChar = "_"
): string => {
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g
  const reservedNames = new Set([
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
  ])

  let sanitized = input.replace(invalidChars, replacementChar)

  sanitized = sanitized.replace(/[. ]+$/, "")

  if (sanitized.length === 0) {
    sanitized = "untitled"
  }

  sanitized = sanitized.replace(/^\.+/, replacementChar)

  if (sanitized.length > 255) {
    sanitized = sanitized.slice(0, 255)
  }

  const baseName = sanitized.split(".")[0].toUpperCase()
  if (reservedNames.has(baseName)) {
    sanitized = "_" + sanitized
  }

  return sanitized
}

const converter = OpenCC.Converter({ from: "cn", to: "tw" })

export const convertSCToTC = (text: string): string => converter(text)
