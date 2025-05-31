import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'ghost' | 'outline' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  loading = false,
  disabled,
  icon,
  iconPosition = 'left',
  ...props
}: ButtonProps) => {
  const baseStyles = `
    rounded-2xl
    font-medium
    transition-all
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    disabled:opacity-50
    disabled:cursor-not-allowed
  `

  const variantStyles = {
    primary: `
      bg-blue-600
      text-white
      hover:bg-blue-700
      dark:bg-blue-500
      dark:hover:bg-blue-600
    `,
    secondary: `
      bg-gray-200
      text-gray-700
      hover:bg-gray-300
      dark:bg-gray-800
      dark:text-gray-300
      dark:hover:bg-gray-700
    `,
    danger: `
      bg-red-600
      text-white
      hover:bg-red-700
      dark:bg-red-500
      dark:hover:bg-red-600
    `,
    success: `
      bg-green-600
      text-white
      hover:bg-green-700
      dark:bg-green-500
      dark:hover:bg-green-600
    `,
    warning: `
      bg-yellow-500
      text-white
      hover:bg-yellow-600
      dark:bg-yellow-400
      dark:hover:bg-yellow-500
    `,
    info: `
      bg-sky-500
      text-white
      hover:bg-sky-600
      dark:bg-sky-400
      dark:hover:bg-sky-500
    `,
    light: `
      bg-gray-100
      text-gray-800
      hover:bg-gray-200
      dark:bg-gray-700
      dark:text-gray-100
      dark:hover:bg-gray-600
    `,
    dark: `
      bg-gray-800
      text-white
      hover:bg-gray-900
      dark:bg-gray-700
      dark:hover:bg-gray-600
    `,
    link: `
      text-blue-600
      hover:text-blue-700
      hover:underline
      dark:text-blue-400
      dark:hover:text-blue-300
    `,
    ghost: `
      hover:bg-gray-100
      text-gray-700
      dark:hover:bg-gray-800
      dark:text-gray-300
    `,
    outline: `
      border-2
      border-blue-600
      text-blue-600
      hover:bg-blue-50
      dark:border-blue-500
      dark:text-blue-500
      dark:hover:bg-blue-900/20
    `,
    soft: `
      bg-blue-50
      text-blue-600
      hover:bg-blue-100
      dark:bg-blue-900/20
      dark:text-blue-400
      dark:hover:bg-blue-900/30
    `
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${className}
        ${loading ? 'relative' : ''}
        ${icon ? 'flex flex-row items-center justify-center gap-2' : ''}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      <span className={`${loading ? 'invisible' : ''} flex items-center gap-2`}>
        {iconPosition === 'left' && icon}
        {children}
        {iconPosition === 'right' && icon}
      </span>
    </button>
  )
} 