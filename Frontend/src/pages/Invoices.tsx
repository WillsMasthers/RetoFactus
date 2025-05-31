import React, { useEffect } from 'react'
import Header from '../components/Header'
import { Text } from '@tremor/react'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import StatusBadge from '../components/common/StatusBadge'
import { useFactusInvoicesStore } from '../store/factusInvoicesStore'
import InvoiceFilters from '../components/invoices/InvoiceFilters'
import type { FactusInvoice, FactusInvoiceFilters } from '../services/factusInvoicesService'
import Container from '../components/common/Container'
import { EyeIcon, PencilIcon, ArrowDownTrayIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { Button } from '../components/common/Button'
import { useNavigate } from 'react-router-dom'

const Footer = React.lazy(() => import('../components/Footer'))

function Invoices() {
  const {
    invoices,
    isLoading,
    error,
    pagination,
    filters,
    fetchInvoices,
    setFilters,
    clearFilters,
    changePage,
    clearError,
    downloadInvoicePDF,
    downloadInvoiceXML
  } = useFactusInvoicesStore()
  const navigate = useNavigate()

  // Efecto único para manejar la carga inicial y cambios en filtros
  useEffect(() => {
    fetchInvoices()
  }, [filters, fetchInvoices])

  const columns = [
    {
      header: 'Número',
      accessorKey: 'number' as keyof FactusInvoice,
      cell: (value: unknown) => value as string
    },
    {
      header: 'Cliente',
      accessorKey: 'customer' as keyof FactusInvoice,
      cell: (value: unknown) => value as string
    },
    {
      header: 'Fecha',
      accessorKey: 'created_at' as keyof FactusInvoice,
      cell: (value: unknown) => {
        const dateStr = value as string
        // Convertir de "DD-MM-YYYY HH:mm:ss AM/PM" a Date
        const [datePart, timePart] = dateStr.split(' ')
        const [day, month, year] = datePart.split('-')
        const date = new Date(`${year}-${month}-${day} ${timePart}`)
        return date.toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },
    {
      header: 'Total',
      accessorKey: 'total' as keyof FactusInvoice,
      align: 'right' as const,
      cell: (value: unknown) => {
        const total = Number(value as string)
        return `$${total.toLocaleString('es-CO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
      }
    },
    {
      header: 'Estado',
      accessorKey: 'status' as keyof FactusInvoice,
      align: 'center' as const,
      cell: (value: unknown) => {
        const status = Number(value)
        return (
          <StatusBadge
            status={
              status === 0 ? 'Pendiente' :
                status === 1 ? 'Pagada' :
                  status === 2 ? 'Anulada' :
                    'Pendiente'
            }
          />
        )
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'id' as const,
      cell: (value: unknown) => {
        const id = value as number
        return (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewInvoice(id)}
              className="p-1"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadPDF(id)}
              className="p-1"
              title="Descargar PDF"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadXML(id)}
              className="p-1"
              title="Descargar XML"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    }
  ]

  const handleAddInvoice = () => {
    console.log('Agregar nueva factura')
  }

  const handleSearch = (newFilters: Partial<FactusInvoiceFilters>) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    changePage(page)
  }

  const handleViewInvoice = (id: number) => {
    // Buscar la factura por id para obtener su número
    const invoice = invoices.find(inv => inv.id === id)
    if (invoice) {
      navigate(`/invoice/${invoice.number}/view`)
    }
  }

  const handleEditInvoice = (id: number) => {
    console.log('Editar factura:', id)
  }

  const handleDownloadPDF = async (id: number) => {
    try {
      const invoice = invoices.find(inv => inv.id === id)
      if (invoice?.number) {
        await downloadInvoicePDF(invoice.number)
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error)
    }
  }

  const handleDownloadXML = async (id: number) => {
    try {
      const invoice = invoices.find(inv => inv.id === id)
      if (invoice?.number) {
        await downloadInvoiceXML(invoice.number)
      }
    } catch (error) {
      console.error('Error al descargar XML:', error)
    }
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        Error: {error}
      </div>
    )
  }

  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <div className="p-4">
            <section className="mb-8">
              <h1 className="text-3xl font-bold dark:text-white">Facturas</h1>
              <Text className="dark:text-gray-400">Gestión de Facturas</Text>
            </section>

            <section className="mb-6">
              <Card>
                <InvoiceFilters
                  onFilter={handleSearch}
                  onReset={clearFilters}
                  initialFilters={filters}
                />
                <Table <FactusInvoice>
                  data={invoices}
                  columns={columns}
                  title="Facturas"
                  description="Lista de todas las facturas emitidas"
                  isLoading={isLoading}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  actionButton={{
                    label: 'Nueva Factura',
                    onClick: handleAddInvoice
                  }}
                />
              </Card>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </Container>
  )
}

export default Invoices