import React from 'react'
import Header from '../components/Header'
import { Text } from '@tremor/react'
import Card from '../components/common/Card'
import Container from '../components/common/Container'
import { useParams, useNavigate } from 'react-router-dom'

const Footer = React.lazy(() => import('../components/Footer'))

function TicketForm() {
  const { ticketNumber } = useParams()
  const navigate = useNavigate()
  const isEditing = !!ticketNumber

  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <div className="p-4">
            <section className="mb-8">
              <h1 className="text-3xl font-bold dark:text-white">
                {isEditing ? 'Editar Ticket' : 'Nuevo Ticket'}
              </h1>
              <Text className="dark:text-gray-400">
                {isEditing
                  ? 'Modifica los datos del ticket'
                  : 'Crea un nuevo ticket de venta'}
              </Text>
            </section>

            <section className="mb-6">
              <Card>
                {/* TODO: Implementar formulario de ticket */}
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Formulario en construcción...
                  </p>
                </div>
              </Card>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </Container>
  )
}

export default TicketForm 