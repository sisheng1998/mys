import { useLocale } from "@react-aria/i18n"
import { AriaNumberFieldProps } from "@react-aria/numberfield"
import {
  NumberFieldStateOptions,
  useNumberFieldState,
} from "@react-stately/numberfield"

export const CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "MYR",
  currencyDisplay: "narrowSymbol",
  currencySign: "accounting",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}

export const CurrencyDisplay = ({
  locale: customLocale,
  formatOptions = CURRENCY_FORMAT_OPTIONS,
  ...props
}: AriaNumberFieldProps & Partial<Pick<NumberFieldStateOptions, "locale">>) => {
  const hookLocale = useLocale().locale
  const locale = customLocale || hookLocale

  const numberFieldState = useNumberFieldState({
    ...props,
    locale,
    formatOptions,
  })

  return numberFieldState.inputValue
}
