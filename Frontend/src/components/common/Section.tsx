import React from 'react'

interface SectionProps {
  children: React.ReactNode
  className?: string // Para estilos adicionales o overrides
  bgColorClass?: string // Propiedad explícita para la clase de color de fondo temática
  title?: string
  titleSize?: 'sm' | 'md' | 'lg'
}

const titleSizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl'
}

function Section({
  children,
  className = '',
  bgColorClass = '',
  title,
  titleSize = 'md'
}: SectionProps) {
  // Combinar padding por defecto con bgColorClass y className
  // bgColorClass aplicará una clase de color de fondo
  // className puede añadir otros estilos o sobrescribir padding/margin
  const combinedClasses = `${bgColorClass} ${className}`

  return (
    <section className={combinedClasses}>
      {title && (
        <h2 className={`font-semibold mb-4 text-text dark:text-slate-50 ${titleSizeClasses[titleSize]}`}>
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

export default Section
