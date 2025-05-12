import { Category } from "@/types/category"
import { Title } from "@/types/nameList"

export const isCategoryDisabled = (category: Category, title?: Title) => {
  const { titles, isExclusion } = category

  if (!title) return isExclusion ? false : !!titles?.length

  if (!titles || titles.length === 0) return false

  const isListed = titles.includes(title)

  return isExclusion ? isListed : !isListed
}
