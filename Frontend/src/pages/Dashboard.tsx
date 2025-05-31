/*
 * @file Dashboard.tsx
 * @description Componente principal del dashboard que muestra métricas y gráficos
 */

import React, { useState, useEffect } from 'react'
import { Title, Text, Metric, BarChart } from '@tremor/react'
import Card from '../components/common/Card'
import { useAuthStore } from '../store/authStore'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import Section from '../components/common/Section'
import Container from '../components/common/Container'

// Importar el componente Footer de forma dinámica
const Footer = React.lazy(() => import('../components/Footer'))

// Importar componentes y data para el Showcase
import { Button } from '../components/common/Button'
import { InputField } from '../components/componentesForm/InputField'
import Table from '../components/common/Table'
import StatusBadge from '../components/common/StatusBadge'

// Dummy data for Table Showcase
const dummyData = [
  { id: 1, name: 'Factura 001', quantity: 1, price: 150.00, status: 'Pagada' },
  { id: 2, name: 'Factura 002', quantity: 1, price: 300.50, status: 'Pendiente' },
  { id: 3, name: 'Factura 003', quantity: 1, price: 75.00, status: 'Anulada' },
]

// Dummy columns for Table Showcase
const dummyColumns = [
  { header: 'ID', accessorKey: 'id' as const, cell: (value: unknown) => value as number },
  { header: 'Name', accessorKey: 'name' as const, cell: (value: unknown) => value as string },
  { header: 'Quantity', accessorKey: 'quantity' as const, cell: (value: unknown) => value as number },
  { header: 'Price', accessorKey: 'price' as const, cell: (value: unknown) => `$${(value as number).toFixed(2)}` },
  { header: 'Estado', accessorKey: 'status' as const, cell: (value: unknown) => <StatusBadge status={value as 'Pagada' | 'Pendiente' | 'Anulada'} /> },
]

function Dashboard() {
  const [darkMode, setDarkMode] = React.useState(false)
  const { user, isAuthenticated, isLoading } = useAuthStore()

  const navigate = useNavigate()

  // Redirigir si no está autenticado
  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login')
    }
  }, [isAuthenticated, isLoading, navigate])

  // Estado para InputField Showcase
  const [inputValue, setInputValue] = useState('')
  const [numericInputValue, setNumericInputValue] = useState('')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Datos de ejemplo para el gráfico original del Dashboard
  const chartData = [
    { name: 'Enero', 'Ventas': 2890, 'Gastos': 2338 },
    { name: 'Febrero', 'Ventas': 2756, 'Gastos': 2103 },
    { name: 'Marzo', 'Ventas': 3322, 'Gastos': 2194 },
  ]

  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        {/* Header con navegación y controles de usuario */}
        <Header />

        {/* Contenido principal */}
        <main className="flex-1">
          <div className="p-4">
            {/* Encabezado del dashboard */}
            <Section className="mb-8">
              <h1 className="text-3xl font-bold dark:text-slate-50 text-slate-900 ">Dashboard</h1>
              <Text className="text-gray-700 dark:text-gray-300">Bienvenido, {user?.nombre}</Text>
            </Section>

            {/* Navegación */}
            <Section className="mb-6">
              <nav className="flex gap-4">
                <Button
                  onClick={() => navigate('/invoices')}
                  className="px-4 py-2 bg-primary text-text rounded hover:bg-primary-hover"
                >
                  Facturas
                </Button>
                <Button
                  onClick={() => navigate('/sales')}
                  className="px-4 py-2 bg-secondary text-text rounded hover:bg-secondary-hover"
                >
                  Ventas
                </Button>
                <Button
                  onClick={() => navigate('/gastos')}
                  className="px-4 py-2 bg-tertiary text-text rounded hover:bg-tertiary-hover"
                >
                  Gastos
                </Button>
              </nav>
            </Section>

            {/* Tarjetas de métricas principales del Dashboard */}
            <Section className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Tarjeta de Ventas Totales */}
              <Card className="flex-1">
                <Text className="tct-secondary">Ventas Totales</Text>
                <Metric className="text-text">$ 45,231.89</Metric>
              </Card>
              {/* Tarjeta de Gastos Totales */}
              <Card className="flex-1">
                <Text className="ct-secondary">Gastos Totales</Text>
                <Metric className="text-text">$ 23,456.78</Metric>
              </Card>
              {/* Tarjeta de Balance */}
              <Card className="flex-1">
                <Text className="text-textSecondary">Balance</Text>
                <Metric className="text-text">$ 21,775.11</Metric>
              </Card>
            </Section>

            {/* Gráfico de resumen del Dashboard */}
            <Section className="mt-6 mb-8">
              <Card>
                <Title className="text-text">Resumen de Ventas vs Gastos</Title>
                <BarChart
                  className="mt-4 h-72"
                  data={chartData}
                  index="name"
                  categories={['Ventas', 'Gastos']}
                  colors={['blue', 'red']}
                  valueFormatter={(number: number) => `$ ${number.toLocaleString()}`}
                  yAxisWidth={48}
                />
              </Card>
            </Section>

            {/* Button Showcase */}
            <Section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-text">Buttons</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" size="sm">Primary Small</Button>
                <Button variant="primary" size="md">Primary Medium</Button>
                <Button variant="primary" size="lg">Primary Large</Button>
                <Button variant="secondary" size="md">Secondary</Button>
                <Button variant="danger" size="md">Danger</Button>
                <Button variant="success" size="md">Success</Button>
                <Button variant="warning" size="md">Warning</Button>
                <Button variant="info" size="md">Info</Button>
                <Button variant="light" size="md">Light</Button>
                <Button variant="dark" size="md">Dark</Button>
                <Button variant="link" size="md">Link</Button>
                <Button variant="ghost" size="md">Ghost</Button>
                <Button variant="outline" size="md">Outline</Button>
                <Button variant="soft" size="md">Soft</Button>
                <Button fullWidth size="md">Full Width Button</Button>
              </div>
            </Section>

            {/* InputField Showcase */}
            <Section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-text dark:text-slate-50">Input Fields</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                <InputField label="Standard Input" placeholder="Enter text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <InputField label="Required Input" required placeholder="Required field" />
                <InputField label="Numeric Input" onlyNumbers placeholder="Enter numbers" value={numericInputValue} onInput={(e) => setNumericInputValue(e.currentTarget.value)} />
              </div>
            </Section>

            {/* Card Showcase */}
            <Section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-text dark:text-slate-50">Card</h2>
              <Card>
                <p className="text-text">This is a simple card component. It provides a container with padding, rounded corners, and a shadow.</p>
              </Card>
            </Section>

            {/* Table Showcase */}
            <Section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-text dark:text-slate-50">Table</h2>
              <Card>
                <Table
                  data={dummyData}
                  columns={dummyColumns}
                  title="Dummy Data Table"
                  description="Showing a preview of the table component."
                  isLoading={false}
                  pagination={{ currentPage: 1, totalPages: 1, totalItems: dummyData.length, itemsPerPage: 10 }}
                  onPageChange={() => { }}
                  actionButton={{ label: 'Add Item', onClick: () => console.log('Add clicked') }}
                />
              </Card>
            </Section>

            {/* StatusBadge Showcase */}
            <Section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-text dark:text-slate-50">Status Badges</h2>
              <div className="flex gap-4">
                <StatusBadge status="Pagada" />
                <StatusBadge status="Pendiente" />
                <StatusBadge status="Anulada" />
              </div>
            </Section>
          </div>
        </main>

        {/* Footer con información legal y enlaces */}
        <Footer />
      </div>
    </Container>
  )
}

export default Dashboard