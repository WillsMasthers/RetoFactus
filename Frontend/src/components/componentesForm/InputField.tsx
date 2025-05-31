import React from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  onlyNumbers?: boolean
  required?: boolean
}

export const InputField = ({ label, id, onlyNumbers, required, ...props }: InputFieldProps) => {
  // Handler para filtrar solo números si onlyNumbers está activo
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (onlyNumbers) {
      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "")
    }
    if (props.onInput) props.onInput(e)
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        required={required}
        onInput={handleInput}
        className={`
          w-full
          rounded-md
          border
          border-gray-300
          dark:border-gray-800
          bg-white
          dark:bg-gray-950
          text-gray-900
          dark:text-gray-50
          placeholder-gray-400
          dark:placeholder-gray-500
          py-2
          px-3
          shadow-xs
          outline-none
          focus:ring-2
          focus:ring-blue-500
          transition-all
          sm:text-sm
          ${props.className || ""}
        `}
        placeholder={props.placeholder}
      />
    </div>
  )
} 