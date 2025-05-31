import React from 'react'
import { TextInput } from '@tremor/react'

interface RoundedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const RoundedInput = React.forwardRef<HTMLInputElement, RoundedInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <TextInput
          ref={ref}
          className={`w-full rounded-xl
            dark:border-gray-800  
            dark:bg-gray-950 
            text-gray-600 
            dark:text-gray-50 shadow-xs
            placeholder:text-red-600
            placeholder:italic
            transition-all 
            sm:text-sm  
            ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

RoundedInput.displayName = 'RoundedInput'

export default RoundedInput 