"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { RiCalendarLine } from "@remixicon/react" // Puedes cambiar este icono si prefieres Heroicons
import { cn } from "../../lib/utils" // Asegúrate de que esta ruta sea correcta
import { Calendar } from "./Calendar" // Necesitaremos un componente Calendar compatible
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./Popover" // Necesitaremos un componente Popover
import { Input } from "./Input" // Importar el Input
import type { InputHTMLAttributes } from "react"

interface CustomDatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  label?: string
  helperText?: string
}

export function CustomDatePicker({
  date,
  onDateChange,
  disabled = false,
  placeholder = "Seleccionar fecha",
  className,
  error = false,
  errorMessage,
  required = false,
  label,
  helperText,
  ...props
}: CustomDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Manejador para abrir/cerrar el popover. Lo adjuntaremos al contenedor principal.
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    // Opcional: Enfocar el input cuando se abre el popover
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Manejador para cuando se selecciona una fecha en el calendario
  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate)
    setOpen(false) // Cerrar el popover después de seleccionar una fecha
    // Opcional: Enfocar el input después de seleccionar una fecha
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className={cn("grid w-full max-w-sm items-center gap-1.5", className)}> {/* Contenedor principal */}
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={handleOpenChange}> {/* Usar nuestro manejador aquí */}
        <PopoverTrigger asChild>
          {/* El Input ahora actúa como trigger visual, pero el clic para abrir lo manejaremos en el div contenedor */}
          <div className="relative flex items-center w-full">
            <RiCalendarLine className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400 pointer-events-none" /> {/* Icono visual */}
            <Input
              ref={inputRef}
              value={date ? format(date, "PPP", { locale: es }) : ""} // Mostrar la fecha formateada
              placeholder={placeholder}
              disabled={disabled}
              readOnly // El input es de solo lectura, el picker maneja la selección
              className={cn(
                "w-full pl-10 pr-3", // Ajustar padding para el icono
                error && "border-red-500",
              )}
              {...props} // Pasar otras props del input
            />
            {error && errorMessage && (
              <p className="absolute -bottom-5 text-sm text-red-500">{errorMessage}</p>
            )}
            {helperText && !error && (
              <p className="absolute -bottom-5 text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* Aquí iría nuestro componente Calendar */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect} // Usar nuestro manejador de selección
            initialFocus
            // Pasa otras props necesarias para Calendar (locale, etc.)
            locale={es} // Ejemplo: pasar el locale español
          />
        </PopoverContent>
      </Popover>
      {/* Mensajes de error/ayuda si no están en el popovertrigger */}
      {!error && helperText && !label && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
      {error && errorMessage && !label && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

// Nota: Necesitarás crear o adaptar los componentes Calendar, Popover y Input si aún no los tienes con la estructura necesaria.
// Asegúrate de que el componente Calendar sea compatible con las props mode, selected y onSelect. 