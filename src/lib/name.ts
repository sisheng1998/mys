import { Title } from "@/types/nameList"

export const getNameWithTitle = (name: string, title?: Title) => {
  if (!title) return name
  return title === "合家" ? `${name} (${title})` : `(${title}) ${name}`
}
