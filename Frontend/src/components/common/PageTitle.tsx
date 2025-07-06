import React from 'react'
import { Text } from '@tremor/react'

interface PageTitleProps {
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'left' | 'center' | 'right'
  className?: string
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
  xl: 'text-5xl'
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

function PageTitle({
  title,
  description,
  size = 'md',
  align = 'left',
  className = ''
}: PageTitleProps) {
  return (
    <div className={`mb-6 ${alignClasses[align]} ${className}`}>
      <h1 className={`font-bold dark:text-slate-50 text-slate-900 ${sizeClasses[size]}`}>
        {title}
      </h1>
      {description && (
        <Text className="text-gray-700 dark:text-gray-300 mt-2">
          {description}
        </Text>
      )}
    </div>
  )
}

export default PageTitle 