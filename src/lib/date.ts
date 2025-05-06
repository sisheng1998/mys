import dayjs from "dayjs"
import { PluginLunar } from "dayjs-plugin-lunar"
import timezone from "dayjs/plugin/timezone"

export const TIMEZONE = "Asia/Kuala_Lumpur"

dayjs.extend(timezone)
dayjs.extend(PluginLunar)

dayjs.tz.setDefault(TIMEZONE)

export default dayjs

const SEPARATOR = "|"

export const getLunarDateFromSolarDate = (date: Date): string => {
  const dayjsDate = dayjs(date)

  const year = dayjsDate.toLunarYear().getYear()
  const month = dayjsDate.toLunarMonth().getMonthWithLeap()
  const day = dayjsDate.toLunarDay().getDay()

  return `${year}${SEPARATOR}${month}${SEPARATOR}${day}`
}

export const getLunarDateInChinese = (date: string): string => {
  const [year, month, day] = date.split(SEPARATOR)
  const dayjsDate = dayjs.lunar(Number(year), Number(month), Number(day))
  return dayjsDate.format("LMLD")
}

export const getSolarDateFromLunarDate = (date: string): Date => {
  const [year, month, day] = date.split(SEPARATOR)
  const dayjsDate = dayjs.lunar(Number(year), Number(month), Number(day))
  return dayjsDate.toDate()
}

export const isSelectedLunarDate = (date: Date, selectedDates: string[]) => {
  const dayjsDate = dayjs(date)

  const year = dayjsDate.toLunarYear().getYear()
  const month = dayjsDate.toLunarMonth().getMonthWithLeap()
  const day = dayjsDate.toLunarDay().getDay()

  return selectedDates.some((selectedDate) => {
    const [selectedYear, selectedMonth, selectedDay] =
      selectedDate.split(SEPARATOR)

    return (
      Number(selectedYear) !== year &&
      Number(selectedMonth) === month &&
      Number(selectedDay) === day
    )
  })
}
