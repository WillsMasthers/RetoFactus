/*
 * @file Dashboard.tsx
 * @description Componente principal del dashboard que muestra métricas y gráficos
 */

import React, { useEffect } from 'react'
import { Text, Metric, BarChart } from '@tremor/react'
import Card from '../components/common/Card'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import Section from '../components/common/Section'
import { Button } from '../components/common/Button'
import PageTemplate from './PageTemplate'

function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login')
    }
  }, [isAuthenticated, isLoading, navigate])

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

  // Datos de ejemplo para el gráfico del Dashboard
  const chartData = [
    { name: 'Enero', 'Ventas': 2890, 'Gastos': 2338 },
    { name: 'Febrero', 'Ventas': 2756, 'Gastos': 2103 },
    { name: 'Marzo', 'Ventas': 3322, 'Gastos': 2194 },
  ]

  return (
    <PageTemplate
      title="Dashboard"
      description={`Bienvenido, ${user?.nombre}`}
    >
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

      {/* Tarjetas de métricas principales */}
      <Section className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Tarjeta de Ventas Totales */}
        <Card className="flex-1">
          <Text className="text-secondary">Ventas Totales</Text>
          <Metric className="text-text">$ 45,231.89</Metric>
        </Card>
        {/* Tarjeta de Gastos Totales */}
        <Card className="flex-1">
          <Text className="text-secondary">Gastos Totales</Text>
          <Metric className="text-text">$ 23,456.78</Metric>
        </Card>
        {/* Tarjeta de Balance */}
        <Card className="flex-1">
          <Text className="text-secondary">Balance</Text>
          <Metric className="text-text">$ 21,775.11</Metric>
        </Card>
      </Section>

      {/* Gráfico de resumen */}
      <Section className="mt-6">
        <Card>
          <Text className="text-text">Resumen de Ventas vs Gastos</Text>
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
    </PageTemplate>
  )
}

export default Dashboard