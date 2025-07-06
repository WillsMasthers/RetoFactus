import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`flex flex-col min-h-screen bg-gray-200 dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  )
}

export default Container 