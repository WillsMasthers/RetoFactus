import { useTheme } from '../hooks/useTheme'

export const NoHeader = () => {
  const { themeMode, toggleTheme } = useTheme()

  return (
    <header className="bg-gray-700 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="https://www.factus.com.co/_astro/logo-white.ywiieubc.png"
              alt="Factus Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-200 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Cambiar tema (actual: ${themeMode})`}
            >
              {themeMode === 'light' ? '☀️' : themeMode === 'dark' ? '🌙' : '💻'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 