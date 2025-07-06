import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBrand, updateBrand, deleteBrand, type Brand, type CreateBrandDto, type UpdateBrandDto } from '@/services/brandService'
import { toast } from 'sonner'

export function useBrandActions() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateBrandDto) => createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Marca creada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la marca: ${error.message}`)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandDto }) => updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Marca actualizada correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la marca: ${error.message}`)
    }
  })

  const toggleStatusMutation = useMutation({
    mutationFn: (brand: Brand) => 
      updateBrand(brand.uuid, { is_active: !brand.is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Estado de la marca actualizado correctamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el estado: ${error.message}`)
    }
  })

  return {
    createBrand: createMutation.mutateAsync,
    updateBrand: updateMutation.mutateAsync,
    toggleBrandStatus: toggleStatusMutation.mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending || toggleStatusMutation.isPending
  }
}
