import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  fluid?: boolean
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-900 w-full ${className}`}
    >
      {children}
    </div>
  )
}

export default Container 