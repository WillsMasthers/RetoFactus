import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from './common/Button'
import { NavLink } from 'react-router-dom'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../hooks/useTheme'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout, isLoading } = useAuthStore()
  const { themeMode, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

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

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-200 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/ventas')}
                className="text-gray-200 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Ventas
              </button>
              <button
                onClick={() => navigate('/gastos')}
                className="text-gray-200 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Gastos
              </button>
            </nav>

            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
            >
              <DocumentTextIcon className="mr-3 h-5 w-5" />
              Facturas
            </NavLink>
            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
            >
              <DocumentTextIcon className="mr-3 h-5 w-5" />
              Tickets
            </NavLink>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Cambiar tema (actual: ${themeMode})`}
            >
              {themeMode === 'light' ? '☀️' : themeMode === 'dark' ? '🌙' : '💻'}
            </button>

            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => navigate('/mi-empresa')}
                  className="text-gray-200 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {user.nombre || user.username}
                </button>
              )}
              <Button
                onClick={handleLogout}
                disabled={isLoading}
                variant='warning'
                loading={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 