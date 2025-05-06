"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import {
  ChevronProps,
  DayButton,
  DayFlag,
  DayPicker,
  SelectionState,
  UI,
} from "react-day-picker"

import dayjs, { TIMEZONE } from "@/lib/date"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      timeZone={TIMEZONE}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        [UI.Months]: "relative",
        [UI.Month]: "flex flex-col gap-4",
        [UI.MonthCaption]: "flex justify-center items-center h-7",
        [UI.CaptionLabel]: "text-sm font-medium",
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-0 left-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-0 right-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        [UI.MonthGrid]: "w-full border-collapse space-y-1",
        [UI.Weekdays]: "flex",
        [UI.Weekday]:
          "text-muted-foreground rounded-md w-10 font-normal text-xs py-0.5",
        [UI.Week]: "flex w-full mt-2",
        [UI.Day]:
          "size-10 text-center rounded-md text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        [UI.DayButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "hover:bg-accent/50 hover:text-accent-foreground size-10 p-0 font-normal aria-selected:opacity-100"
        ),
        [SelectionState.range_end]: "day-range-end",
        [SelectionState.selected]:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground [&_button]:hover:bg-primary! [&_button]:hover:text-primary-foreground! [&_button>span]:opacity-100",
        [SelectionState.range_middle]:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        [DayFlag.today]: "bg-accent text-accent-foreground",
        [DayFlag.outside]:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30 pointer-events-none",
        [DayFlag.disabled]: "text-muted-foreground opacity-50",
        [DayFlag.hidden]: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => <Chevron {...props} />,
        DayButton: ({ className, children, ...props }) => {
          const dayjsDate = dayjs(props.day.date)
          const isFirstDay = dayjsDate.toLunarDay().getDay() === 1

          return (
            <DayButton className={cn(className, "flex-col gap-1")} {...props}>
              <span className="leading-none">{children}</span>
              <span className="text-[0.625rem] font-medium opacity-60">
                {isFirstDay
                  ? dayjsDate.toLunarMonth().getName()
                  : dayjsDate.toLunarDay().getName()}
              </span>
            </DayButton>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }

const Chevron = ({ orientation, className, ...props }: ChevronProps) => {
  switch (orientation) {
    case "left":
      return <ChevronLeft className={cn("size-4", className)} {...props} />
    case "right":
      return <ChevronRight className={cn("size-4", className)} {...props} />
    case "up":
      return <ChevronUp className={cn("size-4", className)} {...props} />
    case "down":
      return <ChevronDown className={cn("size-4", className)} {...props} />
    default:
      return null
  }
}
