const CHINESE_REGEX = /[\u4E00-\u9FFF]/g

export const convertChineseToUnicode = (str: string): string =>
  str
    .replace(
      CHINESE_REGEX,
      (char) => char.codePointAt(0)?.toString(16).padStart(4, "0") + " "
    )
    .trim()
