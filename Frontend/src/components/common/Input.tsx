import React from "react"
import type { InputHTMLAttributes } from "react"

export const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
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
        ${className || ""}
      `}
      {...props}
    />
  )
})

Input.displayName = 'Input'
export default Input 