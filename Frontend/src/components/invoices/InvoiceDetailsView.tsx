import React from 'react'
import Card from '../common/Card'
import { Text } from '@tremor/react'
import StatusBadge from '../common/StatusBadge'

interface InvoiceDetailsViewProps {
  invoice: {
    status: string
    data: {
      bill: {
        number: string
        status: number
        created_at: string
        total: string
        payment_form: {
          name: string
        }
        customer: {
          names: string
          identification: string
        }
      }
    }
  }
}

export default function InvoiceDetailsView({ invoice }: InvoiceDetailsViewProps) {
  if (!invoice?.data?.bill) {
    return <div>Cargando...</div>
  }

  const bill = invoice.data.bill

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Factura #{bill.number}</h1>
          <Text>Fecha: {new Date(bill.created_at).toLocaleDateString('es-CO')}</Text>
        </div>
        <StatusBadge
          status={
            bill.status === 0 ? 'Pendiente' :
              bill.status === 1 ? 'Pagada' :
                bill.status === 2 ? 'Anulada' :
                  'Pendiente'
          }
        />
      </div>

      {/* Información del Cliente */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text className="text-gray-500">Cliente</Text>
              <p className="font-medium">{bill.customer.names}</p>
            </div>
            <div>
              <Text className="text-gray-500">Identificación</Text>
              <p className="font-medium">{bill.customer.identification}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detalles de Pago */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Detalles de Pago</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text className="text-gray-500">Forma de Pago</Text>
              <p className="font-medium">{bill.payment_form.name}</p>
            </div>
            <div>
              <Text className="text-gray-500">Total</Text>
              <p className="font-medium text-lg">
                ${Number(bill.total).toLocaleString('es-CO', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Aquí se pueden agregar más secciones según los datos disponibles */}
    </div>
  )
} 