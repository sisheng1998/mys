import * as OpenCC from "opencc-js"

const CHINESE_REGEX = /[\u4E00-\u9FFF]/g

export const convertChineseToUnicode = (str: string): string =>
  str
    .replace(
      CHINESE_REGEX,
      (char) => char.codePointAt(0)?.toString(16).padStart(4, "0") + " "
    )
    .trim()

const s2t = OpenCC.Converter({ from: "cn", to: "tw" })
const t2s = OpenCC.Converter({ from: "tw", to: "cn" })

export const convertSCToTC = (text: string): string => s2t(text)

export const convertTCToSC = (text: string): string => t2s(text)
