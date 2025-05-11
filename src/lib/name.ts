import { TITLES } from "@cvx/nameLists/schemas"

export const getNameWithTitle = (
  name: string,
  title?: (typeof TITLES)[number]
) => {
  if (!title) return name
  return title === "合家" ? `${name}${title}` : `${title}${name}`
}
