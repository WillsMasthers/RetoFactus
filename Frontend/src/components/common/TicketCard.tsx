import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import PaymentModal from './PaymentModal'

interface TicketCardProps {
  type: 'new' | 'existing'
  ticketNumber?: string
  customer?: string
  total?: number
  onClick?: () => void
}

const TicketHoles: React.FC = () => {
  return (
    <div className="absolute -left-2 top-0 bottom-0 w-4 flex flex-col items-center justify-center space-y-3">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"
        />
      ))}
    </div>
  )
}

const TicketCard: React.FC<TicketCardProps> = ({
  type,
  ticketNumber,
  customer,
  total,
  onClick
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const baseClasses = "relative bg-white dark:bg-gray-800 shadow-sm p-4 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 w-[200px] h-[300px] rounded-r-lg"

  const handleTotalClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita que se propague al onClick del ticket
    setShowPaymentModal(true)
  }

  if (type === 'new') {
    return (
      <div
        onClick={onClick}
        className={`${baseClasses} flex flex-col items-center justify-center`}
      >
        <TicketHoles />
        <div className="pl-6 flex flex-col items-center text-center">
          <PlusIcon className="h-12 w-12 text-gray-400 mb-4" />
          <span className="text-base font-medium text-gray-600 dark:text-gray-300">Crear Ticket</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        onClick={onClick}
        className={baseClasses}
      >
        <TicketHoles />
        <div className="pl-6 h-full flex flex-col justify-between text-center">
          <div className="w-full">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Ticket #{ticketNumber}
            </div>
          </div>

          <div className="w-full">
            {customer && (
              <>
                <div className="text-xs text-gray-500 dark:text-gray-400">Cliente</div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">{customer}</div>
              </>
            )}
          </div>

          <div className="w-full">
            {total !== undefined && (
              <>
                <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600 my-2"></div>
                <div
                  className="w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                  onClick={handleTotalClick}
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    ${Number(total).toLocaleString('es-CO', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          total={total || 0}
          ticketNumber={ticketNumber || ''}
          customer={customer}
        />
      )}
    </>
  )
}

export default TicketCard 