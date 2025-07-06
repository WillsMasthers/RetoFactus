import React from "react"
import type { InputHTMLAttributes, ChangeEvent, KeyboardEvent } from "react"
import { Input } from "./Input"

export const InputNumber = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ onChange, ...props }, ref) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    // Solo permite dígitos, sin puntos ni comas
    const filteredValue = value.replace(/[^0-9]/g, '')

    // Asegura que no empiece con múltiples ceros
    const finalValue = filteredValue.startsWith('0') && filteredValue.length > 1
      ? filteredValue.substring(1)
      : filteredValue

    // Crear un evento simulado con el valor procesado/filtrado
    const syntheticEvent = { ...e, currentTarget: { ...e.currentTarget, value: finalValue } } as ChangeEvent<HTMLInputElement>

    // Llamar al onChange original si existe
    if (onChange) onChange(syntheticEvent)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    // Si ya hay un punto y se intenta agregar otro, prevenir la acción
    if (e.key === '.' && value.includes('.')) {
      e.preventDefault()
    }
  }

  return (
    <Input
      ref={ref}
      type="number"
      inputMode="numeric"
      pattern="[0-9]*"
      onKeyDown={handleKeyDown}
      {...props}
      onChange={handleChange}
    />
  )
})

InputNumber.displayName = 'InputNumber'
export default InputNumber