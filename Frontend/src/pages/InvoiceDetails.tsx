import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFactusInvoicesStore } from '../store/factusInvoicesStore'
import Header from '../components/Header'
import Container from '../components/common/Container'
import Card from '../components/common/Card'
import { Button } from '../components/common/Button'
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import Table from '../components/common/Table'

const Footer = React.lazy(() => import('../components/Footer'))

interface UnitMeasure {
  id: number
  code: string
  name: string
}

interface StandardCode {
  id: number
  code: string
  name: string
}

interface Tribute {
  id: number
  code: string
  name: string
}

interface InvoiceItem {
  scheme_id: null
  code_reference: string
  name: string
  quantity: number
  discount_rate: string
  discount: string
  gross_value: string
  tax_rate: string
  taxable_amount: string
  tax_amount: string
  price: string
  is_excluded: number
  unit_measure: UnitMeasure
  standard_code: StandardCode
  tribute: Tribute
  total: number
  withholding_taxes: any[]
  mandate: null
  [key: string]: unknown
}

interface InvoiceContentProps {
  data: {
    company: {
      url_logo: string
      company: string
      nit: string
      dv: string
      email: string
      phone: string
    }
    customer: {
      names: string
      identification: string
      email: string
      phone: string
    }
    bill: {
      number: string
      created_at: string
      total: string
      qr: string
      qr_image: string
      observation?: string
    }
    items: InvoiceItem[]
  }
}

function InvoiceContent({ data }: InvoiceContentProps) {
  const { company, customer, bill, items } = data

  return (
    <div className="space-y-2">
      {/* Sección superior con empresa y cliente */}
      <section className="flex flex-col md:flex-row gap-2">
        {/* Company Section */}
        <Card className="flex-1">
          <div className="flex items-center gap-4">
            {company.url_logo && (
              <img
                src={company.url_logo}
                alt="Logo empresa"
                className="w-16 h-16 object-contain"
              />
            )}
            <div className='flex flex-col'>
              <h2 className="text-xl font-bold">{company.company}</h2>
              <p>NIT: {company.nit}-{company.dv}</p>
              <span className="text-gray-500">{company.email}</span>
              <span className="text-gray-500">{company.phone}</span>
            </div>
          </div>
        </Card>

        {/* Customer Section */}
        <Card className="flex-1">
          <div className='flex flex-col'>
            <h2 className="text-xl font-bold">👤 Información del Cliente</h2>
            <div>
              <h3 className="font-semibold">{customer.names.toUpperCase()}</h3>
              <p>{customer.identification}</p>
            </div>
            <span className="text-gray-500">{customer.email}</span>
            <span className="text-gray-500">{customer.phone}</span>
          </div>
        </Card>
      </section>

      {/* Bill Section */}
      <section>
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-4">📃 Detalles de la Factura</h2>
              <h3 className="font-semibold">Factura #{bill.number}</h3>
              <p>Fecha: {bill.created_at}</p>
              <p>Total: ${Number(bill.total).toLocaleString('es-CO')}</p>
              {bill.observation && (
                <div className="mt-4">
                  <h3 className="font-semibold">Observaciones </h3>
                  <p>{bill.observation}</p>
                </div>
              )}
            </div>
            {bill.qr_image && (
              <div className="flex flex-col items-center">
                <a
                  href={bill.qr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer"
                >
                  <img
                    src={bill.qr_image}
                    alt="QR Factura"
                    className="w-32 h-32 object-contain transition-transform group-hover:scale-105"
                  />
                  <span className="text-sm text-gray-500 mt-2 block text-center group-hover:text-blue-500">
                    Ver Factura Electrónica
                  </span>
                </a>
              </div>
            )}

          </div>
        </Card>
      </section>

      {/* Items Section */}
      <section>
        <Card>
          <h2 className="text-xl font-bold mb-4">🛍️ Items</h2>
          <Table<InvoiceItem>
            data={items}
            columns={[
              {
                header: 'Código',
                accessorKey: 'code_reference',
                align: 'left'
              },
              {
                header: 'Producto',
                accessorKey: 'name',
                align: 'left'
              },
              {
                header: 'Cantidad',
                accessorKey: 'quantity',
                align: 'right',
                cell: (value) => `${value} ${items.find(i => i.quantity === value)?.unit_measure.name || ''}`
              },
              {
                header: 'Precio Unitario',
                accessorKey: 'price',
                align: 'right',
                cell: (value) => `$${Number(value).toLocaleString('es-CO')}`
              },
              {
                header: 'Descuento',
                accessorKey: 'discount',
                align: 'right',
                cell: (value) => Number(value) > 0 ? `$${Number(value).toLocaleString('es-CO')}` : '-'
              },
              {
                header: 'IVA',
                accessorKey: 'tax_amount',
                align: 'right',
                cell: (value) => `$${Number(value).toLocaleString('es-CO')}`
              },
              {
                header: 'Total',
                accessorKey: 'total',
                align: 'right',
                cell: (value) => `$${Number(value).toLocaleString('es-CO')}`
              }
            ]}
          />

          {/* Totales */}
          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0).toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Descuentos:</span>
                  <span className="font-medium">
                    ${items.reduce((acc, item) => acc + Number(item.discount), 0).toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA:</span>
                  <span className="font-medium">
                    ${items.reduce((acc, item) => acc + Number(item.tax_amount), 0).toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Factura:</span>
                  <span>
                    ${items.reduce((acc, item) => acc + item.total, 0).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

/**
 * Página de detalles de factura que muestra la información completa
 * de una factura específica, incluyendo datos de la empresa, cliente,
 * detalles de la factura y items.
 */
export default function InvoiceDetails() {
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>()
  const navigate = useNavigate()
  const {
    currentInvoice,
    isLoading,
    error,
    fetchInvoiceDetails,
    clearCurrentInvoice,
    downloadInvoicePDF,
    downloadInvoiceXML
  } = useFactusInvoicesStore()

  useEffect(() => {
    if (invoiceNumber) {
      fetchInvoiceDetails(invoiceNumber)
    }
    return () => {
      clearCurrentInvoice()
    }
  }, [invoiceNumber, fetchInvoiceDetails, clearCurrentInvoice])

  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4">
            <div>Cargando...</div>
          </main>
          <Footer />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </main>
          <Footer />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4">
          <nav className='flex justify-between items-center mb-4'>
            <Button
              variant="ghost"
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2"
              icon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Volver a Facturas
            </Button>
            <div className='flex flex-row gap-1'>
              <Button
                variant='success'
                icon={<DocumentArrowDownIcon className="h-4 w-4" />}
                onClick={() => currentInvoice?.data?.bill?.number && downloadInvoicePDF(currentInvoice.data.bill.number)}
                disabled={!currentInvoice?.data?.bill?.number}
              >
                PDF
              </Button>
              <Button
                variant='success'
                icon={<DocumentArrowDownIcon className="h-4 w-4" />}
                onClick={() => currentInvoice?.data?.bill?.number && downloadInvoiceXML(currentInvoice.data.bill.number)}
                disabled={!currentInvoice?.data?.bill?.number}
              >
                XML
              </Button>
            </div>

          </nav>

          {currentInvoice?.data && <InvoiceContent data={currentInvoice.data} />}

          {/* JSON View Section */}
          <section className="mt-8">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Datos en JSON</h2>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(currentInvoice, null, 2)}
              </pre>
            </Card>
          </section>
        </main>
        <Footer />
      </div>
    </Container>
  )
} 