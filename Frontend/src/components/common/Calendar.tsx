"use client"

import * as React from "react"
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from "@remixicon/react"
import { addYears, format, type Locale } from "date-fns"
import {
  DayPicker,
  useNavigation,
  type DayPickerRangeProps,
  type DayPickerSingleProps,
  type DayPickerDefaultProps,
  type DayPickerMultipleProps,
  type ClassNames as DayPickerClassNames
} from "react-day-picker"

import { cx } from "../../lib/utils"

interface NavigationButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  onClick: () => void
  icon: React.ElementType
  disabled?: boolean
}

const NavigationButton = React.forwardRef<
  HTMLButtonElement,
  NavigationButtonProps
>((
  { onClick, icon: Icon, disabled, ...props }: NavigationButtonProps,
  forwardedRef,
) => {
  return (
    <button
      ref={forwardedRef}
      type="button"
      disabled={disabled}
      className={cx(
        "flex size-8 shrink-0 select-none items-center justify-center rounded-sm border p-1 outline-hidden transition sm:size-[30px]",
        "text-gray-600 hover:text-gray-800",
        "dark:text-slate-300 dark:hover:text-slate-100",
        "border-gray-300 dark:border-gray-800",
        "hover:bg-gray-50 active:bg-gray-100",
        "dark:hover:bg-gray-900 dark:active:bg-gray-800",
        "disabled:pointer-events-none",
        "disabled:border-gray-200 dark:disabled:border-gray-800",
        "disabled:text-gray-400 dark:disabled:text-slate-600",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
      )}
      onClick={onClick}
      {...props}
    >
      <Icon className="size-full shrink-0" />
    </button>
  )
})

NavigationButton.displayName = "NavigationButton"

interface CalendarCaptionProps {
  displayMonth: Date
  locale?: Locale
}

const CalendarCaption = ({ displayMonth, locale }: CalendarCaptionProps) => {
  const navigation = useNavigation()
  const { currentMonth } = navigation

  const handlePreviousYear = () => {
    const newMonth = addYears(currentMonth, -1)
    navigation.goToMonth(newMonth)
  }

  const handleNextYear = () => {
    const newMonth = addYears(currentMonth, 1)
    navigation.goToMonth(newMonth)
  }

  const handlePreviousMonth = () => {
    if (navigation.previousMonth) {
      navigation.goToMonth(navigation.previousMonth)
    }
  }

  const handleNextMonth = () => {
    if (navigation.nextMonth) {
      navigation.goToMonth(navigation.nextMonth)
    }
  }

  return (
    <div className="flex items-center justify-between p-3">
      <NavigationButton
        onClick={handlePreviousYear}
        icon={RiArrowLeftDoubleLine}
        disabled={!navigation.previousMonth}
        aria-label="Previous year"
      />

      <NavigationButton
        onClick={handlePreviousMonth}
        icon={RiArrowLeftSLine}
        disabled={!navigation.previousMonth}
        aria-label="Previous month"
      />

      <div className="grid gap-1 text-center grid-cols-1">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-900 dark:text-slate-300">
            {format(displayMonth, "LLLL yyyy", { locale })}
          </p>
        </div>
      </div>

      <NavigationButton
        onClick={handleNextMonth}
        icon={RiArrowRightSLine}
        disabled={!navigation.nextMonth}
        aria-label="Next month"
      />

      <NavigationButton
        onClick={handleNextYear}
        icon={RiArrowRightDoubleLine}
        disabled={!navigation.nextMonth}
        aria-label="Next year"
      />
    </div>
  )
}

// Definición de tipos para las props del componente Calendar
type CalendarProps = (
  DayPickerSingleProps |
  DayPickerRangeProps |
  DayPickerDefaultProps | // Incluir si usas este modo
  DayPickerMultipleProps // Incluir si usas este modo
) & {
  className?: string
  classNames?: Partial<DayPickerClassNames>
  locale?: Locale
  numberOfMonths?: number // Dejar como number si DayPicker lo permite como number | undefined
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 // Especificar los valores permitidos
}

const Calendar = ({
  mode = "single",
  weekStartsOn = 1,
  numberOfMonths = 1,
  locale,
  className,
  classNames: userClassNames,
  ...props
}: CalendarProps) => {

  const defaultClassNames: Partial<DayPickerClassNames> = {
    months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse",
    month: "space-y-4",
    nav: "flex items-center justify-between",
    table: "w-full border-collapse space-y-1",
    head_row: "flex",
    head_cell:
      "text-gray-500 dark:text-slate-300 rounded-md w-9 font-normal text-[0.8rem]",
    row: "flex w-full mt-2",
    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 dark:[&:has([aria-selected])]:bg-gray-800",
    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
    day_range_end: "day-range-end",
    day_selected:
      "bg-gray-900 text-gray-50 hover:bg-gray-900 hover:text-gray-50 focus:bg-gray-900 focus:text-gray-50 dark:bg-slate-300 dark:text-gray-900 dark:hover:bg-slate-300 dark:hover:text-gray-900 dark:focus:bg-slate-300 dark:focus:text-gray-900",
    day_today: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-300",
    day_outside:
      "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-500 aria-selected:opacity-30 dark:text-slate-400 dark:aria-selected:bg-gray-800/50 dark:aria-selected:text-slate-400",
    day_disabled: "text-gray-500 opacity-50 dark:text-slate-400",
    day_range_middle:
      "aria-selected:bg-gray-100 aria-selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-slate-300",
    day_hidden: "invisible",
    caption: "flex justify-center pt-1 relative items-center",
    caption_label: "text-sm font-medium",
  }

  const mergedClassNames = {
    ...defaultClassNames,
    ...userClassNames,
  }

  return (
    <DayPicker
      mode={mode}
      weekStartsOn={weekStartsOn}
      numberOfMonths={numberOfMonths}
      locale={locale}
      showOutsideDays={numberOfMonths === 1}
      className={cx(className)}
      classNames={mergedClassNames}
      components={{
        IconLeft: () => (
          <RiArrowLeftSLine aria-hidden="true" className="size-4" />
        ),
        IconRight: () => (
          <RiArrowRightSLine aria-hidden="true" className="size-4" />
        ),
        Caption: CalendarCaption,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar } 