import { useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { es } from "react-day-picker/locale"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface TremorCalendarProps {
    className?: string
    mode?: 'single' | 'multiple' | 'range'
    selected?: Date | Date[] | DateRange | undefined
    onSelect?: (selected: Date | Date[] | DateRange | undefined) => void
}

export function CustomSelectDropdown(props: DropdownProps) {
    const { options, value, onChange } = props

    const handleValueChange = (newValue: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: {
                    value: newValue
                }
            } as React.ChangeEvent<HTMLSelectElement>

            onChange(syntheticEvent)
        }
    }

    return (
        <select
            value={value?.toString()}
            onChange={(e) => handleValueChange(e.target.value)}
            className="bg-slate-700 text-slate-50 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            {options?.map((option) => (
                <option
                    key={option.value}
                    value={option.value.toString()}
                    disabled={option.disabled}
                    className="bg-slate-800 text-slate-50"
                >
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export function TremorCalendar({
    className = "",
    mode = "range",
    onSelect,
}: TremorCalendarProps) {
    const [selected, setSelected] = useState<Date | DateRange | undefined>()
    const handleSelect = (newSelected: any) => {
        setSelected(newSelected)
        console.log(newSelected)
        if (newSelected?.from && newSelected?.to) {
            const formattedFrom = format(newSelected.from, 'dd/MM/yyyy')
            const formattedTo = format(newSelected.to, 'dd/MM/yyyy')

            console.log('Fecha inicio:', formattedFrom)
            console.log('Fecha fin:', formattedTo)

            // O si necesitas pasarlas como string
            // onSelect?.({
            //     from: formattedFrom,
            //     to: formattedTo
            // })

        }

    }

    return (
        <div className={`bg-slate-600 dark:bg-slate-950 rounded-lg p-4 text-slate-50 ${className}`}>
            <DayPicker
                mode={mode}
                locale={es}
                weekStartsOn={0}
                ISOWeek
                animate
                captionLayout="dropdown"
                components={{
                    Dropdown: CustomSelectDropdown,
                }}
                navLayout="around"
                showOutsideDays
                fixedWeeks
                classNames={{
                    range_start: "bg-slate-700 rounded-l-3xl",
                    range_middle: "bg-slate-700",
                    range_end: "bg-slate-700 rounded-r-3xl",
                }}
                selected={selected}
                onSelect={handleSelect}
            />
            {/* {selected && (
                <p className="mt-4 text-sm text-slate-50">Fecha seleccionada: {selected.toDateString()}</p>
            )} */}
        </div>
    )
}

export default TremorCalendar