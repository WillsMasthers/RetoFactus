import React from "react"

export const SelectNative = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ children, className = "", ...props }, ref) => (
    <select
      ref={ref}
      className={`peer w-full cursor-pointer appearance-none truncate rounded-md border py-2 pl-3 pr-7 shadow-xs outline-hidden transition-all sm:text-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 hover:bg-gray-50 dark:hover:bg-gray-950/50 disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
)

SelectNative.displayName = "SelectNative" 