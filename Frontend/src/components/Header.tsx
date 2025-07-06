import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from './common/Button'
import { NavLink } from 'react-router-dom'
import { DocumentTextIcon, Bars3Icon, XMarkIcon, ChevronDownIcon, CubeIcon, TagIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../hooks/useTheme'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout, isLoading } = useAuthStore()
  const { themeMode, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [inventoryTimeout, setInventoryTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const closeUserMenu = () => {
    setIsUserMenuOpen(false)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    closeMenu()
    closeUserMenu()
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

          {/* Botón de menú hamburguesa para móviles */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-200 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-md"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Menú de navegación para desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-4">


              <div className="relative">
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (inventoryTimeout) {
                      clearTimeout(inventoryTimeout);
                      setInventoryTimeout(null);
                    }
                    setIsInventoryOpen(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setIsInventoryOpen(false);
                    }, 300); // 300ms de retraso antes de cerrar
                    setInventoryTimeout(timeout);
                  }}
                >
                  <button
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${location.pathname.startsWith('/inventory')
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                  >
                    <CubeIcon className="mr-3 h-5 w-5" />
                    <span>Inventario</span>
                    <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform ${isInventoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Menú desplegable */}
                  {isInventoryOpen && (
                    <div 
                      className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                      onMouseEnter={() => {
                        if (inventoryTimeout) {
                          clearTimeout(inventoryTimeout);
                          setInventoryTimeout(null);
                        }
                      }}
                      onMouseLeave={() => {
                        const timeout = setTimeout(() => {
                          setIsInventoryOpen(false);
                        }, 300); // 300ms de retraso antes de cerrar
                        setInventoryTimeout(timeout);
                      }}
                    >
                      <div className="py-1">
                        <NavLink
                          to="/inventory/products"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={closeMenu}
                        >
                          <CubeIcon className="mr-3 h-5 w-5 text-gray-400" />
                          Productos
                        </NavLink>
                        <NavLink
                          to="/inventory/categories"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={closeMenu}
                        >
                          <ListBulletIcon className="mr-3 h-5 w-5 text-gray-400" />
                          Categorías
                        </NavLink>
                        <NavLink
                          to="/inventory/brands"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={closeMenu}
                        >
                          <TagIcon className="mr-3 h-5 w-5 text-gray-400" />
                          Marcas
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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

            <Button
              onClick={toggleTheme}
              variant="ghost-secondary"
              size="sm"
              className="p-2"
              aria-label={`Cambiar tema (actual: ${themeMode})`}
            >
              {themeMode === 'light' ? '☀️' : themeMode === 'dark' ? '🌙' : '💻'}
            </Button>

            {/* Menú de usuario */}
            {user && (
              <div className="relative">
                <Button
                  onClick={toggleUserMenu}
                  variant="ghost-secondary"
                  size="sm"
                  className="flex items-center text-gray-200 dark:text-gray-400"
                  icon={<ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />}
                  iconPosition="right"
                >
                  {user.nombre || user.username}
                </Button>

                {/* Menú desplegable */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Button
                        onClick={() => handleNavigation('/dashboard')}
                        variant="ghost-secondary"
                        size="sm"
                        fullWidth
                        className="justify-start text-gray-700 dark:text-gray-200"
                      >
                        Dashboard
                      </Button>
                      <Button
                        onClick={() => handleNavigation('/mi-empresa')}
                        variant="ghost-secondary"
                        size="sm"
                        fullWidth
                        className="justify-start text-gray-700 dark:text-gray-200"
                      >
                        Mi Empresa
                      </Button>
                      <Button
                        onClick={handleLogout}
                        disabled={isLoading}
                        variant="ghost-danger"
                        size="sm"
                        fullWidth
                        loading={isLoading}
                        className="justify-start"
                      >
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Button
                onClick={() => handleNavigation('/dashboard')}
                variant="ghost-secondary"
                size="sm"
                fullWidth
                className="justify-start text-gray-200 dark:text-gray-400"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => handleNavigation('/ventas')}
                variant="ghost-secondary"
                size="sm"
                fullWidth
                className="justify-start text-gray-200 dark:text-gray-400"
              >
                Ventas
              </Button>
              <Button
                onClick={() => handleNavigation('/gastos')}
                variant="ghost-secondary"
                size="sm"
                fullWidth
                className="justify-start text-gray-200 dark:text-gray-400"
              >
                Gastos
              </Button>
              <NavLink
                to="/invoices"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                    : 'text-gray-200 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`
                }
              >
                <DocumentTextIcon className="mr-3 h-5 w-5" />
                Facturas
              </NavLink>
              <NavLink
                to="/tickets"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                    : 'text-gray-200 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`
                }
              >
                <DocumentTextIcon className="mr-3 h-5 w-5" />
                Tickets
              </NavLink>
              {user && (
                <Button
                  onClick={() => handleNavigation('/mi-empresa')}
                  variant="ghost-secondary"
                  size="sm"
                  fullWidth
                  className="justify-start text-gray-200 dark:text-gray-400"
                >
                  {user.nombre || user.username}
                </Button>
              )}
              <div className="flex items-center justify-between px-3 py-2">
                <Button
                  onClick={toggleTheme}
                  variant="ghost-secondary"
                  size="sm"
                  className="p-2"
                  aria-label={`Cambiar tema (actual: ${themeMode})`}
                >
                  {themeMode === 'light' ? '☀️' : themeMode === 'dark' ? '🌙' : '💻'}
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={isLoading}
                  variant="ghost-danger"
                  size="sm"
                  loading={isLoading}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 