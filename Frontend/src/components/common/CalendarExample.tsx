"use client"

import React from "react"
import { Calendar } from "./Calendar_DayPicker"

export const CalendarExample = () => {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  return (
    <div className="flex flex-col items-center gap-y-4">
      <Calendar enableYearNavigation selected={date} onSelect={setDate} />
      <p className="rounded-sm bg-gray-100 p-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        Fecha seleccionada: {date ? date.toLocaleDateString() : "Ninguna"}
      </p>
    </div>
  )
}

export default CalendarExample 