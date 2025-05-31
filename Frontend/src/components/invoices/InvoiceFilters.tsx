// Frontend/src/components/invoices/InvoiceFilters.tsx
import { useState, useEffect } from 'react'
import type { FactusInvoiceFilters } from '../../services/factusInvoicesService'
import RoundedInput from '../common/RoundedInput'
import { SelectNative } from '../SelectNative'
import { Button } from '../common/Button'

interface InvoiceFiltersProps {
  onFilter: (filters: Partial<FactusInvoiceFilters>) => void
  onReset: () => void
  initialFilters?: Partial<FactusInvoiceFilters>
}

const InvoiceFilters = ({ onFilter, onReset, initialFilters }: InvoiceFiltersProps) => {
  const [filters, setFilters] = useState<Partial<FactusInvoiceFilters>>({
    status: 1,
    ...initialFilters
  })

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])

  const handleFilterChange = (key: keyof FactusInvoiceFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({ status: 1 })
    onReset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-1">
        <div className="flex-1 min-w-[150px]">
          <RoundedInput
            placeholder="Identificación"
            value={filters.identification || ''}
            onChange={(e) => handleFilterChange('identification', e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <RoundedInput
            placeholder="Nombre del cliente"
            value={filters.names || ''}
            onChange={(e) => handleFilterChange('names', e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <RoundedInput
            placeholder="Número de factura (ej: SETP00000000)"
            value={filters.number || ''}
            onChange={(e) => handleFilterChange('number', e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <RoundedInput
            placeholder="Prefijo (ej: SETP)"
            value={filters.prefix || ''}
            onChange={(e) => handleFilterChange('prefix', e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <RoundedInput
            placeholder="Código de referencia"
            value={filters.reference_code || ''}
            onChange={(e) => handleFilterChange('reference_code', e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <SelectNative
            value={String(filters.status ?? 1)}
            onChange={(e) => handleFilterChange('status', Number(e.target.value))}
            className="rounded-2xl"
          >
            <option value="1">Validadas</option>
            <option value="0">Pendientes</option>
            <option value="2">Anuladas</option>
          </SelectNative>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          size="md"
        >
          Limpiar Filtros
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
        >
          Buscar
        </Button>
      </div>
    </form>
  )
}

export default InvoiceFilters