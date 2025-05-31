import { useState, useEffect } from 'react'

// Definición de las claves de tema
export const themeKeys = {
  system: 'system',
  light: 'light',
  dark: 'dark'
} as const

// Tipo para las claves de tema
export type ThemeKey = (typeof themeKeys)[keyof typeof themeKeys]

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState<ThemeKey>(() => {
    const savedTheme = localStorage.getItem('themeMode')
    return (savedTheme as ThemeKey) || themeKeys.system
  })

  // Efecto para aplicar el tema inicial y escuchar cambios
  useEffect(() => {
    const applyTheme = () => {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      const isDark =
        themeMode === themeKeys.dark ||
        (themeMode === themeKeys.system && systemPrefersDark)

      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Aplicar tema inmediatamente
    applyTheme()
    localStorage.setItem('themeMode', themeMode)

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (themeMode === themeKeys.system) {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  // Función para cambiar al siguiente tema
  const toggleTheme = () => {
    const themes: ThemeKey[] = [
      themeKeys.light,
      themeKeys.dark,
      themeKeys.system
    ]
    const currentIndex = themes.indexOf(themeMode)
    const nextIndex = (currentIndex + 1) % themes.length
    setThemeMode(themes[nextIndex])
  }

  return {
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark: document.documentElement.classList.contains('dark')
  }
}
