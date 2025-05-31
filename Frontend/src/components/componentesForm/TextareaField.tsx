import React from "react"

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export const TextareaField = ({ label, id, ...props }: TextareaFieldProps) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium mb-1 block">{label}</label>
    <textarea
      id={id}
      {...props}
      className={`w-full rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 py-2 px-3 shadow-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm ${props.className || ""}`}
    />
  </div>
) 