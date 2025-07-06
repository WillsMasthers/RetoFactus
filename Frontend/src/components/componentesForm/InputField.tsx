import React from "react"
import { Input, InputNumber, InputDecimal, InputEmail, InputPassword, InputTelefone } from "../common"
import InputDatetime from "../common/InputDatetime"
// Importar otros componentes específicos según se creen (EmailInput, PasswordInput, etc.)

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  // La prop 'type' ahora determinará qué subcomponente renderizar
  // Puedes añadir otros tipos a la unión aquí según los componentes que crees
  type?: 'text' | 'email' | 'password' | 'number' | 'decimal' | 'tel' | 'url' | 'date' | 'color'
  // Las props específicas como onlyNumbers y decimal son manejadas por los subcomponentes especializados
}

export const InputField = ({ label, id, type = 'text', ...props }: InputFieldProps) => {
  const renderInput = () => {
    // No necesitamos omitir props aquí, simplemente pasamos todas las props estándar 
    // y los subcomponentes especializados tomarán solo las que necesiten o ignoren las demás.
    switch (type) {
      case 'number':
        return <InputNumber id={id} {...props} />
      case 'decimal':
        return <InputDecimal id={id} {...props} />
      // Añadir casos para otros tipos especializados aquí
      case 'email':
        return <InputEmail id={id} {...props} />
      case 'password':
        return <InputPassword id={id} {...props} />
      case 'tel':
        return <InputTelefone id={id} type={type} {...props} />
      case 'url':
        return <Input id={id} type={type} {...props} />
      case 'date':
        return <InputDatetime id={id} format="dd/mm/yyyy 24h" showPicker {...props} />
      case 'color':
        return <Input id={id} type={type} {...props} />
      case 'text':
      default:
        // Para el Input base, pasamos todas las props incluyendo type
        return <Input id={id} type={type} {...props} />
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      {renderInput()}
    </div>
  )
} 