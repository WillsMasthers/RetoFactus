import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Search, X, Pencil, Check, X as XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getBrands, type Brand } from '@/services/brandService'
import { type BrandFilters } from '@/types/inventory/brand.types'

interface BrandsTableProps {
  onEdit: (brand: Brand) => void
  onToggleStatus: (brand: Brand) => void
}

export function BrandsTable({ onEdit, onToggleStatus }: BrandsTableProps) {
  const [filters, setFilters] = useState<BrandFilters>({
    search: '',
    is_active: true,
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 10
  })

  const { data: brands, isLoading, error } = useQuery({
    queryKey: ['brands', filters],
    queryFn: () => getBrands(filters),
    keepPreviousData: true
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))
  }

  const toggleActiveFilter = () => {
    setFilters(prev => ({
      ...prev,
      is_active: prev.is_active === undefined ? false : prev.is_active === false ? true : undefined,
      page: 1
    }))
  }

  const handleSort = (field: 'name' | 'created_at') => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar las marcas
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error instanceof Error ? error.message : 'Ocurrió un error inesperado'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar marcas..."
            className="pl-10"
            value={filters.search || ''}
            onChange={handleSearch}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={filters.is_active === undefined ? 'outline-secondary' : 'secondary'}
            size="sm"
            onClick={toggleActiveFilter}
          >
            {filters.is_active === true ? 'Activas' : filters.is_active === false ? 'Inactivas' : 'Todas'}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Nombre
                  {filters.sortBy === 'name' && (
                    <span className="ml-1">
                      {filters.sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : brands?.length ? (
              brands.map((brand) => (
                <TableRow key={brand.uuid}>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="text-gray-500 line-clamp-1">
                    {brand.description || 'Sin descripción'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={brand.is_active ? 'success' : 'destructive"}>
                      {brand.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(brand)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleStatus(brand)}
                      >
                        {brand.is_active ? (
                          <XIcon className="h-4 w-4 text-red-600" />
                        ) : (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No se encontraron marcas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {brands && brands.length > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
            disabled={filters.page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-700">
            Página {filters.page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange((filters.page || 1) + 1)}
            disabled={!brands || brands.length < (filters.limit || 10)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
