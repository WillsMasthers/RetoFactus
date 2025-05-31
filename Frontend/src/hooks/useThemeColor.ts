import { useState, useEffect } from 'react'
import { colors, type ThemeColors } from '../config/theme'

// Definir un tipo auxiliar para las claves de primer nivel que tienen variantes light/dark
type TopLevelThemedColorKey = keyof Omit<
  ThemeColors,
  'input' | 'textSecondary' | 'textMuted' | 'border' | 'hover'
>

export function useThemeColor(key: TopLevelThemedColorKey) {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  // Asegurarse de que la clave existe y tiene las variantes light/dark
  const color = isDarkMode ? colors[key]?.dark : colors[key]?.light

  // Devolver un fallback si la propiedad no existe (aunque el tipo TopLevelThemedColorKey debería evitar esto)
  return color || ''
}
