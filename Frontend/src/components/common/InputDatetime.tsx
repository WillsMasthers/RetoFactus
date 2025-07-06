import React, { useState } from "react"
import type { InputHTMLAttributes, ChangeEvent, FormEvent, FocusEvent } from "react"
import { Input } from "./Input"

// Importar el icono de Heroicons
import { CalendarIcon } from "@heroicons/react/24/outline"

type TimeFormat = '12h' | '24h' | '12h:ss' | '24h:ss'
type DateFormat = 'ddmmyyyy' | 'mmddyyyy' | 'yyyymmdd' | 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd'
type DateTimeFormat = `${DateFormat} ${TimeFormat}`

interface InputDatetimeProps extends InputHTMLAttributes<HTMLInputElement> {
  format?: TimeFormat | DateFormat | DateTimeFormat
  showPicker?: boolean
}

export const InputDatetime = React.forwardRef<HTMLInputElement, InputDatetimeProps>(({
  onChange,
  className = "",
  format = 'dd/mm/yyyy',
  showPicker = true,
  ...props
}, ref) => {
  const [isValid, setIsValid] = useState(false)
  const [value, setValue] = useState("")
  const [rawValue, setRawValue] = useState("")

  const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    if (format.includes('12h') || format.includes('24h')) {
      if (format.includes('dd/mm') || format.includes('mm/dd') || format.includes('yyyy/mm')) {
        return `${formatDate(`${day}${month}${year}`)} ${formatTime(`${hours}${minutes}${seconds}`)}`
      }
      return formatTime(`${hours}${minutes}${seconds}`)
    }
    return formatDate(`${day}${month}${year}`)
  }

  const getInputType = () => {
    if (!showPicker) return 'text'

    // Determinar el tipo basado en el formato
    if (format.includes('12h') || format.includes('24h')) {
      if (format.includes('dd/mm') || format.includes('mm/dd') || format.includes('yyyy/mm')) {
        return 'datetime-local'
      }
      return 'time'
    }
    return 'date'
  }

  const getInputProps = (): Partial<InputHTMLAttributes<HTMLInputElement>> => {
    const type = getInputType()
    const props: Partial<InputHTMLAttributes<HTMLInputElement>> = {}

    if (type === 'time' || type === 'datetime-local') {
      // Forzar formato 24h si el formato lo especifica
      if (format.includes('24h')) {
        props.step = '60' // Forzar formato 24h
        props.style = {
          ...props.style,
          '--webkit-calendar-picker-indicator-color': 'currentColor',
          '--webkit-calendar-picker-indicator-background': 'transparent'
        } as React.CSSProperties
      }
    }

    return props
  }

  const formatTime = (time: string, timeFormat?: string) => {
    // Eliminar todo excepto números
    const numbers = time.replace(/\D/g, '')
    let hours = numbers.slice(0, 2)
    let minutes = numbers.slice(2, 4)
    let seconds = numbers.slice(4, 6)

    // Validar y ajustar horas
    if (hours) {
      const hourNum = parseInt(hours)
      if ((timeFormat || format).includes('12h')) {
        if (hourNum > 12) hours = '12'
        if (hourNum === 0) hours = '01'
      } else {
        if (hourNum > 23) hours = '23'
      }
    }

    // Validar y ajustar minutos
    if (minutes) {
      const minNum = parseInt(minutes)
      if (minNum > 59) minutes = '59'
    }

    // Validar y ajustar segundos
    if (seconds) {
      const secNum = parseInt(seconds)
      if (secNum > 59) seconds = '59'
    }

    // Aplicar formato según el tipo
    if ((timeFormat || format).includes('12h')) {
      const hourNum = parseInt(hours)
      const period = hourNum >= 12 ? 'PM' : 'AM'
      const hour12 = hourNum > 12 ? hourNum - 12 : hourNum
      return `${String(hour12).padStart(2, '0')}:${minutes}${(timeFormat || format).includes(':ss') ? `:${seconds}` : ''} ${period}`
    } else {
      return `${hours}:${minutes}${(timeFormat || format).includes(':ss') ? `:${seconds}` : ''}`
    }
  }

  const formatDate = (date: string) => {
    // Eliminar todo excepto números
    const numbers = date.replace(/\D/g, '')
    let day = numbers.slice(0, 2)
    let month = numbers.slice(2, 4)
    const year = numbers.slice(4, 8)

    // Validar y ajustar día
    if (day) {
      const dayNum = parseInt(day)
      if (dayNum > 31) day = '31'
      if (dayNum === 0) day = '01'
    }

    // Validar y ajustar mes
    if (month) {
      const monthNum = parseInt(month)
      if (monthNum > 12) month = '12'
      if (monthNum === 0) month = '01'
    }

    // Aplicar formato según el tipo
    if (format.includes('ddmmyyyy')) {
      return `${day}${month}${year}`
    } else if (format.includes('mmddyyyy')) {
      return `${month}${day}${year}`
    } else if (format.includes('yyyymmdd')) {
      return `${year}${month}${day}`
    } else if (format.includes('dd/mm/yyyy')) {
      return `${day}/${month}/${year}`
    } else if (format.includes('mm/dd/yyyy')) {
      return `${month}/${day}/${year}`
    } else if (format.includes('yyyy/mm/dd')) {
      return `${year}/${month}/${day}`
    }
    return `${day}/${month}/${year}`
  }

  const formatDateTime = (datetime: string) => {
    const [date, time] = datetime.split(' ')
    const timeFormat = format.split(' ')[1] // Obtener el formato de hora del formato datetime
    return `${formatDate(date)} ${formatTime(time, timeFormat)}`
  }

  const validateTime = (time: string) => {
    const numbers = time.replace(/\D/g, '')
    return numbers.length >= 4 // Mínimo HH:mm
  }

  const validateDate = (date: string) => {
    const numbers = date.replace(/\D/g, '')
    return numbers.length >= 6 // Mínimo DDMMYY
  }

  const validateDateTime = (datetime: string) => {
    const [date, time] = datetime.split(' ')
    return validateDate(date) && validateTime(time)
  }

  const updateValue = (newValue: string) => {
    let formattedValue = ''
    let isValid = false

    // Si el valor está vacío y es un input de tipo date/datetime-local, establecer la fecha actual
    if (!newValue && (getInputType() === 'date' || getInputType() === 'datetime-local')) {
      formattedValue = getCurrentDateTime()
      isValid = true
    } else {
      // Determinar el tipo de formato
      if (format.includes('12h') || format.includes('24h')) {
        if (format.includes('dd/mm') || format.includes('mm/dd') || format.includes('yyyy/mm')) {
          formattedValue = formatDateTime(newValue)
          isValid = validateDateTime(formattedValue)
        } else {
          formattedValue = formatTime(newValue)
          isValid = validateTime(formattedValue)
        }
      }
      else if (format.includes('ddmmyyyy') || format.includes('mmddyyyy') || format.includes('yyyymmdd') || format.includes('dd/mm/yyyy') || format.includes('mm/dd/yyyy') || format.includes('yyyy/mm/dd')) {
        formattedValue = formatDate(newValue)
        isValid = validateDate(formattedValue)
      }
      else {
        formattedValue = newValue
        isValid = true
      }

    }

    setValue(formattedValue)
    setIsValid(isValid)

    // Crear un evento simulado con el valor formateado
    const syntheticEvent = {
      target: { value: formattedValue },
      currentTarget: { value: formattedValue }
    } as ChangeEvent<HTMLInputElement>

    // Llamar al onChange original si existe
    if (onChange) onChange(syntheticEvent)
  }

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value
    setRawValue(newValue)
    // Solo actualizar el valor formateado si no estamos usando el picker nativo
    if (!showPicker) {
      updateValue(newValue)
    } else {
      // Si usamos el picker, rawValue es el valor del input, value podría ser el formateado si se necesitara
      // Para simplicity, si showPicker es true, rawValue es suficiente
      setValue(newValue) // Mantener value sincronizado si se necesita
      const syntheticEvent = {
        target: { value: newValue },
        currentTarget: { value: newValue }
      } as ChangeEvent<HTMLInputElement>
      if (onChange) onChange(syntheticEvent)
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    // La validación y formateo solo al blur si no usamos el picker nativo
    if (!showPicker) {
      updateValue(e.currentTarget.value)
    }
    // También llamar al onBlur original si existe
    if (props.onBlur) props.onBlur(e)
  }

  // Assuming cx utility is available, replace with simple string concatenation if not
  const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

  // Referencia al input nativo para poder hacer click programáticamente
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Combinar la ref pasada desde fuera con nuestra ref interna
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  const handleIconClick = () => {
    // Simular un click en el input solo si showPicker es true
    if (showPicker && inputRef.current) {
      inputRef.current.focus() // Primero enfocar el input
      inputRef.current.click() // Luego simular el click
    }
  }

  return (
    // Contenedor para el input y el icono
    <div className={cx("relative flex items-center", className)}> {/* Usar cx si está disponible o una cadena simple */}
      {/* Mostrar icono siempre en el lado derecho */}
      <CalendarIcon
        className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400 cursor-pointer" // Eliminar pointer-events-none y añadir cursor-pointer
        onClick={handleIconClick} // Añadir manejador de click
      />

      <Input
        ref={inputRef} // Usar nuestra ref interna aquí
        type={getInputType()}
        value={showPicker ? rawValue : value}
        onInput={handleInput}
        onChange={handleInput}
        onBlur={handleBlur}
        className={cx( // Usar cx para combinar clases
          "w-full", // Asegurar que ocupe el ancho completo del contenedor flex
          "pl-3", // Padding izquierdo base
          "pr-10", // Añadir padding a la derecha para el icono
          !isValid && !showPicker ? 'border-red-500 ring-red-500 focus:border-red-500' : '', // Aplicar estilos de error solo si no usamos el picker
          // Resto de clases del input original si las hay en className prop
        )}
        {...getInputProps()}
        {...props}
      />
    </div>
  )
})

InputDatetime.displayName = 'InputDatetime'
export default InputDatetime 