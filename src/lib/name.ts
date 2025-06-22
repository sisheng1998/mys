import { Category } from "@/types/category"
import { Title } from "@/types/nameList"
import { isAllEnglishCharacters } from "@/lib/string"

export const getNameWithTitle = (name: string, title?: Title) => {
  if (!title || title === "公司") return name
  return title === "合家" ? `${name}${title}` : `${title}${name}`
}

export const isTitleDisabled = (
  title?: Title,
  category?: Category
): boolean => {
  if (!category) return false

  const { titles, isExclusion } = category

  if (!titles || titles.length === 0) return false

  if (!title) return !isExclusion

  const isListed = titles.includes(title)

  return isExclusion ? isListed : !isListed
}

const TITLE_FONT_SIZE = 36
const CHINESE_NAME_FONT_SIZE = 48
const ENGLISH_NAME_FONT_SIZE = 40

export const getLabelText = (
  name: string,
  title?: Title
): [string, number][] => {
  let label: [string, number][] = []

  const fontSize = isAllEnglishCharacters(name)
    ? ENGLISH_NAME_FONT_SIZE
    : CHINESE_NAME_FONT_SIZE

  if (title === "合家") {
    label = [
      [name, fontSize],
      ["合家平安", TITLE_FONT_SIZE],
    ]
  } else if (title === "公司") {
    label = [
      [name, fontSize],
      ["生意興隆", TITLE_FONT_SIZE],
    ]
  } else {
    label = [
      [name, fontSize],
      ["出入平安", TITLE_FONT_SIZE],
    ]

    if (title) {
      label.unshift([title, TITLE_FONT_SIZE])
    }
  }

  return label
}
