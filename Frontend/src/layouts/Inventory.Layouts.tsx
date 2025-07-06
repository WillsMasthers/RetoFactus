import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Package, Tag, List } from 'lucide-react'
import Container from '../components/common/Container'
import Section from '../components/common/Section'
import PageTitle from '../components/common/PageTitle'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const InventoryLayout: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
      ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
  }

  return (
    <Container>
      <Header />
      <main className="flex-1">
        <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inventario</h2>
            </div>
            <nav className="mt-4">
              <Link
                to="/inventory/products"
                className={`flex items-center px-4 py-3 ${isActive('/inventory/products')}`}
              >
                <Package className="h-5 w-5 mr-3" />
                Productos
              </Link>
              <Link
                to="/inventory/categories"
                className={`flex items-center px-4 py-3 ${isActive('/inventory/categories')}`}
              >
                <List className="h-5 w-5 mr-3" />
                Categorías
              </Link>
              <Link
                to="/inventory/brands"
                className={`flex items-center px-4 py-3 ${isActive('/inventory/brands')}`}
              >
                <Tag className="h-5 w-5 mr-3" />
                Marcas
              </Link>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 overflow-auto p-6">
            <Section>
              <PageTitle
                title="Gestión de Inventario"
                description="Administra productos, categorías y marcas"
                size="lg"
                align="left"
              />
              <div className="mt-6">
                <Outlet />
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  )
}

export default InventoryLayout