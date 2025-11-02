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

export const normalizeSymbol = (input: string): string => {
  let text = input.trim()

  if (text.startsWith("（")) {
    text = "(" + text.slice(1)
  }

  if (text.endsWith("）")) {
    text = text.slice(0, -1) + ")"
  }

  return text.replace(/\s{2,}/g, " ").trim()
}

const converter = OpenCC.Converter({ from: "cn", to: "tw" })

const excludedWords = ["莹", "合"]

export const convertSCToTC = (text: string): string => {
  let tempText = text

  excludedWords.forEach((word, index) => {
    const placeholder = `__EXCL_${index}__`
    const regex = new RegExp(word, "g")
    tempText = tempText.replace(regex, placeholder)
  })

  let converted = converter(tempText)

  excludedWords.forEach((word, index) => {
    const placeholder = `__EXCL_${index}__`
    converted = converted.replaceAll(placeholder, word)
  })

  return converted
}

export const isAllEnglishCharacters = (text: string): boolean =>
  /^[A-Za-z\s'\/\-\(\)]+$/.test(text)

export const getExcelSheetName = (name: string): string => {
  if (!name) return "Sheet1"

  let sheetName = name.split(/[(（]/)[0].trim()

  sheetName = sheetName.replace(/[:\\/?*\[\]]/g, "_")

  sheetName = sheetName.replace(/_+/g, "_")

  sheetName = sheetName.replace(/^_+|_+$/g, "").trim()

  if (!sheetName) sheetName = "Sheet1"

  return sheetName.substring(0, 31)
}
