import React, { useEffect } from 'react'
import Header from '../components/Header'
import { Text } from '@tremor/react'
import Container from '../components/common/Container'
import { useNavigate } from 'react-router-dom'
import { useFactusInvoicesStore } from '../store/factusInvoicesStore'
import TicketCard from '../components/common/TicketCard'

const Footer = React.lazy(() => import('../components/Footer'))

function Tickets() {
  const {
    invoices,
    error,
    setFilters
  } = useFactusInvoicesStore()
  const navigate = useNavigate()

  useEffect(() => {
    setFilters({ status: 0 })
  }, [setFilters])

  const handleAddTicket = () => {
    navigate('/ticket/new')
  }

  const handleViewTicket = (id: number) => {
    const ticket = invoices.find(inv => inv.id === id)
    if (ticket) {
      navigate(`/ticket/${ticket.number}/view`)
    }
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        Error: {error}
      </div>
    )
  }

  // Ejemplos de diferentes estados de tickets
  const exampleTickets = [
    {
      id: 1,
      number: '12345',
      customer: 'Juan Pérez',
      total: 1234567
    },
    {
      id: 2,
      number: '12346',
      total: 567
    },
    {
      id: 3,
      number: '12347',
      customer: 'María García',
      total: 89000
    },
    {
      id: 4,
      number: '12348',
      customer: 'Pedro Antonio Rodríguez Laguerta',
      total: 1500
    }
  ]

  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <div className="p-4">
            <section className="mb-8">
              <h1 className="text-3xl font-bold dark:text-white">Tickets</h1>
              <Text className="dark:text-gray-400">Gestión de Tickets (Ventas Abiertas)</Text>
            </section>

            <section className="mb-6">
              <div className="flex flex-wrap gap-4 justify-start">
                {/* Tarjeta para crear nuevo ticket */}
                <TicketCard
                  type="new"
                  onClick={handleAddTicket}
                />

                {/* Ejemplos de diferentes estados de tickets */}
                {exampleTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    type="existing"
                    ticketNumber={ticket.number}
                    customer={ticket.customer}
                    total={ticket.total}
                    onClick={() => handleViewTicket(ticket.id)}
                  />
                ))}

                {/* Tickets reales del sistema */}
                {invoices.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    type="existing"
                    ticketNumber={ticket.number}
                    customer={ticket.customer}
                    total={ticket.total}
                    onClick={() => handleViewTicket(ticket.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </Container>
  )
}

export default Tickets 