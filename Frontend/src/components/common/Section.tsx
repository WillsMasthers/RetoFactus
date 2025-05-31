import React from 'react'

interface SectionProps {
  children: React.ReactNode
  className?: string // Para estilos adicionales o overrides
  bgColorClass?: string // Propiedad explícita para la clase de color de fondo temática
}

const Section: React.FC<SectionProps> = ({ children, className, bgColorClass }) => {
  // Combinar padding por defecto con bgColorClass y className
  // bgColorClass aplicará una clase de color de fondo
  // className puede añadir otros estilos o sobrescribir padding/margin
  const combinedClasses = `${bgColorClass || ''} ${className || ''}` // Añade algo de padding vertical por defecto

  return (
    <section className={`${combinedClasses}`}>
      {children}
    </section>
  )
}

export default Section
