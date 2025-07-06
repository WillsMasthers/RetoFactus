import React, { useState, useRef, useEffect } from 'react'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="relative">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 w-56 rounded-md shadow-lg
            bg-slate-200 dark:bg-gray-800 ring-1 ring-black ring-opacity-5
            ${align === 'right' ? 'right-0' : 'left-0'}
            transform translateZ(0)
          `}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className = '',
  disabled = false
}) => {
  return (
    <button
      className={`
        w-full text-left px-4 py-2 text-sm
        text-gray-700 dark:text-gray-200
        bg-slate-200 dark:bg-gray-800
        hover:bg-gray-100 dark:hover:bg-gray-700
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
    >
      {children}
    </button>
  )
}

interface DropdownDividerProps {
  className?: string
}

export const DropdownDivider: React.FC<DropdownDividerProps> = ({
  className = ''
}) => {
  return (
    <div
      className={`border-t border-gray-200 dark:border-gray-700 my-1 ${className}`}
      role="separator"
    />
  )
} 