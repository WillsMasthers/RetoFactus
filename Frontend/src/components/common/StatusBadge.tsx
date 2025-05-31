import React from 'react'

type StatusType = 'Pagada' | 'Pendiente' | 'Pago Parcial' | 'Anulada' | 'Vencida'

interface StatusBadgeProps {
  status: StatusType
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'Pagada':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'Pendiente':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'Pago Parcial':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Anulada':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
      case 'Vencida':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <span className={`
      px-3 
      py-1 
      rounded-full 
      text-sm 
      font-medium
      ${getStatusStyles(status)}
    `}>
      {status}
    </span>
  )
}

export default StatusBadge