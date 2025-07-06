import React from "react"
import type { InputHTMLAttributes, ChangeEvent, KeyboardEvent } from "react"
import { Input } from "./Input"

export const InputDecimal = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ onChange, ...props }, ref) => {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value

    // Permite números y un punto decimal
    // 1. Remueve cualquier carácter que no sea dígito o punto
    const filteredValue = value.replace(/[^0-9.]/g, '')

    // 2. Verifica si hay más de un punto decimal
    const dotCount = filteredValue.split('.').length - 1

    if (dotCount > 1) {
      // Si hay más de un punto, limpia el campo
      value = '' // Limpia todo el campo
    } else {
      // Asegura que si hay un punto, no haya otros puntos después
      const parts = filteredValue.split('.')
      if (parts.length > 1) {
        value = parts[0] + '.' + parts.slice(1).join('').replace(/\./g, '')
      } else {
        value = filteredValue
      }
    }

    // Asegura que no empiece con múltiples ceros a menos que sea '0' o '0.'
    if (value.startsWith('0') && value.length > 1 && !value.startsWith('0.')) {
      value = value.substring(1)
    }

    // Crear un evento simulado con el valor procesado/filtrado
    const syntheticEvent = { ...e, currentTarget: { ...e.currentTarget, value: value } } as ChangeEvent<HTMLInputElement>

    // Llamar al onChange original si existe
    if (onChange) onChange(syntheticEvent)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    // Si ya hay un punto y se intenta agregar otro, limpiar el campo
    if (e.key === '.' && value.includes('.')) {
      e.preventDefault()
      // Crear un evento simulado con valor vacío
      const syntheticEvent = {
        target: e.currentTarget,
        type: 'change',
        nativeEvent: e.nativeEvent,
        preventDefault: () => { },
        stopPropagation: () => { },
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => { },
        bubbles: true,
        cancelable: true,
        timeStamp: Date.now(),
        defaultPrevented: false,
        isTrusted: true,
        eventPhase: 0,
        AT_TARGET: 0,
        BUBBLING_PHASE: 0,
        CAPTURING_PHASE: 0,
        composed: false,
        composedPath: () => [],
        initEvent: () => { },
        returnValue: true,
        srcElement: e.currentTarget,
        currentTarget: { ...e.currentTarget, value: '' }
      } as unknown as ChangeEvent<HTMLInputElement>
      // Llamar al onChange con el campo vacío
      if (onChange) onChange(syntheticEvent)
    }
  }

  return (
    <Input
      ref={ref}
      type="number"
      inputMode="decimal"
      step="any"
      onKeyDown={handleKeyDown}
      {...props}
      onChange={handleChange}
    />
  )
})

InputDecimal.displayName = 'InputDecimal'
export default InputDecimal