import * as OpenCC from "opencc-js"

import { useQuery } from "@/hooks/use-query"

import { api } from "@cvx/_generated/api"

const s2t = OpenCC.Converter({ from: "cn", to: "tw" })
const t2s = OpenCC.Converter({ from: "tw", to: "cn" })

export const useConverter = () => {
  const { data: excludedWords = [] } = useQuery(
    api.excludedWords.queries.getExcludedWords
  )

  const convertSCToTC = (text: string): string => {
    let tempText = text

    excludedWords.forEach((word, index) => {
      const placeholder = `__EXCL_${index}__`
      const regex = new RegExp(word, "g")
      tempText = tempText.replace(regex, placeholder)
    })

    let converted = s2t(tempText)

    excludedWords.forEach((word, index) => {
      const placeholder = `__EXCL_${index}__`
      converted = converted.replaceAll(placeholder, word)
    })

    return converted
  }

  const convertTCToSC = (text: string): string => t2s(text)

  return {
    convertSCToTC,
    convertTCToSC,
  }
}
