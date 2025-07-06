import React, { useState } from "react"
import type { InputHTMLAttributes, ChangeEvent } from "react"
import { Input } from "./Input"

export const InputEmail = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ onChange, className = "", ...props }, ref) => {
  const [isValid, setIsValid] = useState(false)
  const [value, setValue] = useState("")

  const validateEmail = (email: string) => {
    // Expresión regular para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Validar el email
    setIsValid(validateEmail(newValue))

    // Llamar al onChange original si existe
    if (onChange) onChange(e)
  }

  return (
    <Input
      ref={ref}
      type="email"
      inputMode="email"
      autoComplete="email"
      value={value}
      onChange={handleChange}
      className={`
        ${className}
        ${!isValid ? 'border-red-500 ring-red-500 focus:border-red-500' : ''}
      `}
      {...props}
    />
  )
})

InputEmail.displayName = 'InputEmail'
export default InputEmail 