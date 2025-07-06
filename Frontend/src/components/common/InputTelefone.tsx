import React, { useState } from "react"
import type { InputHTMLAttributes, ChangeEvent } from "react"
import { Input } from "./Input"

interface InputTelefoneProps extends InputHTMLAttributes<HTMLInputElement> {
  format?: string
}

export const InputTelefone = React.forwardRef<HTMLInputElement, InputTelefoneProps>(({
  onChange,
  className = "",
  format = "XXX XXX XX XX",
  placeholder = "Ingrese su teléfono",
  ...props
}, ref) => {
  const [isValid, setIsValid] = useState(false)
  const [value, setValue] = useState("")

  const formatPhoneNumber = (phone: string) => {
    // Eliminar todo excepto números
    const numbers = phone.replace(/\D/g, '')

    // Crear un array con los caracteres del formato
    const formatChars = format.split('')
    let result = ''
    let numberIndex = 0

    // Aplicar el formato
    for (let i = 0; i < formatChars.length && numberIndex < numbers.length; i++) {
      if (formatChars[i] === 'X') {
        result += numbers[numberIndex]
        numberIndex++
      } else {
        result += formatChars[i]
      }
    }

    // Agregar los números restantes sin formato
    if (numberIndex < numbers.length) {
      result += numbers.slice(numberIndex)
    }

    return result
  }

  const validatePhone = (phone: string) => {
    // Eliminar todo excepto números para la validación
    const numbers = phone.replace(/\D/g, '')
    // Validar que tenga 10 o 11 dígitos (con o sin 9)
    return numbers.length === 10 || numbers.length === 11
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const formattedValue = formatPhoneNumber(newValue)
    setValue(formattedValue)

    // Validar el teléfono
    setIsValid(validatePhone(formattedValue))

    // Crear un evento simulado con el valor formateado
    const syntheticEvent = { ...e, currentTarget: { ...e.currentTarget, value: formattedValue } } as ChangeEvent<HTMLInputElement>

    // Llamar al onChange original si existe
    if (onChange) onChange(syntheticEvent)
  }

  return (
    <Input
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={value}
      onChange={handleChange}
      maxLength={format.length}
      placeholder={placeholder}
      className={`
        ${className}
        ${!isValid ? 'border-red-500 ring-red-500 focus:border-red-500' : ''}
      `}
      {...props}
    />
  )
})

InputTelefone.displayName = 'InputTelefone'
export default InputTelefone 