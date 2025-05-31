import React from 'react'
import Header from '../components/Header'
import { Text } from '@tremor/react'
import Card from '../components/common/Card'
import Container from '../components/common/Container'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { PencilIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

const Footer = React.lazy(() => import('../components/Footer'))

function TicketDetails() {
  const { ticketNumber } = useParams()
  const navigate = useNavigate()

  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <div className="p-4">
            <section className="mb-8">
              <h1 className="text-3xl font-bold dark:text-white">Detalles del Ticket</h1>
              <Text className="dark:text-gray-400">Información detallada del ticket {ticketNumber}</Text>
            </section>

            <section className="mb-6">
              <Card>
                <div className="p-4">
                  <div className="flex justify-end space-x-2 mb-4">
                    <Button
                      variant="primary"
                      icon={<PencilIcon className="h-4 w-4" />}
                      onClick={() => navigate(`/ticket/${ticketNumber}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="success"
                      icon={<DocumentArrowDownIcon className="h-4 w-4" />}
                      onClick={() => {/* TODO: Implementar descarga de PDF */ }}
                    >
                      PDF
                    </Button>
                  </div>

                  {/* TODO: Implementar detalles del ticket */}
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Detalles en construcción...
                    </p>
                  </div>
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

export default TicketDetails 