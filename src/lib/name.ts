import { Category } from "@/types/category"
import { Title } from "@/types/nameList"

export const getNameWithTitle = (name: string, title?: Title) => {
  if (!title) return name
  return title === "合家" ? `${name} (${title})` : `(${title}) ${name}`
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
