import React, { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface CollapseProps {
  children: React.ReactNode
  className?: string
  bgColorClass?: string
  title?: string
  titleSize?: 'sm' | 'md' | 'lg'
  description?: string
}

const titleSizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl'
}

export const Collapse: React.FC<CollapseProps> = ({
  children,
  className = '',
  bgColorClass = '',
  title,
  titleSize = 'md',
  description
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const combinedClasses = `${bgColorClass} ${className}`

  // Clases de redondeo condicionales
  const headerRoundedClasses = isOpen ? 'rounded-t-lg' : 'rounded-lg'
  const contentRoundedClasses = isOpen ? 'rounded-b-lg' : ''

  return (
    <div className={`border rounded-lg ${combinedClasses}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 text-left
          flex items-center justify-between
          bg-slate-300 dark:bg-gray-800
          hover:bg-gray-50 dark:hover:bg-gray-700
          transition-colors
          ${headerRoundedClasses}
        `}
        title={description}
      >
        {title && (
          <h2 className={`font-semibold text-text dark:text-slate-50 ${titleSizeClasses[titleSize]}`}>
            {title}
          </h2>
        )}
        <ChevronDownIcon
          className={`
            w-5 h-5 text-gray-500 dark:text-gray-400
            transform transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {isOpen && (
        <div className={`p-4 bg-slate-200 dark:bg-gray-800 border-t dark:border-gray-700 ${contentRoundedClasses}`}>
          {children}
        </div>
      )}
    </div>
  )
} 