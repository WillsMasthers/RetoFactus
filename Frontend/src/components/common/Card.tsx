import React from 'react'
import { Card as TremorCard } from '@tremor/react'

interface CardProps {
  children: React.ReactNode
  className?: string
  decoration?: 'top' | 'bottom' | 'left' | 'right'
  decorationColor?: string
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  decoration,
  decorationColor
}) => {
  return (
    <TremorCard
      className={`
        bg-white
        dark:bg-gray-800
        text-gray-900
        dark:text-gray-50
        border
        border-gray-200
        dark:border-gray-700
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
        rounded-2xl
        overflow-hidden
        p-4
        ${className}
      `}
      decoration={decoration}
      decorationColor={decorationColor}
    >
      {children}
    </TremorCard>
  )
}

export default Card