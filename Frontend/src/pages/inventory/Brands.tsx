import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/common/Button'
import { Plus, Search, X, Pencil, Check, X as XIcon } from 'lucide-react'
import Container from '@/components/common/Container'
import Section from '@/components/common/Section'
import PageTitle from '@/components/common/PageTitle'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Input } from '@/components/common/Input'
import { getBrands, type Brand } from '@/services/brandService'
import { useBrandActions } from '@/hooks/useBrandActions'
import { BrandForm } from '@/components/forms/BrandForm'
// Componente de Modal personalizado
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="py-2">{children}</div>
      </div>
    </div>
  )
}

type BrandFilters = {
  search?: string
  is_active?: boolean
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const Brands: React.FC = () => {
  const [filters, setFilters] = useState<BrandFilters>({
    search: '',
    is_active: true,
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

  const { data: brands, isLoading, error } = useQuery({
    queryKey: ['brands', filters],
    queryFn: () => getBrands(filters),
    keepPreviousData: true
  })

  const { createBrand, updateBrand, toggleBrandStatus, isLoading: isActionLoading } = useBrandActions()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))
  }

  const toggleActiveFilter = () => {
    setFilters(prev => ({
      ...prev,
      is_active: prev.is_active === undefined ? false : prev.is_active === false ? undefined : false,
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setIsFormOpen(true)
  }

  const handleToggleStatus = async (brand: Brand) => {
    await toggleBrandStatus(brand)
  }

  const handleSubmit = async (data: any) => {
    if (editingBrand) {
      await updateBrand({ id: editingBrand.uuid, data })
    } else {
      await createBrand(data)
    }
    setIsFormOpen(false)
    setEditingBrand(null)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingBrand(null)
  }

  return (
    <Container>
      <Header />
      <main className="flex-1">
        <div className="p-4">
          <Section className="mb-8">
            <div className="flex justify-between items-center">
              <PageTitle
                title="Marcas"
                description="Administra las marcas de productos"
                size="lg"
                align="left"
              />
              <Button onClick={() => setIsFormOpen(true)} disabled={isActionLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Marca
              </Button>
            </div>
          </Section>

          <Section>
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
                      variant="ghost-primary"
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
                    disabled={isLoading}
                  >
                    {filters.is_active === true ? 'Activas' : filters.is_active === false ? 'Inactivas' : 'Todas'}
                  </Button>
                </div>
              </div>

              <div className="rounded-md border bg-white dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          sortBy: 'name',
                          sortOrder: prev.sortBy === 'name' && prev.sortOrder === 'asc' ? 'desc' : 'asc'
                        }))}
                      >
                        <div className="flex items-center">
                          Nombre
                          {filters.sortBy === 'name' && (
                            <span className="ml-1">
                              {filters.sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={`skeleton-${i}`}>
                          <td className="px-6 py-4 whitespace-nowrap">

                          </td>
                        </tr>
                      ))
                    ) : brands?.length ? (
                      brands.map((brand) => (
                        <tr key={brand.uuid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {brand.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-300 line-clamp-1">
                              {brand.description || 'Sin descripción'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${brand.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                              {brand.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost-primary"
                                size="icon"
                                onClick={() => handleEdit(brand)}
                                disabled={isActionLoading}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost-primary"
                                size="icon"
                                onClick={() => handleToggleStatus(brand)}
                                disabled={isActionLoading}
                              >
                                {brand.is_active ? (
                                  <XIcon className="h-4 w-4 text-red-600" />
                                ) : (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No se encontraron marcas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {brands && brands.length > 0 && (
                <div className="flex items-center justify-between px-2 py-3">
                  <div className="text-sm text-gray-500">
                    Mostrando <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(filters.page * filters.limit, brands.length)}
                    </span>{' '}
                    de <span className="font-medium">{brands.length}</span> resultados
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1 || isLoading}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={!brands || brands.length < filters.limit || isLoading}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>
      </main>
      <Footer />

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingBrand ? 'Editar Marca' : 'Nueva Marca'}
      >
        <BrandForm
          initialData={editingBrand}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isActionLoading}
        />
      </Modal>
    </Container>
  )
}

export default Brands