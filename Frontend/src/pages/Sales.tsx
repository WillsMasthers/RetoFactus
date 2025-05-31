import React from 'react'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'
import { Card, Title, Text } from '@tremor/react'

const Footer = React.lazy(() => import('../components/Footer'))

function Sales() {
  const [darkMode, setDarkMode] = React.useState(false)
  const { user, isAuthenticated } = useAuthStore()

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <header>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        </header>

        <main className="flex-1">
          <div className="p-4">
            <section className="mb-8">
              <h1 className="text-3xl font-bold dark:text-white">Ventas</h1>
              <Text className="dark:text-gray-400">Gestión de Ventas</Text>
            </section>

            <section className="mb-6">
              <Card className="dark:bg-gray-800">
                <Title className="dark:text-white">Resumen de Ventas</Title>
                {/* Aquí irá el contenido del resumen de ventas */}
              </Card>
            </section>

            <section className="mt-6">
              <Card className="dark:bg-gray-800">
                <Title className="dark:text-white">Detalle de Ventas</Title>
                {/* Aquí irá la tabla o lista de ventas */}
              </Card>
            </section>
          </div>
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  )
}

export default Sales