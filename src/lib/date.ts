import dayjs from "dayjs"
import { PluginLunar } from "dayjs-plugin-lunar"
import timezone from "dayjs/plugin/timezone"

export const TIMEZONE = "Asia/Kuala_Lumpur"

dayjs.extend(timezone)
dayjs.extend(PluginLunar)

dayjs.tz.setDefault(TIMEZONE)

export default dayjs

type DateType = Date | string | number

const DATE_FORMAT = "DD/MM/YYYY"
const TIME_FORMAT = "HH:mm A"

export const formatDate = (date: DateType) => dayjs(date).format(DATE_FORMAT)
export const formatTime = (date: DateType) => dayjs(date).format(TIME_FORMAT)

const ISO_DATE_FORMAT = "YYYY-MM-DD"

export const formatISODate = (date: DateType) =>
  dayjs(date).format(ISO_DATE_FORMAT)
export const getDateFromISODate = (date: DateType) => dayjs(date).toDate()

const SEPARATOR = "|"

export const getLunarDateFromSolarDate = (date: DateType): string => {
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

export const sortLunarDates = (dates: string[]) =>
  dates.sort((a, b) => {
    const [, monthAStr, dayAStr] = a.split(SEPARATOR)
    const [, monthBStr, dayBStr] = b.split(SEPARATOR)

    const monthA = Number(monthAStr)
    const monthB = Number(monthBStr)
    const dayA = Number(dayAStr)
    const dayB = Number(dayBStr)

    const absMonthA = Math.abs(monthA)
    const absMonthB = Math.abs(monthB)

    if (absMonthA !== absMonthB) return absMonthA - absMonthB

    const isLeapA = monthA < 0 ? 1 : 0
    const isLeapB = monthB < 0 ? 1 : 0

    if (isLeapA !== isLeapB) return isLeapA - isLeapB

    return dayA - dayB
  })

export const isSelectedLunarDate = (
  date: DateType,
  selectedDates: string[]
) => {
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

export const getNextSolarDateFromLunarList = (lunarDates: string[]): string => {
  const today = dayjs()

  const todayLunarYear = today.toLunarYear().getYear()
  const todayLunarMonth = today.toLunarMonth().getMonthWithLeap()
  const todayLunarDay = today.toLunarDay().getDay()

  const parsedLunarDates = lunarDates.map((date) => {
    const [, month, day] = date.split(SEPARATOR).map(Number)
    return { year: todayLunarYear, month, day }
  })

  const nextLunar = parsedLunarDates
    .filter(
      ({ month, day }) =>
        month > todayLunarMonth ||
        (month === todayLunarMonth && day >= todayLunarDay)
    )
    .sort((a, b) =>
      a.month !== b.month ? a.month - b.month : a.day - b.day
    )[0]

  const targetLunar =
    nextLunar ||
    (() => {
      const firstLunar = parsedLunarDates.sort((a, b) =>
        a.month !== b.month ? a.month - b.month : a.day - b.day
      )[0]

      return {
        year: firstLunar.year + 1,
        month: firstLunar.month,
        day: firstLunar.day,
      }
    })()

  const lunarDateStr = `${targetLunar.year}|${targetLunar.month}|${targetLunar.day}`
  const solarDate = getSolarDateFromLunarDate(lunarDateStr)

  return formatISODate(solarDate)
}
