export const CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "MYR",
  currencyDisplay: "narrowSymbol",
  currencySign: "accounting",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}

export const formatCurrency = (
  value: number,
  locale?: string,
  formatOptions: Intl.NumberFormatOptions = CURRENCY_FORMAT_OPTIONS
) => new Intl.NumberFormat(locale, formatOptions).format(value)

export const formatNumber = (value: number) =>
  formatCurrency(value, undefined, {
    ...CURRENCY_FORMAT_OPTIONS,
    style: "decimal",
  })
