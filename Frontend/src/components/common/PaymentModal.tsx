import React, { useState, useRef, useEffect } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, QrCodeIcon } from '@heroicons/react/24/outline'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  ticketNumber: string
  customer?: string
}

const CustomerSearchModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSelect: (customer: string) => void
}> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSelect = () => {
    if (searchTerm.trim()) {
      onSelect(searchTerm.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Buscar Cliente
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ingrese el nombre del cliente"
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <button
          onClick={handleSelect}
          disabled={!searchTerm.trim()}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${searchTerm.trim()
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
        >
          Seleccionar Cliente
        </button>
      </div>
    </div>
  )
}

const QRModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const qrOptions = [
    { id: 'qr1', name: 'QR Principal', icon: '🌄' },
    { id: 'qr2', name: 'QR Secundario', icon: '🌅' },
    { id: 'qr3', name: 'QR Alternativo', icon: '🌇' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Seleccionar QR
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {qrOptions.map((qr) => (
            <button
              key={qr.id}
              onClick={onClose}
              className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 flex items-center space-x-4 transition-colors"
            >
              <span className="text-3xl">{qr.icon}</span>
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {qr.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  ticketNumber,
  customer
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>('cash')
  const [amountToPay, setAmountToPay] = useState(total)
  const [remainingAmount, setRemainingAmount] = useState(0)
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(customer || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isOpen])

  useEffect(() => {
    setRemainingAmount(total - amountToPay)
  }, [amountToPay, total])

  if (!isOpen) return null

  const paymentMethods = [
    { id: 'cash', name: 'Efectivo', icon: '💵' },
    { id: 'card', name: 'Tarjeta', icon: '💳' },
    { id: 'transfer', name: 'Transferencia', icon: '💸' },
    { id: 'qr', name: 'QR', icon: '📱' },
    { id: 'credit', name: 'Crédito', icon: '🪪' },
    { id: 'split', name: 'Dividir Pago', icon: '✂️' }
  ]

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    if (value <= total) {
      setAmountToPay(value)
    }
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    if (methodId === 'credit' && !customer && !selectedCustomer) {
      setShowCustomerSearch(true)
    } else {
      setSelectedPaymentMethod(methodId)
    }
  }

  const handleCustomerSelect = (customerName: string) => {
    setSelectedCustomer(customerName)
    setSelectedPaymentMethod('credit')
  }

  const handlePayment = () => {
    // Aquí irá la lógica de pago
    onClose()
  }

  const isPaymentDisabled = !selectedPaymentMethod ||
    amountToPay <= 0 ||
    (selectedPaymentMethod === 'credit' && !customer && !selectedCustomer)

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pago Rápido - Ticket #{ticketNumber}
              </h2>
              {(customer || selectedCustomer) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Cliente: {customer || selectedCustomer}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Totales */}
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total del Ticket</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${Number(total).toLocaleString('es-CO', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-600 dark:text-blue-400">Monto a Pagar</div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="number"
                  value={amountToPay}
                  onChange={handleAmountChange}
                  className="w-full text-2xl font-bold text-blue-700 dark:text-blue-300 bg-transparent border-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max={total}
                  step="0.01"
                />
              </div>
            </div>

            {remainingAmount > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                <div className="text-sm text-yellow-600 dark:text-yellow-400">Monto Restante</div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  ${Number(remainingAmount).toLocaleString('es-CO', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Métodos de pago */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${selectedPaymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
              >
                <span className="text-2xl mb-2">{method.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {method.name}
                </span>
              </button>
            ))}
          </div>

          {/* Botón de QR si está seleccionado */}
          {selectedPaymentMethod === 'qr' && (
            <button
              onClick={() => setShowQRModal(true)}
              className="w-full py-3 px-4 mb-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <QrCodeIcon className="h-5 w-5" />
              <span>Ver QR Disponibles</span>
            </button>
          )}

          {/* Botón de pago */}
          <button
            onClick={handlePayment}
            disabled={isPaymentDisabled}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${!isPaymentDisabled
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              }`}
          >
            {remainingAmount > 0 ? 'Agregar Pago' : 'Cobrar'}
          </button>
        </div>
      </div>

      <CustomerSearchModal
        isOpen={showCustomerSearch}
        onClose={() => setShowCustomerSearch(false)}
        onSelect={handleCustomerSelect}
      />

      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </>
  )
}

export default PaymentModal 