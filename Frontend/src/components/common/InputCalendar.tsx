import { useEffect, useId, useRef, useState } from "react"

import { format, isValid, parse } from "date-fns"
import { DayPicker, type DropdownProps } from "react-day-picker"
import { es } from "react-day-picker/locale"
import Input from "./Input"

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

export function Dialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const dialogId = useId()
    const headerId = useId()

    // Hold the month in state to control the calendar when the input changes
    const [month, setMonth] = useState(new Date())

    // Hold the selected date in state
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

    // Hold the input value in state
    const [inputValue, setInputValue] = useState("")

    // Hold the dialog visibility in state
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Function to toggle the dialog visibility
    const toggleDialog = () => setIsDialogOpen(!isDialogOpen)

    // Hook to handle the body scroll behavior and focus trapping
    useEffect(() => {
        const handleBodyScroll = (isOpen: boolean) => {
            document.body.style.overflow = isOpen ? "hidden" : ""
        }
        if (!dialogRef.current) return
        if (isDialogOpen) {
            handleBodyScroll(true)
            dialogRef.current.showModal()
        } else {
            handleBodyScroll(false)
            dialogRef.current.close()
        }
        return () => {
            handleBodyScroll(false)
        }
    }, [isDialogOpen])

    const handleDayPickerSelect = (date: Date | undefined) => {
        if (!date) {
            setInputValue("")
            setSelectedDate(undefined)
        } else {
            setSelectedDate(date)
            setInputValue(format(date, "dd/MM/yyyy"))
        }
        dialogRef.current?.close()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value) // Keep the input value in sync

        const parsedDate = parse(e.target.value, "dd/MM/yyyy", new Date())

        if (isValid(parsedDate)) {
            setSelectedDate(parsedDate)
            setMonth(parsedDate)
        } else {
            setSelectedDate(undefined)
        }
    }

    return (
        <div>
            <label htmlFor="date-input" className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Fecha</label>
            <div className="flex flex-row items-center ">
                <Input
                    style={{ fontSize: "inherit" }}
                    id="date-input"
                    type="text"
                    value={inputValue}
                    placeholder="dd/MM/yyyy"
                    onChange={handleInputChange}
                />{" "}
                <button
                    style={{ fontSize: "inherit" }}
                    onClick={toggleDialog}
                    aria-controls="dialog"
                    aria-haspopup="dialog"
                    aria-expanded={isDialogOpen}
                    aria-label="Open calendar to choose booking date"
                >
                    📆
                </button>
            </div>
            {/* <p aria-live="assertive" aria-atomic="true">
                {selectedDate !== undefined
                    ? selectedDate.toDateString()
                    : "Please type or pick a date"}
            </p> */}
            <dialog
                className="bg-slate-600 dark:bg-slate-950 rounded-lg p-4 text-slate-50"
                role="dialog"
                ref={dialogRef}
                id={dialogId}
                aria-modal
                aria-labelledby={headerId}
                onClose={() => setIsDialogOpen(false)}
            >
                <DayPicker
                    mode="single"
                    month={month}
                    onMonthChange={setMonth}
                    autoFocus
                    selected={selectedDate}
                    onSelect={handleDayPickerSelect}
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
                    footer={
                        selectedDate !== undefined &&
                        `Selected: ${selectedDate.toDateString()}`
                    }
                />
            </dialog>
        </div>
    )
}

export function InputCalendar() {
    return <Dialog />
}